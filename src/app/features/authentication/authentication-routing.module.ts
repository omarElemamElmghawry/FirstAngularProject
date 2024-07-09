import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AddAddressComponent } from '../../core/components/add-address/add-address.component';
import { HomeComponent } from 'src/app/core/components/home/home.component';
import { IsUserGuard } from 'src/app/core/guards/is-user.guard';

const routes: Routes = [
  { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'add-contact-address', component: AddAddressComponent, canActivate: [IsUserGuard] },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }