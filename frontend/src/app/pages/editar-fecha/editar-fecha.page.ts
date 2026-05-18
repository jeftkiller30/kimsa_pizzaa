import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';

import { getAuth } from 'firebase/auth';

import {
  chevronBackOutline,
  chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-editar-fecha',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './editar-fecha.page.html',
  styleUrls: ['./editar-fecha.page.scss']
})
export class EditarFechaPage {

  fecha: Date | null = null;

  mostrarCalendario = false;
  mostrarSelectorAnio = false;

  hoy = new Date();

  mesActual = this.hoy.getMonth();
  anioActual = this.hoy.getFullYear();

  diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private router: Router) {

    addIcons({
      chevronBackOutline,
      chevronForwardOutline
    });

    const user = getAuth().currentUser;

    // 🔥 LEER FECHA POR UID
    if (user) {

      const fechaGuardada =
        localStorage.getItem(
          `fecha_${user.uid}`
        );

      if (fechaGuardada) {

        this.fecha =
          this.convertirTextoADate(
            fechaGuardada
          );

        if (this.fecha) {

          this.mesActual =
            this.fecha.getMonth();

          this.anioActual =
            this.fecha.getFullYear();

        }

      }

    }

  }

  convertirTextoADate(
    valor: string
  ): Date | null {

    if (!valor) return null;

    if (valor.includes('/')) {

      const partes = valor.split('/');

      if (partes.length !== 3)
        return null;

      const dia = Number(partes[0]);

      const mes =
        Number(partes[1]) - 1;

      const anio =
        Number(partes[2]);

      if (
        isNaN(dia) ||
        isNaN(mes) ||
        isNaN(anio)
      ) return null;

      return new Date(
        anio,
        mes,
        dia
      );

    }

    if (valor.includes('-')) {

      const partes = valor.split('-');

      if (partes.length !== 3)
        return null;

      const anio =
        Number(partes[0]);

      const mes =
        Number(partes[1]) - 1;

      const dia =
        Number(partes[2]);

      if (
        isNaN(dia) ||
        isNaN(mes) ||
        isNaN(anio)
      ) return null;

      return new Date(
        anio,
        mes,
        dia
      );

    }

    return null;

  }

  get anios(): number[] {

    const anios = [];

    for (
      let a = 1920;
      a <= this.hoy.getFullYear();
      a++
    ) {

      anios.push(a);

    }

    return anios.reverse();

  }

  get esMayorDeEdad(): boolean {

    if (!this.fecha) return true;

    const hoy = new Date();

    let edad =
      hoy.getFullYear() -
      this.fecha.getFullYear();

    const mes =
      hoy.getMonth() -
      this.fecha.getMonth();

    if (
      mes < 0 ||
      (
        mes === 0 &&
        hoy.getDate() <
        this.fecha.getDate()
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

    if (!this.fecha)
      return 'Selecciona una fecha';

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

    const dias:
      (Date | null)[] = [];

    const primero =
      new Date(
        this.anioActual,
        this.mesActual,
        1
      );

    const ultimo =
      new Date(
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

    if (!this.fecha)
      return 'dd/mm/aaaa';

    const d =
      this.fecha
        .getDate()
        .toString()
        .padStart(2, '0');

    const m =
      (
        this.fecha.getMonth() + 1
      )
        .toString()
        .padStart(2, '0');

    const a =
      this.fecha.getFullYear();

    return `${d}/${m}/${a}`;

  }

  guardar() {

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

    }

    this.router.navigate([
      '/mi-perfil'
    ]);

  }

  goBack() {

    this.router.navigate([
      '/mi-perfil'
    ]);

  }

}