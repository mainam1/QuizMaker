import { Injectable, signal } from '@angular/core';
import { exam } from './makequiz.model';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../auth/login/login.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MakequizService {
backEndURL="http://localhost:8080/exams"
newexams=signal<exam[]>([])
 

  constructor(private http:HttpClient , private loginService: LoginService) { }

  
  addExamForCreator(creatorId: number, newExam: exam) {
 //   const headers = this.loginService.getAuthHeaders();
 const url = `${this.backEndURL}/creator/${creatorId}/exam`;
    return this.http.post<exam>(url, newExam);
  }
    createExam(examData: any): Observable<any> {
    return this.http.post(this.backEndURL, examData);
  }
}