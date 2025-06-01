// exam.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ExamData {
  _id: string;
  title: string;
  description: string;
  publicCible: string;
}

interface Question {
  _id: string;
  questionText: string;
  questionType: 'direct' | 'qcm';
  durationInSeconds: number;
  qcmOptions?: Array<{
    optionText: string;
    isCorrect?: boolean;
  }>;
}

interface Answer {
  questionId: string;
  answer: string;
  selectedOptions: string[];
}

interface SubmissionResult {
  finalScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:5000/api/student';

  constructor(private http: HttpClient) { }

  getExam(examLink: string, token: string): Observable<{ exam: ExamData, questions: Question[] }> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<{ exam: ExamData, questions: Question[] }>(`${this.apiUrl}/exam/${examLink}`, { headers });
  }

  submitExam(examId: string, answers: Answer[], location: any, token: string): Observable<SubmissionResult> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<SubmissionResult>(`${this.apiUrl}/submit-exam/${examId}`, { answers, location }, { headers });
  }
}