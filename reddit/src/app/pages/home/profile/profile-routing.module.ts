import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { NewpostComponent } from './newpost/newpost.component';

const routes: Routes = [
  {
    path: '', component: ProfileComponent
  },
  {
    path: 'create', component: NewpostComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
