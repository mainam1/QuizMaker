import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from './question/question.component';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    QuestionComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgbModule,
    AppComponent,
    CommonModule,
    FormsModule
  ],
  providers: [ReactiveFormsModule],
  bootstrap: []
})
export class AppModule { }