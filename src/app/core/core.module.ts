import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { CoreRoutingModule } from './core-routing.module';
import { MenubarModule } from 'primeng/menubar';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { SetMainRequestDataInterceptor } from './interceptors/set-main-request-data.interceptor';
import { AddAddressComponent } from './components/add-address/add-address.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    AddAddressComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    MenubarModule,
    HttpClientModule,
    RippleModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SetMainRequestDataInterceptor, multi: true }
  ],
})
export class CoreModule { }
