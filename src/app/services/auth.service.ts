import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from "@angular/router";

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  contrasena: string;
}

export interface Student {
  id: number;
  nombre: string;
  correo: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "https://localhost:7140/api";
  private currentUserSubject = new BehaviorSubject<Student | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Estudiantes/login`, credentials).pipe(
      tap((response) => {
        if (response && response.id && this.isBrowser) {
          localStorage.setItem("currentUser", JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Estudiantes`, userData);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem("currentUser");
    }
    this.currentUserSubject.next(null);
    this.router.navigate(["/login"]);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): Student | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    return this.currentUserSubject.value?.id || null;
  }
}
