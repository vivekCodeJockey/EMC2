import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafePipeModule } from 'safe-pipe';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,NbBadgeModule,NbFormFieldModule,
  NbSelectModule, NbStepperModule, NbAccordionModule, NbDialogModule,
  NbUserModule, NbTabsetModule, NbRouteTabsetModule, NbWindowModule, NbToastrModule, NbSpinnerModule, NbTreeGridModule
} from '@nebular/theme';
import { BusinessRoutingModule } from './business-routing.module';
import { StandardMasterComponent } from './standard-master/standard-master.component';
import { TariffMasterComponent } from './tariff-master/tariff-master.component';
import { QuotationComponent } from './quotation/quotation.component';
import { JrfComponent } from './jrf/jrf.component';
import { mainViewComponent } from './mainview/mainview.component';
import { CommonService } from '../common.service';
import { DocumnetViewComponent } from './documnet-view/documnet-view.component';
import { FsIconComponent } from './documnet-view/documnet-view.component';
import { SharedModule } from '../../@custom/component/shared.module';
import { QuotationPrintComponent } from './quotation/quotation-print/quotation-print.component';
import { MyTaskComponent } from './my-task/my-task.component';
import { SlotallocationComponent } from './slotallocation/slotallocation.component';
import { VisitorpassComponent } from './visitorpass/visitorpass.component';
import { EquipmentmasterComponent } from './equipmentmaster/equipmentmaster.component';
import { EngineerallocationComponent } from './engineerallocation/engineerallocation.component';
import { WorksheetComponent } from './worksheet/worksheet.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { WebcamModule } from 'ngx-webcam';


@NgModule({
  declarations: [
    QuotationComponent,
    JrfComponent,
    StandardMasterComponent,
    TariffMasterComponent,
    mainViewComponent,
    DocumnetViewComponent,
    QuotationPrintComponent,
    MyTaskComponent,
    SlotallocationComponent,
    VisitorpassComponent,
    EquipmentmasterComponent,
    EngineerallocationComponent,
    FsIconComponent,
    WorksheetComponent,
    DocumentUploadComponent,
    GenerateReportComponent
  ],
  imports: [
    NbActionsModule,
    WebcamModule,
    NbButtonModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbCheckboxModule,
    ThemeModule,
    NbDatepickerModule,
    NbIconModule,
    NbRouteTabsetModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbUserModule,
    NbTabsetModule,
    NbStepperModule,
    NbAccordionModule,
    CommonModule,
    BusinessRoutingModule, 
    NbTreeGridModule,
    NbBadgeModule,
    AgGridModule,
    NbDialogModule.forChild(),
    NbWindowModule.forChild(),
    NbToastrModule.forRoot(),
    SharedModule,
    SafePipeModule,
    NbSpinnerModule,
    NbFormFieldModule
  ],
  providers: [CommonService]
})
export class BusinessModule { }
