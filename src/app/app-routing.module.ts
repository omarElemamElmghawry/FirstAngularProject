import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "core", 
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule),
  },
  {
    path: "authentication",
    loadChildren: () => import('./features/authentication/authentication.module').then(m=>m.AuthenticationModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
