import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { NbCardModule, NbCheckboxModule,NbFormFieldModule, NbSelectModule,NbListModule,NbInputModule,NbButtonModule,NbToastrModule,NbIconModule} from '@nebular/theme'
import { ThemeModule} from '../../@theme/theme.module';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { RoleComponent } from './role/role.component';
import { FormsModule ,ReactiveFormsModule,} from '@angular/forms';
import { CommonService } from '../common.service';
import { AssignRoleComponent } from '../user/assign-role/assign-role.component'
import { AgGridModule } from 'ag-grid-angular';
import { AllowuserComponent } from './allowuser/allowuser.component';

@NgModule({
  declarations: [
    UserprofileComponent,
    RoleComponent,AssignRoleComponent, AllowuserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NbCardModule,
    NbCheckboxModule,NbIconModule,
    NbSelectModule,NbListModule,ThemeModule,
    NbToastrModule.forRoot(),
    FormsModule,NbInputModule,NbButtonModule,ReactiveFormsModule,NbFormFieldModule,
    AgGridModule
  ],providers: [CommonService]
})
export class UserModule { }
