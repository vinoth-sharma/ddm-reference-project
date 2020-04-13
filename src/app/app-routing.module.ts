import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogEntryComponent } from "./log-entry/log-entry.component"; 
import { SortTableComponent } from "./sort-table/sort-table.component";
import { RMPModule } from "./rmp/rmp.module";
import { AuthGuard } from "./auth.guard";
import { RMP_Routes } from "./rmp/rmp-routing.module"

const routes: Routes = [
  {
    path: "user",
    loadChildren : ()=>import("./rmp/rmp.module").then(m=>m.RMPModule),
    canActivate: [AuthGuard]
  },
  {
    path: "",
    loadChildren : ()=>import("./rmp/rmp.module").then(m=>m.RMPModule)
    // canActivate: [AuthGuard]
  },
  {
    path: "roles",
    component: SortTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "logs",
    component: LogEntryComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: "**", 
    redirectTo: "" 
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})

export class AppRoutingModule { }