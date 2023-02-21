import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JrfComponent } from './jrf/jrf.component';
import { mainViewComponent } from './mainview/mainview.component';
import { DocumnetViewComponent } from './documnet-view/documnet-view.component';
import { QuotationComponent } from './quotation/quotation.component';
import { StandardMasterComponent } from './standard-master/standard-master.component';
import { EquipmentmasterComponent } from './equipmentmaster/equipmentmaster.component';
import { SlotallocationComponent } from './slotallocation/slotallocation.component';
import {  VisitorpassComponent} from './visitorpass/visitorpass.component';
import {  EngineerallocationComponent} from './engineerallocation/engineerallocation.component';
import { TariffMasterComponent } from './tariff-master/tariff-master.component';
import { APIService } from '../api.service';
import { MyTaskComponent } from './my-task/my-task.component';
import { WorksheetComponent } from './worksheet/worksheet.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { AuthGuard } from '../auth.guard';

//export
const routes: Routes = [{
  path:'',
  component:MyTaskComponent 
},
{
  path:"jrf",
  component:mainViewComponent,
  children: [
    {
      path: '',
      redirectTo: 'njrf',
      pathMatch: 'full',
    },
    {
      path: 'njrf',
      component: JrfComponent,
    },
    {
      path: 'jdoc',
      component: DocumnetViewComponent,
    },{
      path: 'jvis',
      component: VisitorpassComponent,
    }
  ]
},
{
  path:"StandardMst",
  canActivateChild:[AuthGuard],
  component:StandardMasterComponent
},
{
  path:"Equipment",
  canActivateChild:[AuthGuard],
  component:EquipmentmasterComponent
},
{
  path:"TariffMst",
  canActivateChild:[AuthGuard],
  component:TariffMasterComponent
},
{
  path:"quotation",
  component:QuotationComponent
},
{
  path:"slot",
  component:SlotallocationComponent
},
{
  path:"visitorPass",
  component:VisitorpassComponent
},
{
  path:"engineerAllocate",
  component:EngineerallocationComponent
},
{
  path:"mytask",
  component:MyTaskComponent
},
{
  path:"worksheet",
  component:WorksheetComponent
},
{
  path:"generateReport",
  component:GenerateReportComponent
},
{
  path:"documnetUpload",
  component:DocumentUploadComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],providers:[APIService]
})
export class BusinessRoutingModule { }
