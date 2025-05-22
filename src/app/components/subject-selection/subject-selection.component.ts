// src/app/components/subject-selection/subject-selection.component.ts

import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { StudentService, AvailableSubject } from "../../services/student.service";

@Component({
  selector: "app-subject-selection",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIconModule,
    RouterLink,
  ],
  template: `
    <div class="subject-selection-container">
      <h1>Materias Inscritas</h1>
      
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="!loading">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Materias</mat-card-title>
            <mat-card-subtitle>Total: {{ getSelectedCount() }}/3</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="info-text">
              <mat-icon>info</mat-icon>
              Estas son las materias disponibles. Las materias con check son las que ya tienes inscritas.
            </p>
            
            <mat-divider></mat-divider>
            
            <div class="subjects-list">
              <div *ngFor="let subject of availableSubjects" class="subject-item">
                <mat-checkbox 
                  [checked]="subject.inscrita"
                  [disabled]="true"
                >
                  <div class="subject-info">
                    <span class="subject-name">{{ subject.nombre }}</span>
                    <span class="subject-details">
                      Profesor: {{ subject.profesor }} | Créditos: {{ subject.creditos }}
                    </span>
                  </div>
                </mat-checkbox>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/dashboard">
              <mat-icon>arrow_back</mat-icon> Volver al Dashboard
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
    .subject-selection-container {
      padding: 20px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }
    
    .info-text {
      display: flex;
      align-items: center;
      color: #555;
      margin-bottom: 15px;
    }
    
    .info-text mat-icon {
      margin-right: 8px;
      color: #3f51b5;
    }
    
    .subjects-list {
      margin-top: 20px;
    }
    
    .subject-item {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    
    .subject-info {
      display: flex;
      flex-direction: column;
      margin-left: 8px;
    }
    
    .subject-name {
      font-weight: 500;
    }
    
    .subject-details {
      font-size: 0.85rem;
      color: #666;
    }
  `,
  ],
})
export class SubjectSelectionComponent implements OnInit {
  availableSubjects: AvailableSubject[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    const studentId = this.authService.getCurrentUserId();
    if (!studentId) {
      this.loading = false;
      return;
    }

    // Load available subjects for the student
    this.studentService.getAvailableSubjects(studentId).subscribe({
      next: (subjects) => {
        this.availableSubjects = subjects;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading available subjects:", error);
        this.loading = false;
      },
    });
  }

  getSelectedCount(): number {
    return this.availableSubjects.filter(subject => subject.inscrita).length;
  }
}