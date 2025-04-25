// quiz-creator.component.ts
import { Component } from '@angular/core';
import { ExamService } from '../../exam/exam.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  providers: [NgbModal],
})
export class QuestionComponent {
  quiz = {
    title: '',
    questions: [
      {
        text: '',
        type: 'MCQ',
        answers: [
          { text: '', isCorrect: false }
        ]
      }
    ]
  };

  constructor(private examService: ExamService) {}

  addQuestion() {
    this.quiz.questions.push({
      text: '',
      type: 'MCQ',
      answers: [{ text: '', isCorrect: false }]
    });
  }

  saveQuiz() {
    this.examService.createQuiz(this.quiz).subscribe(
      (res: any) => console.log('Quiz saved!', res)
    );
  }
}