import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { IPost } from 'src/app/models/interfaces/i-post';

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.component.html',
  styleUrls: ['./newpost.component.scss']
})
export class NewpostComponent implements OnInit {

  base64Image: string = "";
  formRegister!: FormGroup;
  newPost:IPost = {
    title: '',
    bodyText: '',
    createdBy_id: '',
    postTopic: '',
    imageUrl: '',
    videoUrl: '',
    likes: [],
    id: ''
  }

  constructor(
    private fb: FormBuilder,
    private profileSvc: ProfileService
  ){}

  ngOnInit(){
    this.formRegister = this.fb.group({
      title: ['', Validators.required],
      img: [''],
      topic: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  createPost(){
    this.newPost.title = this.formRegister.value.title;
    this.newPost.postTopic = this.formRegister.value.topic;
    this.newPost.bodyText = this.formRegister.value.body;
    this.newPost.imageUrl = this.base64Image;

    this.profileSvc.create(this.newPost).subscribe(res => {
      console.log(res);
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
