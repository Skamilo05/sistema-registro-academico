import { Component } from "@angular/core"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { RouterLink, RouterLinkActive } from "@angular/router"
import  { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
  template: `
    <mat-toolbar color="primary">
      <span>Sistema de Registro Académico</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/dashboard" routerLinkActive="active">
        <mat-icon>dashboard</mat-icon> Dashboard
      </button>
      <button mat-button routerLink="/subject-selection" routerLinkActive="active">
        <mat-icon>school</mat-icon> Selección de Materias
      </button>
      <button mat-button routerLink="/student-summary" routerLinkActive="active">
        <mat-icon>person</mat-icon> Mi Resumen
      </button>
      <button mat-button (click)="logout()">
        <mat-icon>exit_to_app</mat-icon> Cerrar Sesión
      </button>
    </mat-toolbar>
  `,
  styles: [
    `
    .spacer {
      flex: 1 1 auto;
    }
    
    .active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `,
  ],
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  logout(): void {
    this.authService.logout()
  }
}
