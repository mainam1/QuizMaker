import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
export class ProctoringComponent implements OnInit, OnDestroy {
  @Input() examStarted = false;
  @Input() autoStartOnExam = true;
  @Output() examViolation = new EventEmitter<void>();
  
  tabSwitchCount = 0;
  maxTabSwitches = 2; // Set maximum allowed tab switches
  trigger$ = new Subject<void>();
  showWebcam = false;
  webcamImage: WebcamImage | null = null;
  captureInterval: any = null;
  isRecording = false;
  capturesTaken = 0;
  
  initializationError: string | null = null;

  @HostListener('window:blur')
  onTabSwitch() {
    if (this.isRecording) {
      this.tabSwitchCount++;
      
      // Show warning for first 2 violations
      if (this.tabSwitchCount <= this.maxTabSwitches) {
        alert(`Warning: Tab switched ${this.tabSwitchCount} times. This activity is being monitored.`);
        this.logEvent('TAB_SWITCH');
      }
      
      // Stop exam after max violations
      if (this.tabSwitchCount >= this.maxTabSwitches) {
        this.stopExamDueToViolation();
      }
    }
  }

  private stopExamDueToViolation() {
    this.logEvent('EXAM_TERMINATED_DUE_TO_VIOLATION');
    this.stopRecording();
    this.examViolation.emit(); // Notify parent component
    alert('Exam terminated due to multiple tab switches detected.');
  }

  @HostListener('window:beforeunload', ['$event'])
  onWindowClose(event: any) {
    if (this.isRecording) {
      this.logEvent('EXAM_EXIT_ATTEMPT');
      event.returnValue = 'Are you sure you want to leave the exam?';
    }
  }

  ngOnInit() {
    if (this.examStarted && this.autoStartOnExam) {
      this.startRecording();
    }
  }

  ngOnDestroy() {
    this.stopRecording();
  }

  onExamStart() {
    if (this.autoStartOnExam) {
      this.startRecording();
    }
  }

  onExamEnd() {
    this.stopRecording();
    this.logEvent('EXAM_COMPLETED');
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      this.showWebcam = true;
      this.isRecording = true;
      this.initializationError = null;
      
      this.logEvent('RECORDING_STARTED');
      
      this.captureInterval = setInterval(() => {
        this.trigger$.next();
      }, 5000);
      
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error: any) {
      console.error('Camera access error:', error);
      this.initializationError = this.getCameraErrorMessage(error);
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.logEvent('RECORDING_STOPPED');
    }
    
    this.isRecording = false;
    clearInterval(this.captureInterval);
    this.captureInterval = null;
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this.capturesTaken++;
    
    if (!this.isRecording) return;

    this.logCapture(webcamImage);
  }

  logEvent(event: string) {
    const payload = {
      event,
      timestamp: Date.now(),
      tabSwitchCount: this.tabSwitchCount,
      capturesTaken: this.capturesTaken
    };

    fetch('http://localhost:8080/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(error => {
      console.error('Failed to log event:', error);
    });
  }

  logCapture(webcamImage: WebcamImage) {
    const payload = {
      event: 'CAPTURE_TAKEN',
      timestamp: Date.now(),
      imageData: webcamImage.imageAsDataUrl,
      tabSwitchCount: this.tabSwitchCount
    };

    fetch('http://localhost:8080/api/captures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(error => {
      console.error('Failed to log capture:', error);
    });
  }

  private getCameraErrorMessage(error: any): string {
    switch (error.name) {
      case 'NotAllowedError': return 'Camera permission denied. Please allow camera access.';
      case 'NotFoundError': return 'No camera found. Please connect a camera.';
      case 'NotSupportedError': return 'Camera not supported by your browser.';
      case 'NotReadableError': return 'Camera is already in use by another application.';
      default: return 'Camera access failed. Please check your camera.';
    }
  }

  getMonitoringSummary() {
    return {
      capturesTaken: this.capturesTaken,
      tabSwitches: this.tabSwitchCount,
      isRecording: this.isRecording
    };
  }
}