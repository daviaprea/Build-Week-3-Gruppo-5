import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  saved: boolean = false;

  savePost():void{
    if (!this.saved) {
      this.saved = true;
    } else {
      this.saved = false;
    }
  }
}
