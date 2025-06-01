import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExamComponent } from '../exam/exam.component';
import { NgIf } from '@angular/common';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { QuestionComponent } from '../question/question.component';
import { Router } from '@angular/router';
import { MakequizService } from './makequiz.service';
import { exam } from './makequiz.model';

@Component({
  selector: 'app-makequiz',
  standalone: true,
  imports: [NgIf , NgbModalModule, ReactiveFormsModule],
  templateUrl: './makequiz.component.html',
  styleUrl: './makequiz.component.css',
  providers: [NgbActiveModal] 
})
export class MakequizComponent {
  
  makequizForm: FormGroup;
  examData:any
  uniqueLink: string = '';
  isLoading: boolean = false;
   errorMessage: string | null = null;
  constructor(private fb: FormBuilder ,private makequizService:MakequizService ,private router: Router,private activeModal: NgbActiveModal) {
    this.makequizForm = this.fb.group({
      title: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      uniqueLink: ['']
    });
  }

// In makequiz.component.ts
onSubmit() {
  if (this.makequizForm.valid) {
    this.isLoading = true;
    this.errorMessage = null;
    const examData = {
      title: this.makequizForm.value.title,
      duration: this.makequizForm.value.duration,
      description: this.makequizForm.value.description,
      uniqueLink: this.uniqueLink
    };

    this.makequizService.createExam(examData).subscribe({
      next: (createdExam) => {
        // Navigate to question component with exam ID
        this.router.navigate(['/questions', createdExam.id]);
      },
      error: (err) => {
        this.handleError(err.message);
      }
    });
  }
}
  // Properly implement handleError
  private handleError(error: any): void {
    console.error('Error:', error);
    this.isLoading = false;
    this.errorMessage = error.error?.message || 
                       error.message || 
                       'An unknown error occurred';
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  cancel() {
    this.activeModal.close();
  }

  generateUniqueLink(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.uniqueLink = `${window.location.origin}/exam/${result}`;
    this.makequizForm.patchValue({ uniqueLink: this.uniqueLink });
  }


}