import { HomeService } from 'src/app/pages/home.service';
import { AuthService } from './../../../auth/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-profilebox',
  templateUrl: './profilebox.component.html',
  styleUrls: ['./profilebox.component.scss']
})
export class ProfileboxComponent implements OnInit{
  //utente loggato
  loggedUser: Partial<IRegister> = {
    id: '',
    email: '',
    nickname: '',
    profilePic: '',
    savedPosts: [], // oggetto post
    uniqueId: ''
  }

  panelOpenState = false;

  constructor(private homeSvc: HomeService, private authSvc: AuthService){

  }
  ngOnInit(): void {
    this.homeSvc.findLoggedUser();
    this.homeSvc.sharedProfile.subscribe((user) => {
      if(user){
        this.loggedUser = user;
      }
    })
  }

  editMyPost(){
    this.authSvc.editUser(this.loggedUser).subscribe((data) => {
      console.log(this.loggedUser);
      localStorage.setItem('userInfos', JSON.stringify(this.loggedUser));
      }
    )
  }


}
