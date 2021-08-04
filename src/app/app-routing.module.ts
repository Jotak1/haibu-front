import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'users', loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule) },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
