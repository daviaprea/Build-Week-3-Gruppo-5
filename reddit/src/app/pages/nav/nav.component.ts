import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LoginComponent } from '../auth/login/login.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  darkMode = false;
  dark = <HTMLElement>document.querySelector('.dark');
  dropDown = <HTMLElement>document.querySelector('.dropDown');

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit(): void {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'true') {
      this.darkMode = true;
      this.dark.classList.add('darkMode');
    } else {
      this.darkMode = false;
      this.dark.classList.remove('darkMode');
    }
  }

  toggleDarkMode(event: MatSlideToggleChange):void{

    this.darkMode = event.checked;
    if (this.darkMode) {
      this.dark.classList.add('darkMode');
    } else {
      this.dark.classList.remove('darkMode');
    }
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  stopDropDown(event: MouseEvent) {
    event.stopPropagation();
  }
}
