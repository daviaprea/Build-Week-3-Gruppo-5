import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPost } from 'src/app/models/interfaces/i-post';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  api = environment.postsUrl

  constructor(
    private http: HttpClient,

  ) { }

  create(newPost:IPost){
    return this.http.post(this.api, newPost)
  }
}
