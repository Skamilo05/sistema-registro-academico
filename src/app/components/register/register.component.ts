import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import {  FormBuilder,  FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import {  MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import {  Router, RouterLink } from "@angular/router"
import  { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink,
  ],
  template: `
    <div class="register-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Registro de Estudiante</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre Completo</mat-label>
              <input matInput formControlName="nombre" required>
              <mat-error *ngIf="registerForm.get('nombre')?.hasError('required')">
                El nombre es requerido
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Correo Electrónico</mat-label>
              <input matInput formControlName="correo" ="email" required>
              <mat-error *ngIf="registerForm.get('correo')?.hasError('required')">
                El correo es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('correo')?.hasError('email')">
                Ingrese un correo válido
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="contrasena" ="password" required>
              <mat-error *ngIf="registerForm.get('contrasena')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('contrasena')?.hasError('minlength')">
                La contraseña debe tener al menos 6 caracteres
              </mat-error>
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="registerForm.invalid || isLoading">
              {{ isLoading ? 'Registrando...' : 'Registrarse' }}
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p class="login-link">¿Ya tienes una cuenta? <a routerLink="/login">Inicia sesión aquí</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [
    `
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    
    mat-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .login-link {
      text-align: center;
      margin-top: 10px;
    }
  `,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group({
      nombre: ["", Validators.required],
      correo: ["", [Validators.required, Validators.email]],
      contrasena: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.isLoading = false
          this.snackBar.open("Registro exitoso. Ahora puedes iniciar sesión.", "Cerrar", {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          })
          this.router.navigate(["/login"])
        },
        error: (error) => {
          this.isLoading = false
          this.snackBar.open("Error al registrarse. Intente nuevamente.", "Cerrar", {
            duration: 5000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
          })
          console.error("Registration error:", error)
        },
      })
    }
  }
}
