interface Question {
  type: string;
  statement: string;
  media: string;
  mediaType: string;
  grade: number;
  duration: number;
  answer?: string;
  toleranceRate?: number;
  options?: Option[];
}

interface Option {
  text: string;
  isCorrect: boolean;
}
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { QuestionService } from './question.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-question',
  standalone: true,
  imports: [RouterOutlet,NgIf,NgFor,CommonModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
  providers: [NgbActiveModal] 
})
export class QuestionComponent implements OnInit {
  examForm!: FormGroup;
  questionTypes = ['question directe', 'QCM'];
  mediaTypes = ['image', 'audio', 'vidéo'];
  uniqueLink: string = '';
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.examForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],

      questions: this.fb.array([])
    });
    
    // Générer un lien unique simulé
    this.generateUniqueLink();
  }
  
  get questions(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }
  
  addQuestion(type: string): void {
    const questionForm = this.fb.group({
      type: [type, Validators.required],
      statement: ['', Validators.required],
      media: [''],
      mediaType: ['none'],
      grade: [1, [Validators.required, Validators.min(0),Validators.max(100)]],
      duration: [60, [Validators.required, Validators.min(1),Validators.max(300)]]
    });
    
    if (type === 'question directe') {
      (questionForm as FormGroup).addControl('answer', this.fb.control('', Validators.required));
      (questionForm as FormGroup).addControl('toleranceRate', this.fb.control(10, [Validators.required, Validators.min(0), Validators.max(100)]));
    } else if (type === 'QCM') {
      (questionForm as FormGroup).addControl('options', this.fb.array([
        this.createOption(true),
        this.createOption(false),
        this.createOption(false)
      ]));
    }
    
    this.questions.push(questionForm);
  }
  
  createOption(isCorrect: boolean = false) {
    return this.fb.group({
      text: ['', Validators.required],
      isCorrect: [isCorrect]
    });
  }
  
  addOption(questionIndex: number): void {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.push(this.createOption());
  }
  
  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.questions.at(questionIndex).get('options') as FormArray;
    options.removeAt(optionIndex);
  }
  
  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }
  
  getOptionsFromQuestion(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('options') as FormArray;
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
  
  onSubmit(): void {
    if (this.examForm.valid) {
      console.log('Examen créé :', this.examForm.value);
      // Ici, vous appelleriez votre service pour enregistrer l'examen
      alert('Examen créé avec succès !');
    } else {
      alert('Veuillez corriger les erreurs dans le formulaire.');
      this.markFormGroupTouched(this.examForm);
    }
  }
  
  // Utilitaire pour marquer tous les champs comme touchés (pour afficher les erreurs)
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
      if (control instanceof FormArray) {
        control.controls.forEach(ctrl => {
          if (ctrl instanceof FormGroup) {
            this.markFormGroupTouched(ctrl);
          } else {
            ctrl.markAsTouched();
          }
        });
      }
    });
  }
}