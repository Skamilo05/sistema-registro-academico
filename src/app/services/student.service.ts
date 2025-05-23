import { Injectable } from "@angular/core"
import  { HttpClient } from "@angular/common/http"
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

export interface Subject {
  id: number
  nombre: string
  creditos: number
  profesor: {
    id: number
    nombre: string
  }
}

export interface Classmate {
  id: number
  nombre: string
}

export interface AvailableSubject {
  id: number;
  nombre: string;
  profesor: string;
  creditos: number;
  inscrita: boolean;
}

export interface StudentSummary {
  id: number
  nombre: string
  correo: string
  materias: Subject[]
  profesores: any[]
  creditos: number
  totalCreditos: number
}

@Injectable({
  providedIn: "root",
})
export class StudentService {
  private apiUrl = "https://localhost:7140/api"

  constructor(private http: HttpClient) {}

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/Materias`)
  }

  getStudentSubjects(studentId: number): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/Estudiantes/${studentId}/materias`)
  }

  getStudentSummary(studentId: number): Observable<StudentSummary> {
    return this.http.get<StudentSummary>(`${this.apiUrl}/Estudiantes/${studentId}/resumen`)
  }


getClassmates(subjectId: number): Observable<Classmate[]> {
  console.log(`StudentService.getClassmates called with subjectId: ${subjectId}`);
  
  return this.http.get<Classmate[]>(`${this.apiUrl}/materias/${subjectId}/companeros`)
    .pipe(
      tap(data => console.log("Classmates data from API:", data)),
      catchError(error => {
        console.error("Error in getClassmates:", error);
        return throwError(() => error);
      })
    );
}

  // Nuevo método para obtener materias disponibles
  getAvailableSubjects(studentId: number): Observable<AvailableSubject[]> {
    return this.http.get<AvailableSubject[]>(`${this.apiUrl}/Estudiantes/${studentId}/materias-disponibles`);
  }

  enrollSubjects(studentId: number, subjectIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/Estudiantes/inscribir`, {
      estudianteId: studentId,
      materiaId: subjectIds[0],
    })
  }
}
