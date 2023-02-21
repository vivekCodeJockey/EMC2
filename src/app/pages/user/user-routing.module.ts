import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleComponent } from './role/role.component';
import { AssignRoleComponent } from './assign-role/assign-role.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { AllowuserComponent } from './allowuser/allowuser.component'
import { APIService } from '../api.service';


const routes: Routes = [
  {
    path: "",
    component: UserprofileComponent
  },
  {
    path: "role",
    component: RoleComponent
  },
  {
    path: "assign",
    component: AssignRoleComponent
  },
  {
    path: "userProfile",
    component: UserprofileComponent
  },
  {
    path: "approve",
    component: AllowuserComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule], providers: [APIService]
})
export class UserRoutingModule { }
