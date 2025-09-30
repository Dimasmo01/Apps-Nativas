import { Component } from '@angular/core';
import { IonContent, IonCard, IonCardContent, IonButton  } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonContent, IonCard, IonCardContent, IonButton],
})
export class Tab1Page {
  
  aerolinea = 'Aerolíneas ReTime';
  codigodevuelo = 'AR2360';
  status= 'Embarcando'; 
  codigoorigen = 'MIA';
  etiquetaorigen = 'Desde';
  programado = '09:00';
  estimado  = '09:40';
 }