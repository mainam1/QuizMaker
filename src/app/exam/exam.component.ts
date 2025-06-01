import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from './exam.service';
import { Subscription, interval } from 'rxjs';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-exam',
  standalone: true,
  templateUrl: './exam.component.html',
  imports: [NgIf,NgFor, NgbModalModule, ReactiveFormsModule],
  styleUrls: ['./exam.component.css'],
  providers: [NgbActiveModal]
})
export class ExamComponent implements OnInit, OnDestroy {
  // Exam state
  examData: any = null;
  questions: any[] = [];
  currentQuestionIndex = 0;
  answers: Record<number, any> = {};
  location: any = null;
  questionTimeLeft = 0;
  globalTimeElapsed = 0;
  finalScore: number = 0; // Initialize with your actual score
  scoreMessage: string = '';
  scoreMessageColor: string = 'black';

  // If you need to calculate these based on the score
  calculateMessages() {
    if (this.finalScore >= 80) {
      this.scoreMessage = 'Excellent!';
      this.scoreMessageColor = 'green';
    } else if (this.finalScore >= 50) {
      this.scoreMessage = 'Good job!';
      this.scoreMessageColor = 'blue';
    } else {
      this.scoreMessage = 'Keep practicing!';
      this.scoreMessageColor = 'red';
    }
  }

  // Call this whenever the score changes

  
  // UI state
  currentSection: 'geolocation' | 'intro' | 'question' | 'results' = 'geolocation';
  loading = true;
  error = '';

  // Form for direct answers
  answerForm: FormGroup;

  // Subscriptions
  private questionIntervalSub?: Subscription;
  private globalIntervalSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private fb: FormBuilder,
    private activeModal: NgbActiveModal
  ) {
    this.answerForm = this.fb.group({
      directAnswer: ['']
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const examLink = this.route.snapshot.paramMap.get('exam');
    if (!examLink) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadExam(examLink, token);
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  loadExam(examLink: string, token: string): void {
    this.examService.getExam(examLink, token).subscribe({
      next: (data) => {
        this.examData = data.exam;
        this.questions = data.questions;
        
        // Initialize answers
        this.questions.forEach((q, index) => {
          this.answers[index] = {
            questionId: q._id,
            answer: '',
            selectedOptions: []
          };
        });
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading exam:', err);
        this.error = 'Erreur lors du chargement de l\'examen';
        this.router.navigate(['/connexion']);
      }
    });
  }

  enableGeolocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          this.currentSection = 'intro';
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.error = 'Erreur de géolocalisation. Vous devez autoriser la localisation pour passer l\'examen.';
        }
      );
    } else {
      this.error = 'La géolocalisation n\'est pas supportée par votre navigateur.';
    }
  }

  startExam(): void {
    this.currentSection = 'question';
    this.displayQuestion(this.currentQuestionIndex);
    this.startTimers();
  }

  displayQuestion(index: number): void {
    this.currentQuestionIndex = index;
    this.questionTimeLeft = this.questions[index].durationInSeconds;
    this.updateQuestionTimerDisplay();
    
    // Reset form for the new question
    this.answerForm.reset();
    if (this.questions[index].questionType === 'direct') {
      this.answerForm.patchValue({
        directAnswer: this.answers[index].answer
      });
    }
  }

  saveAnswer(index: number): void {
    const question = this.questions[index];
    if (question.questionType === 'direct') {
      this.answers[index].answer = this.answerForm.value.directAnswer;
    }
    // QCM answers are saved in real-time via click handlers
  }

  toggleOption(optionText: string): void {
    const currentAnswers = this.answers[this.currentQuestionIndex].selectedOptions;
    const index = currentAnswers.indexOf(optionText);
    
    if (index === -1) {
      currentAnswers.push(optionText);
    } else {
      currentAnswers.splice(index, 1);
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.saveAnswer(this.currentQuestionIndex);
      this.displayQuestion(this.currentQuestionIndex - 1);
    }
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.saveAnswer(this.currentQuestionIndex);
      this.displayQuestion(this.currentQuestionIndex + 1);
    }
  }

  submitExam(): void {
    this.saveAnswer(this.currentQuestionIndex);
    this.clearTimers();
    
    const token = localStorage.getItem('token');
    if (!token || !this.examData) return;

    this.examService.submitExam(this.examData._id, Object.values(this.answers), this.location, token)
      .subscribe({
        next: (result) => {
          this.showResults(result.finalScore);
        },
        error: (err) => {
          console.error('Submission error:', err);
          this.error = 'Erreur lors de la soumission de l\'examen';
        }
      });
  }

  startTimers(): void {
    // Global timer
    this.globalIntervalSub = interval(1000).subscribe(() => {
      this.globalTimeElapsed++;
    });

    // Question timer
    this.questionIntervalSub = interval(1000).subscribe(() => {
      this.questionTimeLeft--;
      this.updateQuestionTimerDisplay();
      
      if (this.questionTimeLeft <= 0) {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.nextQuestion();
        } else {
          this.submitExam();
        }
      }
    });
  }

  clearTimers(): void {
    this.questionIntervalSub?.unsubscribe();
    this.globalIntervalSub?.unsubscribe();
  }

  updateQuestionTimerDisplay(): void {
    const timerElement = document.getElementById('questionTimer');
    if (timerElement) {
      const minutes = Math.floor(this.questionTimeLeft / 60);
      const seconds = this.questionTimeLeft % 60;
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      if (this.questionTimeLeft <= 10) {
        timerElement.style.color = '#e74c3c';
        timerElement.style.fontWeight = 'bold';
      } else {
        timerElement.style.color = '';
        timerElement.style.fontWeight = '';
      }
    }
  }

  showResults(score: number): void {
    this.currentSection = 'results';
    // You can add more result display logic here
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} min ${secs} sec`;
  }

  returnHome(): void {
    this.router.navigate(['/home']);
  }
}