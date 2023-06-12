import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { MypostsComponent } from './myposts/myposts.component';
import { NewpostComponent } from './newpost/newpost.component';
import { SavedpostComponent } from './savedpost/savedpost.component';
import { EditpostComponent } from './myposts/editpost/editpost.component';


@NgModule({
  declarations: [
    ProfileComponent,
    MypostsComponent,
    NewpostComponent,
    SavedpostComponent,
    EditpostComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
