import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';

import {
  chevronBackOutline,
  chevronForwardOutline,
  mailOutline,
  logOutOutline,
  trashOutline
} from 'ionicons/icons';

import {
  getAuth,
  signOut,
  deleteUser,
  reauthenticateWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  User
} from 'firebase/auth';

@Component({
  selector: 'app-seguridad',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './seguridad.page.html',
  styleUrls: ['./seguridad.page.scss']
})
export class SeguridadPage {

  email: string = 'No disponible';

  constructor(
    private router: Router,
    private alertCtrl: AlertController
  ) {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      mailOutline,
      logOutOutline,
      trashOutline
    });

    const user = getAuth().currentUser;

    if (user?.email) {
      this.email = user.email;
    }
  }

  goBack() {
    this.router.navigate(['/mi-cuenta']);
  }

  async cerrarSesion() {
    const alertBox = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Seguro que deseas salir de tu cuenta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          handler: async () => {
            await signOut(getAuth());

            localStorage.removeItem('activeTab');

            this.router.navigate(['/cuenta']);
          }
        }
      ]
    });

    await alertBox.present();
  }

  async eliminarCuenta() {
    const alertBox = await this.alertCtrl.create({
      header: 'Eliminar cuenta',
      message: 'Esta acción eliminará tu cuenta permanentemente. ¿Deseas continuar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.eliminarCuentaDirecto();
          }
        }
      ]
    });

    await alertBox.present();
  }

  private async eliminarCuentaDirecto() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        this.router.navigate(['/cuenta']);
        return;
      }

      const uid = user.uid;

      try {
        await deleteUser(user);
      } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
          await this.reautenticarUsuario(user);
          await deleteUser(user);
        } else {
          throw error;
        }
      }

      localStorage.removeItem(`nombre_${uid}`);
      localStorage.removeItem(`fecha_${uid}`);
      localStorage.removeItem(`telefono_${uid}`);
      localStorage.removeItem(`onboarding_${uid}`);
      localStorage.removeItem('emailUsuario');
      localStorage.removeItem('activeTab');

      this.router.navigate(['/cuenta']);

    } catch (error: any) {
      console.log(error);

      if (error.code === 'auth/popup-closed-by-user') {
        alert('Debes completar la verificación para eliminar la cuenta.');
        return;
      }

      alert('No se pudo eliminar la cuenta.');
    }
  }

  private async reautenticarUsuario(user: User) {
    const providerId =
      user.providerData[0]?.providerId;

    if (providerId === 'google.com') {
      const provider = new GoogleAuthProvider();

      await reauthenticateWithPopup(
        user,
        provider
      );

      return;
    }

    if (providerId === 'facebook.com') {
      const provider = new FacebookAuthProvider();

      await reauthenticateWithPopup(
        user,
        provider
      );

      return;
    }
  }

}