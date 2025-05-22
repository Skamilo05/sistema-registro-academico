import { Component,  OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  ActivatedRoute,  Router, RouterLink } from "@angular/router"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatListModule } from "@angular/material/list"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import  { StudentService, Classmate } from "../../services/student.service"

@Component({
  selector: "app-classmates",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  template: `
    <div class="classmates-container">
      <h1>Compañeros de Clase</h1>
      
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>
      
      <div *ngIf="!loading">
        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar>school</mat-icon>
            <mat-card-title>{{ subjectName }}</mat-card-title>
            <mat-card-subtitle *ngIf="classmates.length">{{ classmates.length }} compañeros</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="classmates.length; else noClassmates">
              <mat-list>
                <mat-list-item *ngFor="let classmate of classmates">
                  <mat-icon matListItemIcon>person</mat-icon>
                  <div matListItemTitle>{{ classmate.nombre }}</div>
                </mat-list-item>
              </mat-list>
            </div>
            
            <ng-template #noClassmates>
              <p>No hay otros estudiantes inscritos en esta materia.</p>
            </ng-template>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" routerLink="/student-summary">
              <mat-icon>arrow_back</mat-icon> Volver a Mi Resumen
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
    .classmates-container {
      padding: 20px;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }
  `,
  ],
})
export class ClassmatesComponent implements OnInit {
  subjectId: number | null = null
  subjectName = "Materia"
  classmates: Classmate[] = []
  loading = true

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"]
      if (id) {
        this.subjectId = +id
        this.loadClassmates()
        this.loadSubjectName()
      } else {
        this.router.navigate(["/student-summary"])
      }
    })
  }

  loadClassmates(): void {
    if (this.subjectId) {
      this.studentService.getClassmates(this.subjectId).subscribe({
        next: (classmates) => {
          this.classmates = classmates
          this.loading = false
        },
        error: (error) => {
          console.error("Error loading classmates:", error)
          this.loading = false
        },
      })
    }
  }

  loadSubjectName(): void {
    if (this.subjectId) {
      this.studentService.getSubjects().subscribe({
        next: (subjects) => {
          const subject = subjects.find((s) => s.id === this.subjectId)
          if (subject) {
            this.subjectName = subject.nombre
          }
        },
        error: (error) => {
          console.error("Error loading subject name:", error)
        },
      })
    }
  }
}
