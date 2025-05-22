import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { MatListModule } from "@angular/material/list"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { RouterLink } from "@angular/router"
import  { AuthService } from "../../services/auth.service"
import  { StudentService, StudentSummary } from "../../services/student.service"

@Component({
  selector: "app-student-summary",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  template: `
    <div class="summary-container">
      <h1>Mi Resumen Académico</h1>
      
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="!loading && studentSummary">
        <mat-card class="student-info-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>person</mat-icon>
            <mat-card-title>{{ studentSummary.nombre }}</mat-card-title>
            <mat-card-subtitle>{{ studentSummary.correo }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="info-section">
              <h3>
                <mat-icon>school</mat-icon>
                Materias Inscritas ({{ studentSummary.materias?.length || 0 }}/3)
              </h3>
              
              <div *ngIf="studentSummary.materias?.length; else noSubjects">
                <mat-card *ngFor="let subject of studentSummary.materias" class="subject-card">
                  <mat-card-header>
                    <mat-card-title>{{ subject.nombre }}</mat-card-title>
                    <mat-card-subtitle>Créditos: {{ subject.creditos }}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p><strong>Profesor:</strong> {{ subject.profesor }}</p>

                    <button 
                      mat-button 
                      color="primary" 
                      [routerLink]="['/classmates', subject.id]"
                      (click)="logSubjectId(subject.id)"
                    >
                      <mat-icon>people</mat-icon> Ver Compañeros
                    </button>


                  </mat-card-content>
                </mat-card>
              </div>
              
              <ng-template #noSubjects>
                <p>No tienes materias inscritas.</p>
                <button mat-raised-button color="primary" routerLink="/subject-selection">
                  <mat-icon>add</mat-icon> Inscribir Materias
                </button>
              </ng-template>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="info-section">
              <h3>
                <mat-icon>person</mat-icon>
                Profesores
              </h3>
              
              <div *ngIf="studentSummary.profesores?.length; else noProfessors">
                <mat-list>
                  <mat-list-item *ngFor="let profesor of studentSummary.profesores">
                    {{ profesor.nombre }}
                  </mat-list-item>
                </mat-list>
              </div>
              
              <ng-template #noProfessors>
                <p>No tienes profesores asignados.</p>
              </ng-template>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="info-section">
              <h3>
                <mat-icon>credit_card</mat-icon>
                Resumen de Créditos
              </h3>
              
              <div class="credits-summary">
                <p><strong>Créditos Inscritos:</strong> {{ studentSummary.creditos }}</p>
                <p><strong>Total de Créditos Permitidos:</strong> {{ studentSummary.totalCreditos }}</p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div *ngIf="!loading && !studentSummary" class="error-container">
        <mat-card>
          <mat-card-content>
            <p>No se pudo cargar la información del estudiante.</p>
            <button mat-raised-button color="primary" routerLink="/dashboard">
              Volver al Dashboard
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
    .summary-container {
      padding: 20px;
    }
    
    .loading-container, .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }
    
    .student-info-card {
      margin-bottom: 20px;
    }
    
    .info-section {
      margin: 20px 0;
    }
    
    .info-section h3 {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .info-section h3 mat-icon {
      margin-right: 10px;
      color: #3f51b5;
    }
    
    .subject-card {
      margin-bottom: 15px;
    }
    
    .credits-summary {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
    }
  `,
  ],
})
export class StudentSummaryComponent implements OnInit {
  studentSummary: StudentSummary | null = null
  loading = true
  logSubjectId(id: number): void {
  console.log("Navigating to classmates with subject ID:", id);
  }

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    this.loadStudentSummary()
  }

  loadStudentSummary(): void {
    const studentId = this.authService.getCurrentUserId()
    if (studentId) {
      this.studentService.getStudentSummary(studentId).subscribe({
        next: (summary) => {
          this.studentSummary = summary
          this.loading = false
        },
        error: (error) => {
          console.error("Error loading student summary:", error)
          this.loading = false
        },
      })
    } else {
      this.loading = false
    }
  }
}
