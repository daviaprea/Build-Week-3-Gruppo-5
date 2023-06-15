import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

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
export class RegisterComponent implements OnInit, OnDestroy {

  //SUBSCRIPTIONS
  private signUp: Subscription | undefined;
  private localId: Subscription | undefined;
  private userInfos: Subscription | undefined;
  private error: Subscription | undefined;
  private errorText: Subscription | undefined;

  newUserData: IRegister = {
    email: '',
    password: '',
    nickname: '',
    profilePic: '',
    savedPosts: [] = [],
    returnSecureToken: true,
    uniqueId: ''
  };

  showError: boolean = false;
  textError: string = '';

  formRegister!: FormGroup;

  constructor(private authSvc: AuthService, private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<RegisterComponent>) { }

  ngOnDestroy(): void {
    if (this.signUp) this.signUp.unsubscribe;
    if (this.localId) this.localId.unsubscribe;
    if (this.userInfos) this.userInfos.unsubscribe;
    if (this.error) this.error.unsubscribe;
    if (this.errorText) this.errorText.unsubscribe;
  }


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
    this.signUp = this.authSvc.signUp(this.newUserData)
      .subscribe(res => {
        console.log(res);
        this.authSvc.localIdSubject.next(res.localId)
        /* this.router.navigate(['./auth/login']); */
        this.closeRef();
      })
    this.handleErrorMessage();

    this.newUserData.savedPosts = [];
    this.localId = this.authSvc.localId$.subscribe(res => {
      this.newUserData.id = res;
      console.log(res);
      console.log(this.newUserData.id);
      this.userInfos=this.authSvc.signUpForUserInfos(this.newUserData)
        .subscribe(res => {
          console.log("🚀 ~ file: register.component.ts:75 ~ RegisterComponent ~ register ~ res:", res)
        })
    })
    delete this.newUserData.password;

  }

  handleErrorMessage() {
    this.error=this.authSvc.error$.subscribe(error => {
      this.showError = error;
    });
    this.errorText=this.authSvc.errorText$.subscribe(text => {
      this.textError = text;
    })
  }
}
