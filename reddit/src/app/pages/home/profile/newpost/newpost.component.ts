import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { IPost } from 'src/app/models/interfaces/i-post';
import { HomeService } from 'src/app/pages/home.service';
import { IRegister } from 'src/app/models/interfaces/i-register';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.component.html',
  styleUrls: ['./newpost.component.scss']
})
export class NewpostComponent implements OnInit, OnDestroy {
  private create: Subscription | undefined;

  userParsed:IRegister=JSON.parse(localStorage.getItem("userInfos")!);

  userLogged: IRegister = {
    email: '',
    nickname: '',
    profilePic: '',
    savedPosts: [],
    returnSecureToken: false,
    uniqueId: ''
  };

  base64Image: string = "";
  formRegister!: FormGroup;
  newPost:IPost = {
    title: '',
    bodyText: '',
    createdBy_id: '',
    postTopic: '',
    imageUrl: '',
    videoUrl: '',
    likes: { "start": 0 },
    saved: { "start": 0 },
    comments: { "start": 0 },
    id: '',
    user: this.userParsed,
    isCollapsed: true,
    postDate: ''
  }

  constructor(
    private fb: FormBuilder,
    private profileSvc: ProfileService,
    private homeSvc: HomeService,
    private router: Router
  ){}

  ngOnDestroy(): void {
    if(this.create) this.create.unsubscribe();
  }

  ngOnInit(){
    this.homeSvc.findLoggedUser();
    this.homeSvc.sharedProfile.subscribe(user=> {if(user) this.userParsed=user});
    this.formRegister = this.fb.group({
      title: ['', Validators.required],
      img: [''],
      topic: ['', Validators.required],
      body: ['', Validators.required],
    });
    this.homeSvc.sharedProfile.subscribe((user) => {
      if(user){
        this.userParsed = user;
      }
    })
  }

  createPost(){
    this.newPost.id = String(new Date().getTime()) + this.userLogged.uniqueId;
    this.newPost.createdBy_id = this.userLogged.uniqueId;
    this.newPost.title = this.formRegister.value.title;
    this.newPost.postTopic = this.formRegister.value.topic;
    this.newPost.bodyText = this.formRegister.value.body;
    this.newPost.imageUrl = this.base64Image;
    this.newPost.postDate=new Date().toLocaleString();
    console.log(this.newPost);

    this.create=this.profileSvc.create(this.newPost).subscribe(res => {
      this.router.navigate(['/profile']);
    })

  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.base64Image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
