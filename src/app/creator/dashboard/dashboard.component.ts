import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../exam/exam.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Exam } from '../../models/exam';
import { AuthService } from '../../auth/auth.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-creator-dashboard',
  standalone: true,
  imports: [NgIf,NgFor, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent implements OnInit {
  exams$: Observable<Exam[]>;
  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private router: Router
  ) {
    this.exams$ = this.examService.getCreatorExams();
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn$ || !this.authService.isceator

    ) {
      this.router.navigate(['/login']);
    }
  }

  createExam(): void {
    this.router.navigate(['/ceator/create-exam']);
  }

  editExam(exam: Exam): void {
    this.router.navigate(['/ceator/edit-exam', exam.id]);
  }

  viewExam(exam: Exam): void {
    this.router.navigate(['/ceator/view-exam', exam.id]);
  }

  deleteExam(exam: Exam): void {
    if (confirm(`Are you sure you want to delete the exam "${exam.title}"?`)) {
      this.examService.deleteExam(exam.id!);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  copyLink(accessLink: string): void {
    const fullLink = `${window.location.origin}/exam/${accessLink}`;
    navigator.clipboard.writeText(fullLink).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  }
}
