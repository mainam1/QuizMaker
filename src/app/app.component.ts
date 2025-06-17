import { ReactiveFormsModule,FormControl,FormGroup } from '@angular/forms';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgFor } from '@angular/common'
import { NgIf } from '@angular/common'
import { FooterComponent } from './shared/footer/footer.component';
import { ProctoringComponent } from "./proctoring/proctoring.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor, NgIf, ReactiveFormsModule, NavbarComponent, FooterComponent, ProctoringComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'QuizMaker';
  // Add your component logic here
  items = [
    { id: 1, name: 'Item 1', description: 'Description for item 1' },
    { id: 2, name: 'Item 2', description: 'Description for item 2' },
    { id: 3, name: 'Item 3', description: 'Description for item 3' }
  ];
  
  selectedItem: any = null;
  
  selectItem(item: any): void {
    this.selectedItem = item;
  }
    isExamActive = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Activate proctoring only on exam routes
        this.isExamActive = event.url.includes('/exam');
      }
    });
  }

  handleExamViolation() {
    this.isExamActive = false;
    // Redirect to violation page or show notification
    this.router.navigate(['/exam-violation']);
    console.log('Exam terminated due to proctoring violation');
  }

}
  

