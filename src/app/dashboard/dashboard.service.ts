import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { exam } from '../makequiz/makequiz.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
backEndURL="http://localhost:8080/exams"
exams=signal<exam[]>([])
  constructor(private http:HttpClient) { }
  getAllExams():void{

    this.http.get<exam[]>(this.backEndURL).subscribe(data=>{
      this.exams.set(data)
    })
    
  }
  
}
