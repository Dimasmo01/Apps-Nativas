import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  IonContent, IonInput, IonButton, IonText
} from '@ionic/angular/standalone';
import { VuelosService, Vuelo } from '../services/vuelos.service';

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonContent,
    IonInput,
    IonButton,
    IonText
  ],
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss']
})
export class Tab1Page {
  codigo = '';
  vuelo?: Vuelo;
  error?: string;

  constructor(private vuelosService: VuelosService) {}

  buscar() {
    this.error = undefined;
    this.vuelo = undefined;

    const cod = this.codigo.trim().toUpperCase();
    if (!cod) { //no tiene texto
      this.error = 'Ingrese un número de vuelo';
      return;
    }

    this.vuelosService.getPorCodigo(cod).subscribe({ //llamo al back
      next: (data) => this.vuelo = data,   //exito: seteo el mensaje 
      error: (err) => {  //error seteo mensaje
        if (err?.status === 404) this.error = 'Vuelo no encontrado';
        else {
          this.error = 'Error del servidor. Revisá el backend.';
          console.error('Detalle:', err);
        }
      }
    });
  }
}
