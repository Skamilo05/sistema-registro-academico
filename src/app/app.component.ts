import { Component } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { CommonModule } from "@angular/common"
import  { AuthService } from "./services/auth.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar *ngIf="authService.isLoggedIn()"></app-navbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `,
  ],
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
