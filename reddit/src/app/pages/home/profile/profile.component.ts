import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { NewpostComponent } from './newpost/newpost.component';
import { HomeService } from '../../home.service';
import { IPost } from 'src/app/models/interfaces/i-post';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { take } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../home.component.scss']
})
export class ProfileComponent implements OnInit {

  allMyPosts: IPost[] = [];

  userLogged:IRegister | null = null;

  filteredPosts: IPost[] = [];

  isFiltered: boolean = false;

  constructor(private homeSvc: HomeService){

  }

  ngOnInit(): void {
    this.homeSvc.findLoggedUser();
    this.homeSvc.sharedProfile.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.userLogged = user;
      }
      this.getAllPostsProfile();
    })
  }

  getAllPostsProfile(){
    this.homeSvc.getAllPosts().subscribe(
      (posts) => {
        console.log("LOG DELLA RES", posts)

        for(let post in posts){
          const myPost:IPost = posts[post]
          if(myPost.user.id === this.userLogged?.id){
            this.allMyPosts.push(myPost)
          }
        }
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
}
