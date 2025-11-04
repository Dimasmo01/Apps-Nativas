import { Routes } from '@angular/router';
import { Tab1Page } from './tab1/tab1.page';

export const routes: Routes = [
  { path: '', component: Tab1Page },       // ruta raíz
  { path: '**', redirectTo: '' }
];