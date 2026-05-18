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
  deleteUser
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

  // 🔥 CERRAR SESIÓN
  async cerrarSesion() {

    const alertBox = await this.alertCtrl.create({

      header: 'Cerrar sesión',

      message:
        '¿Seguro que deseas salir de tu cuenta?',

      buttons: [

        {
          text: 'Cancelar',
          role: 'cancel'
        },

        {
          text: 'Salir',

          handler: async () => {

            await signOut(getAuth());

            // 🔥 NO BORRAR DATOS USUARIO
            localStorage.removeItem(
              'activeTab'
            );

            this.router.navigate(['/cuenta']);

          }
        }

      ]
    });

    await alertBox.present();

  }

  // 🔥 ELIMINAR CUENTA
  async eliminarCuenta() {

    const alertBox = await this.alertCtrl.create({

      header: 'Eliminar cuenta',

      message:
        'Esta acción eliminará tu cuenta permanentemente. ¿Deseas continuar?',

      buttons: [

        {
          text: 'Cancelar',
          role: 'cancel'
        },

        {
          text: 'Eliminar',
          role: 'destructive',

          handler: async () => {

            try {

              const user =
                getAuth().currentUser;

              if (!user) {

                this.router.navigate(['/cuenta']);

                return;

              }

              // 🔥 ELIMINAR FIREBASE
              await deleteUser(user);

              // 🔥 AQUÍ SÍ BORRAR TODO
              localStorage.clear();

              // 🔥 VOLVER AUTH
              this.router.navigate(['/cuenta']);

            } catch (error: any) {

              console.log(error);

              if (
                error.code ===
                'auth/requires-recent-login'
              ) {

                window.alert(
                  'Por seguridad, vuelve a iniciar sesión antes de eliminar tu cuenta.'
                );

                this.router.navigate(['/cuenta']);

              } else {

                window.alert(
                  'No se pudo eliminar la cuenta.'
                );

              }

            }

          }

        }

      ]

    });

    await alertBox.present();

  }

}