import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient){}

  signUp(user:IRegister)
  {
    return this.http.post(environment.regUrl, user);
  }
}
