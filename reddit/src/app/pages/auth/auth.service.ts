import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, tap } from 'rxjs';
import { IAccData } from 'src/app/models/interfaces/i-acc-data';
import { ILogin } from 'src/app/models/interfaces/i-login';
import { IRefreshUser } from 'src/app/models/interfaces/i-refresh-user';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper=new JwtHelperService();

  private authSubject=new BehaviorSubject<null | IAccData>(null);
  user$ = this.authSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map(dato => Boolean(dato)));

  constructor(private http:HttpClient)
  {
    this.restoreUser();
  }

  signUp(user:IRegister)
  {
    return this.http.post(environment.regUrl, user);
  }

  signIn(user:ILogin)
  {
    return this.http.post<IAccData>(environment.logUrl, user).pipe(tap(data=>{
      this.authSubject.next(data);
      localStorage.setItem("user", JSON.stringify(data));

      const expDate = this.jwtHelper.getTokenExpirationDate(data.idToken) as Date;
    }));
  }

  restoreUser()
  {
    const userJson = localStorage.getItem('user');
    if(!userJson) return;

    const user: IAccData = JSON.parse(userJson);
    if(this.jwtHelper.isTokenExpired(user.idToken)) return;

    this.authSubject.next(user);
    console.log('sei loggato');
  }

  logout()
  {
    localStorage.removeItem('user');
    this.authSubject.next(null);
  }

  tokenAutoRefresh()
  {
    const headers = new HttpHeaders({'content-Type': 'application/x-www-form-urlencoded'});
    const options = { headers: headers };

    const user: IAccData = JSON.parse(localStorage.getItem('user')!);
    const expDate = this.jwtHelper.getTokenExpirationDate(user.idToken) as Date;
    const timeLeft=expDate.getTime()-new Date().getTime();
    setTimeout(()=>{
      this.http.post<IRefreshUser>(environment.refreshUrl, 'grant_type=refresh_token&refresh_token='+user.refreshToken, options)
      .subscribe(data=>{
        console.log(data);
        user.idToken=data.id_token;
        localStorage.setItem("user", JSON.stringify(user));
        this.authSubject.next(user);
      });
    }, 1000);
  }
}
