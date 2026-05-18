import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';

import { getAuth } from 'firebase/auth';

import {
  arrowBackOutline,
  chevronBackOutline,
  chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-fecha-nacimiento',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './fecha-nacimiento.page.html',
  styleUrls: ['./fecha-nacimiento.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FechaNacimientoPage {

  fecha: Date | null = null;

  mostrarCalendario = false;
  mostrarSelectorAnio = false;

  hoy = new Date();

  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();

  diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private router: Router) {

    addIcons({
      arrowBackOutline,
      chevronBackOutline,
      chevronForwardOutline
    });

  }

  get anios(): number[] {

    const anios = [];

    for (let a = 1920; a <= this.hoy.getFullYear(); a++) {
      anios.push(a);
    }

    return anios.reverse();

  }

  get esMayorDeEdad(): boolean {

    if (!this.fecha) return true;

    const hoy = new Date();

    let edad =
      hoy.getFullYear() - this.fecha.getFullYear();

    const mes =
      hoy.getMonth() - this.fecha.getMonth();

    if (
      mes < 0 ||
      (
        mes === 0 &&
        hoy.getDate() < this.fecha.getDate()
      )
    ) {
      edad--;
    }

    return edad >= 18;

  }

  get mostrarErrorEdad(): boolean {

    return (
      this.fecha !== null &&
      !this.esMayorDeEdad
    );

  }

  get fechaHeaderStr(): string {

    if (!this.fecha) return '';

    const dias = [
      'Dom',
      'Lun',
      'Mar',
      'Mié',
      'Jue',
      'Vie',
      'Sáb'
    ];

    const meses = [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic'
    ];

    return `
      ${dias[this.fecha.getDay()]},
      ${this.fecha.getDate()}
      ${meses[this.fecha.getMonth()]}
    `;

  }

  get diasCalendario(): (Date | null)[] {

    const dias: (Date | null)[] = [];

    const primero = new Date(
      this.anioActual,
      this.mesActual,
      1
    );

    const ultimo = new Date(
      this.anioActual,
      this.mesActual + 1,
      0
    );

    for (
      let i = 0;
      i < primero.getDay();
      i++
    ) {

      dias.push(null);

    }

    for (
      let d = 1;
      d <= ultimo.getDate();
      d++
    ) {

      dias.push(
        new Date(
          this.anioActual,
          this.mesActual,
          d
        )
      );

    }

    return dias;

  }

  toggleSelectorAnio() {

    this.mostrarSelectorAnio =
      !this.mostrarSelectorAnio;

  }

  seleccionarAnio(anio: number) {

    this.anioActual = anio;

    this.mostrarSelectorAnio = false;

  }

  mesAnterior() {

    if (this.mesActual === 0) {

      this.mesActual = 11;

      this.anioActual--;

    } else {

      this.mesActual--;

    }

  }

  mesSiguiente() {

    if (this.mesActual === 11) {

      this.mesActual = 0;

      this.anioActual++;

    } else {

      this.mesActual++;

    }

  }

  seleccionarDia(dia: Date | null) {

    if (!dia) return;

    this.fecha = new Date(dia);

  }

  esSeleccionado(
    dia: Date | null
  ): boolean {

    if (!dia || !this.fecha)
      return false;

    return (
      dia.toDateString() ===
      this.fecha.toDateString()
    );

  }

  esHoy(dia: Date | null): boolean {

    if (!dia) return false;

    return (
      dia.toDateString() ===
      this.hoy.toDateString()
    );

  }

  getFechaFormateada(): string {

    if (!this.fecha) {

      return 'dd/mm/aaaa';

    }

    const d = this.fecha
      .getDate()
      .toString()
      .padStart(2, '0');

    const m = (
      this.fecha.getMonth() + 1
    )
      .toString()
      .padStart(2, '0');

    const a =
      this.fecha.getFullYear();

    return `${d}/${m}/${a}`;

  }

  abrirCalendario() {

    this.mostrarCalendario = true;

    this.mostrarSelectorAnio = false;

    if (this.fecha) {

      this.mesActual =
        this.fecha.getMonth();

      this.anioActual =
        this.fecha.getFullYear();

    } else {

      this.mesActual =
        this.hoy.getMonth();

      this.anioActual =
        this.hoy.getFullYear();

    }

  }

  cerrarCalendario() {

    this.mostrarCalendario = false;

    this.mostrarSelectorAnio = false;

  }

  aceptar() {

    this.mostrarCalendario = false;

    this.mostrarSelectorAnio = false;

  }

  goBack() {

    this.router.navigate(['/cuenta']);

  }

  finishRegister() {

    if (!this.fecha) {

      alert(
        'Selecciona tu fecha de nacimiento'
      );

      return;

    }

    if (!this.esMayorDeEdad) {
      return;
    }

    const user = getAuth().currentUser;

    // 🔥 GUARDAR FECHA POR UID
    if (user) {

      localStorage.setItem(
        `fecha_${user.uid}`,
        this.getFechaFormateada()
      );

      // 🔥 ONBOARDING
      localStorage.setItem(
        `onboarding_${user.uid}`,
        'true'
      );

    }

    this.router.navigate(['/home']);

  }

}