import { NgModule } from '@angular/core';
import { NbActionsModule, NbButtonModule, NbTimepickerModule,NbCalendarModule,NbCardModule,NbDatepickerModule, NbIconModule, NbListModule, NbMenuModule, NbRadioModule, NbSelectModule, NbTabsetModule, NbUserModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { GridActionsComponent } from './common/grid-actions/grid-actions.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { GridDropdownComponent } from './common/grid-dropdown/grid-dropdown.component';
import { GridDatepickerComponent } from './common/grid-datepicker/grid-datepicker.component';
import { FormsModule } from '@angular/forms';
import { GridCheckboxComponent } from './common/grid-checkbox/grid-checkbox.component';
import { CommonService } from './common.service';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NbUserModule,
    NbTabsetModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    NbDatepickerModule.forRoot(),
    NbTimepickerModule.forRoot(),
    FormsModule,
  ],
  declarations: [
    PagesComponent,
    GridActionsComponent,
    GridDropdownComponent,
    GridDatepickerComponent,
    GridCheckboxComponent
  ],
  providers:[
  CommonService  
  ]
})
export class PagesModule {
}
