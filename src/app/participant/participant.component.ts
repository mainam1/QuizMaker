import { NgFor, NgIf, } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './participant.component.html',
  styleUrl: './participant.component.css'
})
export class ParticipantComponent {

}
