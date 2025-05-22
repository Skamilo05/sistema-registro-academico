import { bootstrapApplication } from "@angular/platform-browser"
import { AppComponent } from "./app/app.component"

import { provideAnimations } from "@angular/platform-browser/animations"
import { provideRouter } from "@angular/router"
import { routes } from "./app/app.routes"

import { provideHttpClient, withFetch } from "@angular/common/http";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideRouter(routes)
  ],
}).catch((err) => console.error(err));
