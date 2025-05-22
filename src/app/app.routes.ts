import  { Routes } from "@angular/router"
import { authGuard } from "./guards/auth.guard"

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import("./components/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    loadComponent: () => import("./components/register/register.component").then((m) => m.RegisterComponent),
  },
  {
    path: "dashboard",
    loadComponent: () => import("./components/dashboard/dashboard.component").then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: "subject-selection",
    loadComponent: () =>
      import("./components/subject-selection/subject-selection.component").then((m) => m.SubjectSelectionComponent),
    canActivate: [authGuard],
  },
  {
    path: "classmates/:id",
    loadComponent: () => import("./components/classmates/classmates.component").then((m) => m.ClassmatesComponent),
    canActivate: [authGuard],
  },
  {
    path: "student-summary",
    loadComponent: () =>
      import("./components/student-summary/student-summary.component").then((m) => m.StudentSummaryComponent),
    canActivate: [authGuard],
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
]
