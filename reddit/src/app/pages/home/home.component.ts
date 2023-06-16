import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HomeService } from '../home.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { IPost } from 'src/app/models/interfaces/i-post';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { Icomment } from 'src/app/models/interfaces/icomment';
import { IPostPlusComments } from 'src/app/models/interfaces/ipost-plus-comments';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  //conterrà l'utente loggato
  userLogged: IRegister | null = null;
  //array con tutti i post
  allDisplayablePosts: IPost[] = [];
  //array che si aggiorna a seconda del filtro
  filteredPosts: IPost[] = [];
  //recupero tutti i commenti per i post visualizzati
  allComments: [string, Icomment][] = [];
  //creo un array di oggetti, ogni oggetto contiene l'oggetto post + relativi commenti
  postCommentedArray: IPostPlusComments[] = [];
  postCommented!: IPostPlusComments;

  topic="TRENDING";

  isCollapsed: boolean = false;
  formRegister!: FormGroup;

  //SUBSCRIPTIONS
  private postsSubscription: Subscription | undefined;
  private commentsSubscription: Subscription | undefined;
  private likesSubscription: Subscription | undefined;

  likes: number = 0;


  constructor(private homeSvc: HomeService, private authSvc: AuthService, private router: Router, private fb: FormBuilder) { }
  ngOnDestroy() {
    if (this.postsSubscription) this.postsSubscription.unsubscribe();
    if (this.commentsSubscription) this.commentsSubscription.unsubscribe();
    if (this.likesSubscription) this.likesSubscription.unsubscribe();
  }


  ngOnInit(): void {
    this.getAllPostsHome();
    //recupero info dell'utente loggato
    this.homeSvc.findLoggedUser();
    this.homeSvc.sharedProfile.subscribe((user) => {
      if (user) this.userLogged = user;
      console.log(this.userLogged);
    })

    this.formRegister = this.fb.group({ comment: ["", [Validators.required, Validators.maxLength(200)]] });
  }

  getAllPostsHome(topic = "trending") {
    this.postsSubscription = this.homeSvc.getAllPosts().subscribe(
      (posts) => {
        this.allDisplayablePosts = [];
        for (let post in posts) {
          let obj: IPost = posts[post];
          obj.id = post;
          this.allDisplayablePosts.push(obj);
        }
        this.topic=topic.toUpperCase();

        if (topic != "trending") this.allDisplayablePosts = this.allDisplayablePosts.filter(post => post.postTopic == topic);

        console.log('Post recuperati', this.allDisplayablePosts);
      },
      (error) => {
        console.log('errore nel recuperare i post', error);
      }
    );
  }

  /* addComment(post:IPost) {
    let newComment: Icomment = {
      createdBy: this.userLogged!,
      body: this.formRegister.value.comment,
      post_id: post.id
    }
    console.log(newComment);
    this.homeSvc.newComment(newComment).subscribe(res => {
      this.formRegister.reset();
      console.log(res);
      this.homeSvc.getAllComment().subscribe(data=>{
        this.allComments=[];
        let arr=Object.entries(data);
        this.allComments = arr.filter(comment => post.id==comment[1].post_id);
        for(let comment in data) if(comment.post_id == post.id) this.allComments.push(comment);
        console.log(this.allComments);
      });
    });
  } */

  addComment(post:IPost) {
    let newComment: Icomment = {
      createdBy: this.userLogged!,
      body: this.formRegister.value.comment,
      post_id: post.id,
      commentDate: new Date().toLocaleString()
    }

    post.comments[String(new Date().getTime())+newComment.createdBy.uniqueId]=newComment;
    console.log(post);
    console.log(newComment);
    this.homeSvc.newComment(post).subscribe(res => {
      this.formRegister.reset();
      console.log(res);
      /* this.homeSvc.getAllComment().subscribe(data=>{
        this.allComments=[];
        let arr=Object.entries(data);
        this.allComments = arr.filter(comment => post.id==comment[1].post_id);
        for(let comment in data) if(comment.post_id == post.id) this.allComments.push(comment);
        console.log(this.allComments);
      }); */
    });
  }

  like(post: IPost){
    let user: IRegister = JSON.parse(localStorage.getItem("userInfos")!);
    if (post.likes.hasOwnProperty(user.uniqueId)) delete post.likes[user.uniqueId];
    else post.likes[user.uniqueId] = user;
    this.likesSubscription = this.homeSvc.likePost(post).subscribe(res => console.log(res));
  }

  saved(post: IPost){
    let user: IRegister = JSON.parse(localStorage.getItem("userInfos")!);
    if (post.saved.hasOwnProperty(user.uniqueId)) delete post.saved[user.uniqueId];
    else post.saved[user.uniqueId] = user;
    this.likesSubscription = this.homeSvc.likePost(post).subscribe(res => console.log(res));
  }

  getLikesCount(post: any): number
  {
    return Object.keys(post.likes).length-1;
  }


}
