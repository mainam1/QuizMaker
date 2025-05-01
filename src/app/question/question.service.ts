import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: any[] = [];

  addQuestion(question: any) {
    this.questions.push(question);
  }

  getQuestions() {
    return this.questions;
  }

  clearQuestions() {
    this.questions = [];
  }
  constructor() { }
}
