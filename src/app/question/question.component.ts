// quiz-creator.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-question',
  standalone: true,
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [NgbModal, ReactiveFormsModule],
})
export class QuestionComponent implements OnInit {

    examForm: FormGroup;
    mediaTypes = ['None', 'Image', 'Video', 'Audio'];
  
    constructor(private fb: FormBuilder) {
      this.examForm = this.fb.group({
        questions: this.fb.array([])
      });
    }
  ngOnInit(): void {
  
  }
  
    get questions() {
      return this.examForm.get('questions') as FormArray;
    }
  
    getOptions(questionIndex: number) {
      return this.questions.at(questionIndex).get('options') as FormArray;
    }
  
    addQuestion(type: string) {
      const questionGroup = this.fb.group({
        type: [type],
        statement: ['', Validators.required],
        mediaType: ['None'],
        grade: [1, [Validators.required, Validators.min(0)]],
        answer: [''],
        options: this.fb.array(type === 'mcq' ? this.createInitialOptions() : [])
      });
  
      this.questions.push(questionGroup);
    }
  
    createInitialOptions() {
      return [
        this.createOption('', false),
        this.createOption('', false)
      ];
    }
  
    createOption(text: string, isCorrect: boolean) {
      return this.fb.group({
        text: [text, Validators.required],
        isCorrect: [isCorrect]
      });
    }
  
    addOption(questionIndex: number) {
      this.getOptions(questionIndex).push(this.createOption('', false));
    }
  
    removeOption(questionIndex: number, optionIndex: number) {
      this.getOptions(questionIndex).removeAt(optionIndex);
    }
  
    removeQuestion(questionIndex: number) {
      this.questions.removeAt(questionIndex);
    }
  
    onSubmit() {
      if (this.examForm.valid) {
        console.log('Quiz submitted:', this.examForm.value);
        
      }
    }
  }
