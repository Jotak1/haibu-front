import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: ':id', component: DetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
