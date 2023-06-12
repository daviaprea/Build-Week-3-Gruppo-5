import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { AuthService } from '../auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

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
    returnSecureToken: true
  };

  showError: boolean = false;
  textError: string = '';

  formRegister!: FormGroup;

  constructor(private authSvc:AuthService, private router: Router, private fb: FormBuilder){ }


  ngOnInit(): void {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      nickname: ['', Validators.required],
      returnSecureToken: true
    });
  }

  register() {
    this.newUserData = this.formRegister.value;
    console.log(this.newUserData);
    this.authSvc.signUp(this.newUserData)
      .subscribe(res => {
        console.log(res);
        /* this.router.navigate(['./auth/login']); */
      })
    /* this.handleErrorMessage(); */
  }

  /* handleErrorMessage() {
    this.AuthService.error$.subscribe(error => {
      this.showError = error;
    });
    this.AuthService.errorText$.subscribe(text => {
      this.textError = text;
    })
  } */
}
