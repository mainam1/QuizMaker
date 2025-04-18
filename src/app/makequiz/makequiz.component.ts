import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router , RouterOutlet} from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-makequiz',
  standalone: true,
  imports: [NgIf,RouterOutlet,ReactiveFormsModule],
  templateUrl: './makequiz.component.html',
  styleUrl: './makequiz.component.css',
  providers: [NgbActiveModal] 
})
export class MakequizComponent {
  makequizForm!: FormGroup;
  uniqueLink: string = '';
  constructor(private fb: FormBuilder , private router: Router ) {
    this.makequizForm = this.fb.group({
      title: ['', [Validators.required]],
      duration: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      uniqueLink: ['']
    });
  }

  onSubmit() {
    if (this.makequizForm.valid) {
      console.log(this.makequizForm.value);
      // Future: Add method to save exam details
    }
  }

  create() {
this.router.navigate(['/question']);
    } 


  cancel() {
    this.router.navigate(['/']);
  }

  generateUniqueLink(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.uniqueLink = `https://examen.example.com/${result}`;
  }
}
