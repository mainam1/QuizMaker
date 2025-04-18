import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgbModule,
    AppComponent,
    CommonModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }