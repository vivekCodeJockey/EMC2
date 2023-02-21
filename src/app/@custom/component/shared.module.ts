import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { NbButtonModule, NbCardModule, NbOverlayModule } from '@nebular/theme';



@NgModule({
  declarations: [
    AlertMessageComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbButtonModule,
    NbOverlayModule
  ],
  exports:[
    AlertMessageComponent
  ]
})
export class SharedModule { }
