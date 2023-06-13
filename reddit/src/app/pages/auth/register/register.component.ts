import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 })),
      ]),
    ])
  ]
})
export class RegisterComponent implements OnInit {
  newUserData: IRegister = {
    email: '',
    password: '',
    nickname: '',
    profilePic: '',
    savedPosts: [] = [], // oggetto post
    returnSecureToken: true
  };

  showError: boolean = false;
  textError: string = '';

  formRegister!: FormGroup;

  constructor(private authSvc:AuthService, private router: Router, private fb: FormBuilder,
    public dialogRef: MatDialogRef<RegisterComponent>){ }


  ngOnInit(): void {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      nickname: ['', Validators.required],
      returnSecureToken: true,
      profilePic: 'https://i.postimg.cc/cL1p7xL2/midjourney-bulissimo-placeholder-account-image-marshmallow-ee8b82e8-fc2d-495a-89de-40b54ab4308e.png',
      savedPosts: [],
    });
  }

  closeRef(): void {
    this.dialogRef.close();
  }

  register() {
    this.newUserData = this.formRegister.value;
    console.log(this.newUserData);
    this.authSvc.signUp(this.newUserData)
      .subscribe(res => {
        console.log(res);
        this.authSvc.localIdSubject.next(res.localId)
        /* this.router.navigate(['./auth/login']); */
        this.closeRef();
      })
      this.handleErrorMessage();

    this.newUserData.savedPosts = [];
    this.authSvc.localId$.subscribe(res => {
      this.newUserData.id = res;
      console.log(res);
      console.log(this.newUserData.id);
      this.authSvc.signUpForUserInfos(this.newUserData)
      .subscribe(res => {
        console.log("🚀 ~ file: register.component.ts:75 ~ RegisterComponent ~ register ~ res:", res)
    })
    })
    delete this.newUserData.password;

  }

  handleErrorMessage() {
    this.authSvc.error$.subscribe(error => {
      this.showError = error;
    });
    this.authSvc.errorText$.subscribe(text => {
      this.textError = text;
    })
  }
}
