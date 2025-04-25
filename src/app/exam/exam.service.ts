/*import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})  
export class ExamService {
exams=[
  {"id":1,"title":"Java", "duration":"30min", "description": "examen de java" ,"passingscore":"10"}
]
  constructor() { }
  getExams(){
    return this.exams;
  }
}
// src/app/services/exam.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Exam } from '../models/exam';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ExamService {
  constructor(
    private auth: AuthService,
    private firestore: AngularFirestore
  ) {}

  private get currentUser() {
    const user = this.auth.currentUserValue;
    if (!user) throw new Error('User not authenticated');
    return user;
  }

  generateAccessLink(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => 
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }

  createExam(exam: Exam): Promise<string> {
    const newExam: Exam = {
      ...exam,
      createdBy: this.currentUser.id!,
      createdAt: new Date(),
      accessLink: this.generateAccessLink(),
      questions: []
    };

    return this.firestore.collection<Exam>('exams').add(newExam)
      .then(ref => {
        ref.update({ id: ref.id });
        return ref.id;
      });
  }

  getExamById(id: string): Observable<Exam | null> {
    return this.firestore.doc<Exam>(`exams/${id}`).valueChanges().pipe(
      map(exam => exam ?? null)
    );
  }

  getExamByAccessLink(link: string): Observable<Exam | null> {
    return this.firestore.collection<Exam>('exams', ref => 
      ref.where('accessLink', '==', link)
    ).valueChanges().pipe(map(exams => exams[0] || null));
  }

  getCreatorExams(): Observable<Exam[]> {
    return this.firestore.collection<Exam>('exams', ref => 
      ref.where('createdBy', '==', this.currentUser.id)
         .orderBy('createdAt', 'desc')
    ).valueChanges();
  }

  updateExam(id: string, data: Partial<Exam>): Promise<void> {
    return this.firestore.doc<Exam>(`exams/${id}`).update(data);
  }

  deleteExam(id: string): Promise<void> {
    return this.firestore.doc<Exam>(`exams/${id}`).delete();
  }
}
*/
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Exam } from '../models/exam';

@Injectable({ providedIn: 'root' })
export class ExamService {
  createQuiz(quiz: { title: string; questions: { text: string; type: string; answers: { text: string; isCorrect: boolean; }[]; }[]; }) {
    throw new Error('Method not implemented.');
  }
  constructor(private firestore: AngularFirestore) {}

  // Create a new exam with auto-generated ID
  async createExam(examData: Exam): Promise<string> {
    const docRef = await this.firestore.collection('exams').add(examData);
    return docRef.id;
  }

  // Get exam by ID
  getExam(examId: string) {
    return this.firestore.doc(`exams/${examId}`).valueChanges();
  }

  // Get all exams for a specific creator
  getExamsByCreator(userId: string) {
    return this.firestore.collection('exams', ref => 
      ref.where('createdBy', '==', userId)
         .orderBy('createdAt', 'desc')
    ).valueChanges();
  }

  // Update exam data
  updateExam(examId: string, updates: Partial<Exam>) {
    return this.firestore.doc(`exams/${examId}`).update(updates);
  }

  // Delete an exam
  deleteExam(examId: string) {
    return this.firestore.doc(`exams/${examId}`).delete();
  }

  // Generate a random access link
  generateAccessCode(length = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}