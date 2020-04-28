import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
    path: "**",
    redirectTo: ""
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }