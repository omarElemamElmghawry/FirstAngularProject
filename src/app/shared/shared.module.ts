import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsComponent } from './components/google-maps/google-maps.component';
import { NotFoundComponent } from './components/not-found/not-found.component';



@NgModule({
  declarations: [
    GoogleMapsComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule
  ],
  exports: [
    GoogleMapsComponent,
    NotFoundComponent
  ]
})
export class SharedModule { }
