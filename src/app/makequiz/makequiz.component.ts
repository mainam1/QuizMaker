import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExamComponent } from '../exam/exam.component';
import { NgIf } from '@angular/common';
import { Router , RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-makequiz',
  standalone: true,
  imports: [NgIf,RouterOutlet],
  templateUrl: './makequiz.component.html',
  styleUrl: './makequiz.component.css'
})
export class MakequizComponent {
  makequizForm: FormGroup;
  uniqueLink: string = '';
  constructor(private fb: FormBuilder , private router: Router) {
    this.makequizForm = this.fb.group({
      title: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  onSubmit() {
    if (this.makequizForm.valid) {
      console.log(this.makequizForm.value);
      // Future: Add method to save exam details
    }
  }

  create(): void {
    this.router.navigate(['/question']);
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }

  generateUniqueLink(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.uniqueLink = `https://examen.example.com/${result}`;
  }
}
