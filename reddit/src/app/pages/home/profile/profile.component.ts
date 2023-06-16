import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { NewpostComponent } from './newpost/newpost.component';
import { HomeService } from '../../home.service';
import { IPost } from 'src/app/models/interfaces/i-post';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { Subscription, take } from 'rxjs';
import { Icomment } from 'src/app/models/interfaces/icomment';
import { IPostPlusComments } from 'src/app/models/interfaces/ipost-plus-comments';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../home.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  allMyPosts: IPost[] = [];

  userLogged:IRegister | null = null;

  filteredPosts: IPost[] = [];

  likedPosts: IPost[] = [];

  savedPostArray: IPost[] = [];

  isFiltered: boolean = false;
  allComments: [string, Icomment][] = [];
  //creo un array di oggetti, ogni oggetto contiene l'oggetto post + relativi commenti
  postCommentedArray: IPostPlusComments[] = [];
  postCommented!: IPostPlusComments;

  likesSubscription: Subscription | undefined;
  saveSubscription: Subscription | undefined;

  //SUBSCRIPTIONS
  private postsSubscription: Subscription | undefined;

  constructor(private homeSvc: HomeService){}

  ngOnDestroy(): void {
    if (this.postsSubscription) this.postsSubscription.unsubscribe();

  }

  ngOnInit(): void {
    this.homeSvc.findLoggedUser();
    this.homeSvc.sharedProfile.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.userLogged = user;
      }
      this.getAllPostsProfile();
      this.getAllLikedPosts();
      this.getAllSavedPosts();
    })
  }

  getAllPostsProfile(topic="trending"){
    this.postsSubscription = this.homeSvc.getAllPosts().subscribe(
      (posts) => {
        this.allMyPosts=[];
        for(let post in posts)
        {
          console.log(post);

          if (posts[post].user.uniqueId === this.userLogged!.uniqueId) {
            let obj:IPost=posts[post];
            obj.id=post;
            this.allMyPosts.push(obj);
          }

        }

        if(topic!="trending") this.allMyPosts=this.allMyPosts.filter(post=>post.postTopic==topic);

        console.log('Post recuperati', this.allMyPosts);
      },
      (error) => {
        console.log('errore nel recuperare i post', error);
      }
    );
  }

  filterTopic(topic:string){
    //nell'html passare come argomento il topic per cui si vuole filtrare
    this.filteredPosts = this.allMyPosts.filter(post => post.postTopic === topic);
    this.isFiltered = true;
    console.log("🚀 ~ file: home.component.ts:47 ~ HomeComponent ~ filterTopic ~ this.filteredPosts:", this.filteredPosts)
  }

  dontFilter(){
    this.filteredPosts = this.allMyPosts;
  }

  getAllLikedPosts(){
    this.homeSvc.getAllPosts().subscribe(
      (posts) => {
        this.likedPosts=[];
        for(let post in posts)
        {
          let obj:IPost=posts[post];
          obj.id=post;
          this.likedPosts.push(obj);
        }
        console.log('Recupero post piaciuti', this.likedPosts);
        this.likedPosts = this.likedPosts.filter(post => post.likes.hasOwnProperty(this.userLogged!.uniqueId));

      },
      (error) => {
        console.log('errore nel recuperare i post', error);
      }
    );
  }


  getAllSavedPosts(){
    this.homeSvc.getAllPosts().subscribe(
      (posts) => {
        this.savedPostArray=[];
        for(let post in posts)
        {
          let obj:IPost=posts[post];
          obj.id=post;
          this.savedPostArray.push(obj);
        }
        console.log('Recupero post salvati', this.savedPostArray);
        this.savedPostArray = this.savedPostArray.filter(post => post.saved.hasOwnProperty(this.userLogged!.uniqueId));


      },
      (error) => {
        console.log('errore nel recuperare i post', error);
      }
    );
  }

  like(post:IPost)
  {
    let user:IRegister=JSON.parse(localStorage.getItem("userInfos")!);
    if(post.likes.hasOwnProperty(user.uniqueId)) {
      delete post.likes[user.uniqueId]
      this.getAllLikedPosts();
    }
    else {
      post.likes[user.uniqueId]=user
      this.getAllLikedPosts();
    }
    this.likesSubscription = this.homeSvc.likePost(post).subscribe(res=>console.log(res));
  }

  // like = async (post: IPost) => {
  //   let user: IRegister = JSON.parse(localStorage.getItem("userInfos")!);

  //   if (post.likes.hasOwnProperty(user.uniqueId)) {
  //     delete post.likes[user.uniqueId];
  //   } else {
  //     post.likes[user.uniqueId] = user;
  //   }

  //   try {
  //     await this.getAllLikedPosts();
  //     await this.homeSvc.likePost(post).toPromise();
  //     console.log('Post liked successfully.');
  //   } catch (error) {
  //     console.log('Error liking post:', error);
  //   }
  // };

  saved(post:IPost)
  {
    let user:IRegister=JSON.parse(localStorage.getItem("userInfos")!);
    if(post.saved.hasOwnProperty(user.uniqueId)){
      delete post.saved[user.uniqueId]
      this.getAllSavedPosts();
    }
    else {
      post.saved[user.uniqueId]=user
      this.getAllSavedPosts();
    }
    this.saveSubscription = this.homeSvc.savePost(post).subscribe(res=>console.log(res));
  }

  // saved = async (post: IPost) => {
  //   let user: IRegister = JSON.parse(localStorage.getItem("userInfos")!);

  //   if (post.saved.hasOwnProperty(user.uniqueId)) {
  //     delete post.saved[user.uniqueId];
  //   } else {
  //     post.saved[user.uniqueId] = user;
  //   }

  //   try {
  //     await this.homeSvc.savePost(post).toPromise();
  //     await this.getAllSavedPosts();
  //     console.log('Post saved successfully.');
  //   } catch (error) {
  //     console.log('Error saving post:', error);
  //   }
  // };
}
