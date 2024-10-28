import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginGuard } from './guards/login.guard'; // Asegúrate de tener un guard
import { LoginComponent } from "./pages/login/login.component";


const routes: Routes = [
  {
    path: "",
    redirectTo: "login", // Cambiar a "login" como ruta por defecto
    pathMatch: "full"
  },
  {
    path: "login",
    component: LoginComponent // Ruta para el componente de login
  },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [LoginGuard], // Proteger con el guard
    children: [
      {
        path: "",
        loadChildren: () => import ("./layouts/admin-layout/admin-layout.module").then(m => m.AdminLayoutModule)
      }
    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () => import ("./layouts/auth-layout/auth-layout.module").then(m => m.AuthLayoutModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "login" // Redirigir a login si la ruta no es válida
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
