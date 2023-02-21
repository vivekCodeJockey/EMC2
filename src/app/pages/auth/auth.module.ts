import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponentComponent } from './register-component/register-component.component';
import { LoginComponent } from './login/login.component';
import { CommonService } from '../common.service';
import { ForgotpaswordComponent } from './forgotpasword/forgotpasword.component';

import {
  NbAutocompleteModule,
  NbCardModule,
  NbDialogModule,
  NbLayoutModule,
  NbThemeModule,
  NbToastrModule,
  NbWindowModule,
  NbTooltipModule
} from '@nebular/theme';
import { SharedModule } from '../../@custom/component/shared.module';
import { TermandconditionComponent } from './termandcondition/termandcondition.component';


@NgModule({
  declarations: [
    RegisterComponentComponent,
    LoginComponent,
    ForgotpaswordComponent,
    TermandconditionComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    NbThemeModule,
    FormsModule,
    ThemeModule,
    ReactiveFormsModule,
    NbCardModule,
    NbTooltipModule,
    NbDialogModule.forChild(),
    NbToastrModule.forRoot(),
    NbWindowModule.forChild(),
    SharedModule,
    NbLayoutModule,
    NbAutocompleteModule
  ],
  providers: [CommonService]
})
export class AuthModule { }
