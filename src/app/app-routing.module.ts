import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesAndResponsibilitiesHomeComponent } from "./roles-and-responsibilities-home/roles-and-responsibilities-home.component";
import { AuthGuard } from "./auth.guard";

const routes: Routes = [
  {
    path: "user",
    loadChildren: () => import("./rmp/rmp.module").then(m => m.RMPModule),
    canActivate: [AuthGuard]
  },
  {
    path: "",
    loadChildren: () => import("./rmp/rmp.module").then(m => m.RMPModule)
  },
  {
    path: "roles",
    component: RolesAndResponsibilitiesHomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    redirectTo: ""
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }