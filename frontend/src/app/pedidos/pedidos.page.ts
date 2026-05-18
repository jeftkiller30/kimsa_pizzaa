import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage {

  isLoggedIn = false;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }

  goLogin() {
    this.router.navigate(['/cuenta']);
  }

}