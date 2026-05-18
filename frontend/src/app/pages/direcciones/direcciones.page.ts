import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Geolocation } from '@capacitor/geolocation';
import { addIcons } from 'ionicons';

import {
  chevronBackOutline,
  locationOutline,
  navigateOutline
} from 'ionicons/icons';

import * as L from 'leaflet';

@Component({
  selector: 'app-direcciones',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss']
})
export class DireccionesPage implements AfterViewInit {

  direccion: string = '';
  referencia: string = '';
  distrito: string = '';

  tipoDireccion: string = 'Casa';

  latitud: number | null = null;
  longitud: number | null = null;

  cargandoUbicacion: boolean = false;

  private map!: L.Map;
  private apiKey = 'f185cd26275a4b59a995b8a8855bfd8f';
  private direccionTimeout: any = null;

  constructor(private router: Router) {
    addIcons({
      chevronBackOutline,
      locationOutline,
      navigateOutline
    });
  }

  ngAfterViewInit() {
    this.cargarDireccion();

    setTimeout(() => {
      this.iniciarMapa();
    }, 300);
  }

  iniciarMapa() {
    const latInicial = this.latitud || -13.1603;
    const lngInicial = this.longitud || -74.2258;

    this.map = L.map('map', {
      center: [latInicial, lngInicial],
      zoom: 18,
      zoomControl: false
    });

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles © Esri'
      }
    ).addTo(this.map);

    this.map.on('moveend', () => {
      const centro = this.map.getCenter();

      this.latitud = centro.lat;
      this.longitud = centro.lng;

      if (this.direccionTimeout) {
        clearTimeout(this.direccionTimeout);
      }

      this.direccionTimeout = setTimeout(() => {
        this.actualizarDireccionDesdeCoords(
          centro.lat,
          centro.lng
        );
      }, 900);
    });

    setTimeout(() => {
      this.map.invalidateSize();
    }, 500);
  }

  cargarDireccion() {
    this.direccion = localStorage.getItem('direccionUsuario') || '';
    this.referencia = localStorage.getItem('referenciaUsuario') || '';
    this.distrito = localStorage.getItem('distritoUsuario') || '';
    this.tipoDireccion = localStorage.getItem('tipoDireccion') || 'Casa';

    const lat = localStorage.getItem('latitudUsuario');
    const lng = localStorage.getItem('longitudUsuario');

    if (lat && lng) {
      this.latitud = Number(lat);
      this.longitud = Number(lng);
    }
  }

  seleccionarTipo(tipo: string) {
    this.tipoDireccion = tipo;
  }

  async usarUbicacionActual() {
    if (this.cargandoUbicacion) return;

    this.cargandoUbicacion = true;

    try {
      const permission = await Geolocation.requestPermissions();

      if (
        permission.location !== 'granted' &&
        permission.coarseLocation !== 'granted'
      ) {
        alert('Debes permitir acceso a ubicación');
        this.cargandoUbicacion = false;
        return;
      }

      const primera = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000
      });

      this.latitud = primera.coords.latitude;
      this.longitud = primera.coords.longitude;

      this.map.setView(
        [this.latitud, this.longitud],
        18
      );

      await this.actualizarDireccionDesdeCoords(
        this.latitud,
        this.longitud
      );

      this.cargandoUbicacion = false;

      let watchId: string | null = null;
      let mejorPosicion = primera;

      const timeout = setTimeout(async () => {
        if (watchId) {
          await Geolocation.clearWatch({ id: watchId });
        }

        await this.actualizarDireccionDesdeCoords(
          mejorPosicion.coords.latitude,
          mejorPosicion.coords.longitude
        );
      }, 15000);

      watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        },
        async (position, error) => {
          if (error || !position) return;

          if (position.coords.accuracy < mejorPosicion.coords.accuracy) {
            mejorPosicion = position;

            this.latitud = position.coords.latitude;
            this.longitud = position.coords.longitude;

            this.map.setView(
              [this.latitud, this.longitud],
              18
            );

            if (this.direccionTimeout) {
              clearTimeout(this.direccionTimeout);
            }

            this.direccionTimeout = setTimeout(async () => {
              await this.actualizarDireccionDesdeCoords(
                this.latitud!,
                this.longitud!
              );
            }, 1500);
          }

          if (position.coords.accuracy <= 15) {
            clearTimeout(timeout);

            if (this.direccionTimeout) {
              clearTimeout(this.direccionTimeout);
            }

            if (watchId) {
              await Geolocation.clearWatch({ id: watchId });
            }

            await this.actualizarDireccionDesdeCoords(
              mejorPosicion.coords.latitude,
              mejorPosicion.coords.longitude
            );
          }
        }
      );

    } catch (error) {
      console.log('ERROR GPS:', error);
      alert('No se pudo obtener tu ubicación. Verifica que el GPS esté activado.');
      this.cargandoUbicacion = false;
    }
  }

  async actualizarDireccionDesdeCoords(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${this.apiKey}&language=es&pretty=1`
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const comp = result.components;

        const partes = [];

        if (comp.road) partes.push(comp.road);
        if (comp.house_number) partes.push(comp.house_number);

        if (comp.city) partes.push(comp.city);
        else if (comp.town) partes.push(comp.town);
        else if (comp.village) partes.push(comp.village);
        else if (comp.suburb) partes.push(comp.suburb);

        if (comp.state) partes.push(comp.state);
        if (comp.country) partes.push(comp.country);

        this.direccion = partes.length > 0
          ? partes.join(', ')
          : result.formatted || 'Ubicación actual';

        this.distrito =
          comp.city ||
          comp.town ||
          comp.village ||
          comp.suburb ||
          comp.state_district ||
          comp.state || '';
      }

    } catch (e) {
      console.log('Error dirección:', e);
    }
  }

  guardar() {
    if (!this.map) return;

    const centro = this.map.getCenter();

    this.latitud = centro.lat;
    this.longitud = centro.lng;

    localStorage.setItem('direccionUsuario', this.direccion.trim());
    localStorage.setItem('referenciaUsuario', this.referencia.trim());
    localStorage.setItem('distritoUsuario', this.distrito.trim());
    localStorage.setItem('tipoDireccion', this.tipoDireccion);

    localStorage.setItem('latitudUsuario', String(this.latitud));
    localStorage.setItem('longitudUsuario', String(this.longitud));

    this.router.navigate(['/mi-cuenta']);
  }

  goBack() {
    this.router.navigate(['/mi-cuenta']);
  }

}