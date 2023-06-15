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

  getAllPostsProfile(topic="trending"){
    this.homeSvc.getAllPosts().subscribe(
      (posts) => {
        this.allMyPosts=[];
        for(let post in posts)
        {
          let obj:IPost=posts[post];
          obj.id=post;
          this.allMyPosts.push(obj);
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
}
