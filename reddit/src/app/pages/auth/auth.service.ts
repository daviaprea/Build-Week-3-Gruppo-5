import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';
import { IAccData } from 'src/app/models/interfaces/i-acc-data';
import { ILogin } from 'src/app/models/interfaces/i-login';
import { IRefreshUser } from 'src/app/models/interfaces/i-refresh-user';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { IregDataRes } from 'src/app/models/interfaces/ireg-data-res';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper=new JwtHelperService();

  private authSubject=new BehaviorSubject<null | IAccData>(null);
  user$ = this.authSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map(dato => Boolean(dato)));

  isRegistered:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  newUser$ = this.isRegistered.asObservable();

  localIdSubject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  localId$ = this.localIdSubject.asObservable();

  private errorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public error$ = this.errorSubject.asObservable();
  private errorTextSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public errorText$ = this.errorTextSubject.asObservable();


  constructor(private http:HttpClient)
  {
    this.restoreUser();
  }

  signUp(user:IRegister)
  {
    /* return this.http.post(environment.usersUrl, user) */
    return this.http.post<IregDataRes>(environment.regUrl, user)
    .pipe(
      catchError(error => {
        console.log("🚀 ~ file: auth.service.ts:46 ~ AuthService ~ error:", error)
        const errorText = this.errors(error);
        this.errorSubject.next(true);
        this.errorTextSubject.next(errorText);
        return throwError(error);
      })
    )
  }

  signUpForUserInfos(user:IRegister){
    return this.http.post(environment.usersUrl, user)
  }

  signIn(user:ILogin)
  {
    return this.http.post<IAccData>(environment.logUrl, user).pipe(tap(data=>{
      console.log("Sono nel tap del signIn: "+data)
      this.authSubject.next(data);
      localStorage.setItem("user", JSON.stringify(data));

      const expDate = this.jwtHelper.getTokenExpirationDate(data.idToken) as Date;
    }))
    .pipe(catchError(error => {
      const errorText = this.errors(error);
      this.errorSubject.next(true);
      this.errorTextSubject.next(errorText);
      return throwError(error);
    }))
  }

  signInForUserInfos(data:IAccData){
    return this.http.get<IRegister[]>(environment.usersUrl).pipe(
      tap(users => {
        const arrayUsers = [];
        /* const arrayUsers = Array.from(users); */
        for(let user in users){
          const singleObj:IRegister = users[user]
          singleObj.uniqueId = user;
          console.log(singleObj);
          console.log(user);
          if(singleObj.id){
            arrayUsers.push(singleObj);
          }
        }
        console.log("tutti gli utenti", arrayUsers)
        const singleUser = arrayUsers.filter(user => user.email === data.email);
        localStorage.setItem('userInfos', JSON.stringify(singleUser[0]))
        console.log(singleUser[0]);
      })
    )
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
    localStorage.removeItem('userInfos');
    this.authSubject.next(null);
  }

  tokenAutoRefresh()
  {
    const headers = new HttpHeaders({'content-Type': 'application/x-www-form-urlencoded'});
    const options = { headers: headers };

    const user: IAccData = JSON.parse(localStorage.getItem('user')!);
    const expDate = this.jwtHelper.getTokenExpirationDate(user.idToken) as Date;
    const timeLeft=expDate.getTime()-new Date().getTime();
    console.log("🚀 ~ file: auth.service.ts:89 ~ AuthService ~ timeLeft:", timeLeft)

    setTimeout(()=>{
      this.http.post<IRefreshUser>(environment.refreshUrl, 'grant_type=refresh_token&refresh_token='+user.refreshToken, options)
      .subscribe(data=>{
        console.log(data);
        user.idToken=data.id_token;
        localStorage.setItem("user", JSON.stringify(user));
        this.authSubject.next(user);
        this.tokenAutoRefresh();
      });
    }, timeLeft);
  }

  editUser(user:Partial<IRegister>){
    return this.http.put(environment.editUser + user.uniqueId + '.json', user);
  }

  errors(err: any) {
    switch (err.error.error.message) {
        case "MISSING_PASSWORD":
            return 'Password is required'
            break;
        case "EMAIL_EXISTS":
            return 'Email already exists'
            break;
        case 'INVALID_EMAIL':
            return 'Email format is invalid'
            break;
        case "MISSING_EMAIL":
          return 'Email is required'
          break;
        case 'EMAIL_NOT_FOUND':
            return 'Cannot find user'
            break;
        case 'INVALID_PASSWORD':
            return 'Incorrect password or email'
            break;
            default:
        return 'Errore'
            break;
    }
  }
}
