import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ILogin } from 'src/app/models/interfaces/i-login';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent implements OnInit{
  newUserData: ILogin = {
    email: '',
    password: '',
    returnSecureToken: true
  };

  showError: boolean = false;
  textError: string = '';

  /* hide = true; */

  formRegister!: FormGroup;

  constructor(
    private authSvc:AuthService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>
    ){ }


  ngOnInit(): void {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      returnSecureToken: true
    });
  }

  closeRef(): void {
    this.dialogRef.close();
  }

  login(){
    this.newUserData = this.formRegister.value;
    console.log(this.newUserData);
    this.authSvc.signIn(this.newUserData)
      .subscribe(res => {
        console.log(res);
        this.authSvc.tokenAutoRefresh();
        this.closeRef();
        /* this.router.navigate(['./auth/login']); */
      })
    this.handleErrorMessage();
  }

  redirect(){
    this.authSvc.isRegistered.next(false);
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
