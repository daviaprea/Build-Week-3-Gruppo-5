import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HomeService } from '../home.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { IPost } from 'src/app/models/interfaces/i-post';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { Icomment } from 'src/app/models/interfaces/icomment';
import { IPostPlusComments } from 'src/app/models/interfaces/ipost-plus-comments';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  //array con tutti i post
  allDisplayablePosts: IPost[] = [];
  //array che si aggiorna a seconda del filtro
  filteredPosts: IPost[] = [];
  //recupero tutti i commenti per i post visualizzati
  allComments: Icomment[] = [];
  //creo un array di oggetti, ogni oggetto contiene l'oggetto post + relativi commenti
  postCommentedArray:IPostPlusComments[] = [];
  postCommented!: IPostPlusComments;



  //conterrà l'utente loggato
  userLogged: IRegister | null = null;

  constructor(private homeSvc: HomeService, private authSvc: AuthService, private router: Router){}

  ngOnInit(): void {
    this.getAllPostsHome();
    //recupero info dell'utente loggato
    this.homeSvc.findLoggedUser();
    this.homeSvc.sharedProfile.subscribe((user) => {
      if(user){
        this.userLogged = user;
      }
    })
  }

  getAllPostsHome(){
    this.homeSvc.getAllPosts().subscribe(
      (posts) => {
        this.allDisplayablePosts = posts;
        console.log('Post recuperati', posts);
        /* this.getAllComments(); */
      },
      (error) => {
        console.log('errore nel recuperare i post', error);
      }
    );
  }

  getAllComments(){//poi la richiamo dentro getAllPostsHome
    //array con tutti gli id dei post
    const allPostId: string[] = this.allDisplayablePosts.map(post => post.id);
    //prendo tutti i commenti (dopo la risposta della chiamata)
    this.homeSvc.getAllComment().subscribe(
      (comments) => {
        //filtro i commenti che corrispondono agli id dei post
        this.allComments = comments.filter(comment => allPostId.includes(comment.createdBy_id));
        //itero sui post e sui commenti per creare un oggetto unione dei due
        for (const post of this.allDisplayablePosts) {
          for (const comment of this.allComments) {
            if (comment.createdBy_id === post.id) {
              //compilo l'oggetto combinato
              this.postCommented = {
                post: post,
                comments: [comment]
              }
              this.postCommentedArray.push(this.postCommented);
            }
          }
        }
      },
      (error) => {
        console.log('errore nel recuperare i commenti', error);
      }
      )
  }

  filterTopic(topic:string){
    //nell'html passare come argomento il topic per cui si vuole filtrare
    this.filteredPosts = this.allDisplayablePosts.filter(post => post.postTopic === topic);
    console.log("🚀 ~ file: home.component.ts:47 ~ HomeComponent ~ filterTopic ~ this.filteredPosts:", this.filteredPosts)
  }

  saved: boolean = false;
  savePost():void{
    if (!this.saved) {
      this.saved = true;
    } else {
      this.saved = false;
    }
  }
}

/*
getAllComments(){//poi la richiamo dentro getAllPostsHome
  const allPostId: string[] = [];
  this.allDisplayablePosts.forEach((post) => {
    allPostId.push(post.id)
  })
  const allPostId: string[] = this.allDisplayablePosts.map(post => post.id);
  this.homeSvc.getAllComment().subscribe(
    (comments) => {
      comments.forEach((comment) => {
        let commentFound = <Icomment>comments.find((comment) => {
          return allPostId.includes(comment.createdBy_id);
        });
        this.allComments.push(commentFound)
      })
      this.allComments = comments.filter(comment => allPostId.includes(comment.createdBy_id));
    })

  allPostId.forEach((idPost) => {
    this.homeSvc.getAllComment().subscribe(
      (comments) => {
        this.allComments = comments;
        console.log("getAllComment", comments)
      },
      (error) => {
        console.log('errore nel recuperare i commenti', error);
      }
    )
  })
  for (const post of this.allDisplayablePosts) {
    for (const comment of this.allComments) {
      if (comment.createdBy_id === post.id) {
        this.postCommented = {
          post: post,
          comments: [comment]
        }
        this.postCommentedArray.push(this.postCommented);
      }
    }
  }
} */
