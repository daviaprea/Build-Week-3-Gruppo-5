import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { MypostsComponent } from './myposts/myposts.component';
import { NewpostComponent } from './newpost/newpost.component';
import { SavedpostComponent } from './savedpost/savedpost.component';
import { EditpostComponent } from './myposts/editpost/editpost.component';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProfileboxComponent } from './profilebox/profilebox.component';


@NgModule({
  declarations: [
    ProfileComponent,
    MypostsComponent,
    NewpostComponent,
    SavedpostComponent,
    EditpostComponent,
    ProfileboxComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatRippleModule,
  ]
})
export class ProfileModule { }
