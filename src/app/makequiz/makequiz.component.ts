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
}
