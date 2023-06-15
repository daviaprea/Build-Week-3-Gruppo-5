import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { ILogin } from 'src/app/models/interfaces/i-login';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';
import { HomeService } from '../../home.service';
import { Subscription } from 'rxjs';

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
export class LoginComponent implements OnInit, OnDestroy{
  //SUBSCRIPTIONS
  private signIn: Subscription | undefined;
  private userInfos: Subscription | undefined;
  private error: Subscription | undefined;
  private errorText: Subscription | undefined;

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
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginComponent>,
    private homeSvc: HomeService
    ){ }
  ngOnDestroy(): void {
    if(this.signIn) this.signIn.unsubscribe();
    if(this.userInfos) this.userInfos.unsubscribe();
    if(this.error) this.error.unsubscribe();
    if(this.errorText) this.errorText.unsubscribe();
  }


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
    this.signIn=this.authSvc.signIn(this.newUserData)
      .subscribe(res => {
        console.log("Sono il subscribe del signIn"+res);
        this.userInfos=this.authSvc.signInForUserInfos(res).subscribe(res => {
          console.log('dentro il subscribe', res);
          this.homeSvc.findLoggedUser();
          this.router.navigate(['profile']);
        })
        this.authSvc.tokenAutoRefresh();
        this.closeRef();
      })
      this.handleErrorMessage();
      /* window.location.reload(); */
    /* this.homeSvc.findLoggedUser(); */
  }

  redirect(){
    this.authSvc.isRegistered.next(false);
    const dialogRef = this.dialog.open(RegisterComponent, {});
    /* this.closeRef(); */
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
