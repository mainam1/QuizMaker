export interface Creator{
    id:number
    fullname:string
    username:string
    email:string
    password:string
    photo:string
    active: boolean
    roles: string
   }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '', // This is the 'creator' path from the parent
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent 
      },
      // Add other creator routes here
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Default route
    ]
  }
];

@NgModule({
  declarations: [
    // Other components used in this module
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // Use forChild for feature modules
    DashboardComponent // Import standalone component here
  ]
})
export class CreatorModule { }