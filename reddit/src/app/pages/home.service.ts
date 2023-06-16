import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { IPost } from '../models/interfaces/i-post';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/interfaces/i-user';
import { IRegister } from '../models/interfaces/i-register';
import { Icomment } from '../models/interfaces/icomment';

@Injectable({
  providedIn: 'root'
})


export class HomeService {

  public sharedProfile = new BehaviorSubject<null | IRegister>(null);

  constructor(private http:HttpClient) {}

  getAllPosts(){
    return this.http.get<IPost[]>(environment.postsUrl);
  }

  getSinglePost(id:number){
    return this.http.get<IPost>(environment.postsUrl + '/' + id);
  }

  newComment(post:IPost)
  {
    return this.http.put(environment.editPost+post.id+".json", post);
  }

  getAllComment(){
    return this.http.get<Icomment[]>(environment.commentsUrl);
  }

  addPost(post:IPost){
    return this.http.post<IPost>(environment.postsUrl, post);
  }

  editPost(post:Partial<IPost>){
    return this.http.put(environment.postsUrl + '/' + post.id, post);
  }

  deletePost(id:number){
    return this.http.delete(environment.postsUrl + '/' + id);
  }

  likePost(post:IPost)
  {
    return this.http.put(environment.editPost+post.id+".json", post);
  }

  savePost(post:IPost)
  {
    return this.http.put(environment.editPost+post.id+".json", post);
  }

  findLoggedUser(){
    const user = <string>localStorage.getItem('userInfos')
    const userObj = JSON.parse(user);
    this.sharedProfile.next(userObj)
  }
}
