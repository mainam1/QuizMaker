import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:8080/questions';
  private questions: any[] = [];
  http: any;

  addQuestion(questionData: any): Observable<any> {
    return this.http.post(this.apiUrl, questionData);
  }

  getQuestions(examId: number): Observable<any[]> {
    return this.http.get(`${this.apiUrl}?examId=${examId}`);
  }
  clearQuestions() {
    this.questions = [];
  }
  constructor() { }
}
