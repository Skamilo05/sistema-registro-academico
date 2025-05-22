import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { RouterLink } from "@angular/router"
import  { AuthService } from "../../services/auth.service"
import  { StudentService, StudentSummary } from "../../services/student.service"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatDividerModule } from "@angular/material/divider"
import { MatListModule } from "@angular/material/list"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule,
  ],
  template: `
    <div class="dashboard-container">
      <h1>Bienvenido, {{ studentName }}</h1>
      
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>
      
      <div class="dashboard-content" *ngIf="!loading">
        <div class="dashboard-cards">
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>school</mat-icon>
              <mat-card-title>Materias Inscritas</mat-card-title>
              <mat-card-subtitle>Total: {{ studentSummary?.materias?.length || 0 }}/3</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <mat-list *ngIf="studentSummary?.materias?.length; else noSubjects">
                <mat-list-item *ngFor="let subject of studentSummary?.materias">
                  {{ subject.nombre }}
                </mat-list-item>
              </mat-list>
              <ng-template #noSubjects>
                <p>No tienes materias inscritas.</p>
              </ng-template>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" routerLink="/subject-selection">
                <mat-icon>add</mat-icon> Inscribir Materias
              </button>
            </mat-card-actions>
          </mat-card>
          
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>credit_card</mat-icon>
              <mat-card-title>Créditos</mat-card-title>
              
            </mat-card-header>
            <mat-card-content>
              <p>Cada materia equivale a 3 créditos.</p>
              <p>Puedes inscribir hasta 3 materias (9 créditos).</p>
            </mat-card-content>
          </mat-card>
          
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>people</mat-icon>
              <mat-card-title>Compañeros de Clase</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Puedes ver los compañeros con los que compartirás cada clase.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" routerLink="/student-summary">
                <mat-icon>visibility</mat-icon> Ver Detalles
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .dashboard-container {
      padding: 20px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }
    
    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .dashboard-card {
      height: 100%;
    }
  `,
  ],
})
export class DashboardComponent implements OnInit {
  studentName = ""
  studentSummary: StudentSummary | null = null
  loading = true

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser()
    if (currentUser) {
      this.studentName = currentUser.nombre
      this.loadStudentSummary()
    }
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
