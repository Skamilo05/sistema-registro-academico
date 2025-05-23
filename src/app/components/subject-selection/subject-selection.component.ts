import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { StudentService, AvailableSubject } from "../../services/student.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-subject-selection",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
  ],
  template: `
    <div class="subject-selection-container">
      <h1>Selección de Materias</h1>
      
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="!loading">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Materias Disponibles</mat-card-title>
            <mat-card-subtitle>Selecciona hasta 3 materias ({{ selectedSubjects.length }}/3)</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="info-text">
              <mat-icon>info</mat-icon>
              Recuerda que no puedes tener clases con el mismo profesor.
            </p>
            
            <mat-divider></mat-divider>
            
            <div class="subjects-list">
              <div *ngFor="let subject of availableSubjects" class="subject-item">
                <mat-checkbox 
                  [checked]="subject.inscrita"
                  [disabled]="subject.inscrita"
                  
                  (change)="toggleSubjectSelection(subject, $event.checked)"
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
            <button 
              mat-raised-button 
              color="primary" 
              [disabled]="selectedSubjects.length === 0 || isSaving"
              (click)="saveSelection()"
            >
              <mat-icon>save</mat-icon>
              {{ isSaving ? 'Guardando...' : 'Guardar Selección' }}
            </button>
          </mat-card-actions>
        </mat-card>
        
        <mat-card class="selected-subjects-card" *ngIf="selectedSubjects.length > 0">
          <mat-card-header>
            <mat-card-title>Materias Seleccionadas</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list>
              <mat-list-item *ngFor="let subjectId of selectedSubjects">
                <div class="selected-subject-item">
                  {{ getSubjectName(subjectId) }}
                  <button mat-icon-button color="warn" (click)="removeSubject(subjectId)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </mat-list-item>
            </mat-list>
          </mat-card-content>
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
    
    .selected-subjects-card {
      margin-top: 20px;
    }
    
    .selected-subject-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  `,
  ],
})
export class SubjectSelectionComponent implements OnInit {
  availableSubjects: AvailableSubject[] = [];
  selectedSubjects: number[] = [];
  loading = true;
  isSaving = false;
  mensaje = '';

  selectedProfessors: Set<string> = new Set();

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private snackBar: MatSnackBar,
    private router: Router,
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

    this.studentService.getAvailableSubjects(studentId).subscribe({
      next: (subjects) => {
        this.availableSubjects = subjects;
        
            
        this.selectedSubjects = [];
        this.selectedProfessors.clear();
        
        subjects.forEach(subject => {
          if (subject.inscrita) {
            this.selectedSubjects.push(subject.id);
            this.selectedProfessors.add(subject.profesor);
          }
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error("Error loading available subjects:", error);
        this.loading = false;
      },
    });
  }

  isCheckboxDisabled(subject: AvailableSubject): boolean {
    if (subject.inscrita) {
      return false;
    }

    if (this.selectedSubjects.length >= 3) {
      return true;
    }

    return this.selectedProfessors.has(subject.profesor);
  }

  toggleSubjectSelection(subject: AvailableSubject, isChecked: boolean): void {
    if (isChecked) {
      if (this.selectedSubjects.length < 3 && !this.selectedProfessors.has(subject.profesor)) {
        this.selectedSubjects.push(subject.id);
        this.selectedProfessors.add(subject.profesor);
        subject.inscrita = true;
      }
    } else {
      const index = this.selectedSubjects.indexOf(subject.id);
      if (index !== -1) {
        this.selectedSubjects.splice(index, 1);
        subject.inscrita = false;

        const hasOtherSubjectsWithSameProfessor = this.availableSubjects.some((s) => 
          s.inscrita && s.id !== subject.id && s.profesor === subject.profesor
        );

        if (!hasOtherSubjectsWithSameProfessor) {
          this.selectedProfessors.delete(subject.profesor);
        }
      }
    }
  }

  removeSubject(subjectId: number): void {
    const subject = this.availableSubjects.find((s) => s.id === subjectId);
    if (subject) {
      this.toggleSubjectSelection(subject, false);
    }
  }

  getSubjectName(subjectId: number): string {
    const subject = this.availableSubjects.find((s) => s.id === subjectId);
    return subject ? subject.nombre : "Materia desconocida";
  }

  saveSelection(): void {
    const studentId = this.authService.getCurrentUserId();
    console.log(studentId) 

    if (!studentId) {
      
      this.snackBar.open("Error: No se pudo identificar al estudiante.", "Cerrar", {
        duration: 5000,
      });
      return;
    }

    this.isSaving = true;
    this.selectedSubjects.forEach(sub=>{
      this.studentService.enrollSubjects(studentId, sub).subscribe({
      next: () => {
        this.isSaving = false;
        this.snackBar.open("Materias inscritas correctamente.", "Cerrar", {
          duration: 5000,
        });
      },
      error: (error) => {
        this.isSaving = false;
        this.mensaje = error.error.error.length > 0? error.error.error: "Error al inscribir materias. Intente nuevamente."
        this.snackBar.open( this.mensaje ,"Cerrar", {
          duration: 5000,
        });
        console.error("Error enrolling subjects:", error);
        return

      },
    });
    })
        this.router.navigate(["/dashboard"]);
  }
}