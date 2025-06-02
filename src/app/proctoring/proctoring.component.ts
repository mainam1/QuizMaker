import { Component } from '@angular/core';
import { HostListener } from '@angular/core';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proctoring',
  standalone: true,
  imports: [WebcamModule, CommonModule],
  templateUrl: './proctoring.component.html',
  styleUrl: './proctoring.component.css'
})
export class ProctoringComponent {
  tabSwitchCount = 0;
  trigger$ = new Subject<void>();
  showWebcam = false; // Start with camera off
  webcamImage: WebcamImage | null = null;
  captureInterval: any = null; // Store interval reference
  isRecording = false; // Track recording state

  @HostListener('window:blur')
  onTabSwitch() {
    if (this.isRecording) {
      this.tabSwitchCount++;
      alert(`Warning: Tab switched ${this.tabSwitchCount}x`);
      this.logEvent('TAB_SWITCH');
    }
  }

  logEvent(event: string) {
    fetch('http://localhost:8080/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        event, 
        timestamp: Date.now(),
        count: this.tabSwitchCount 
      })
    });
  }

  startRecording() {
    this.showWebcam = true;
    this.isRecording = true;
    // Start capturing every 10 seconds
    this.captureInterval = setInterval(() => {
      this.trigger$.next();
    }, 10000);
  }

  stopRecording() {
    this.isRecording = false;
    clearInterval(this.captureInterval); // Stop automatic captures
    this.captureInterval = null;
    // Optional: Turn off camera
    // this.showWebcam = false;
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    if (this.isRecording) {
      fetch('http://localhost:8080/api/face-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: webcamImage.imageAsBase64,
          timestamp: Date.now()
        })
      });
    }
  }
}