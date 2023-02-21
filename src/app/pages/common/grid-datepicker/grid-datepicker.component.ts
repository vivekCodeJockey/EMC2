import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { IDateParams } from "ag-grid-community";
import * as moment from 'moment';

@Component({
  selector: 'ngx-grid-datepicker',
  templateUrl: './grid-datepicker.component.html',
  styleUrls: ['./grid-datepicker.component.scss'],
  providers: [DatePipe]
})
export class GridDatepickerComponent implements OnInit {

  fieldSize = "small"
  fieldType: any;
  fieldData: any;
  min: Date;
  max: Date;
  params: IDateParams;

  constructor(protected dateService: NbDateService<Date>, private datePipe: DatePipe) {
    this.min = this.dateService.addDay(this.dateService.today(), -5);
    this.max = this.dateService.addDay(this.dateService.today(), 5);
  }

  ngOnInit(): void { }

  agInit(params: any): void {
    this.params = params;
    if (params.colDef.cellRendererParams) {
      this.fieldType = params.colDef.cellRendererParams.field
    }
    if (params.data) {
      let dateValue = params.data[params.colDef.field];
      // if (dateValue) {
      //   // if (params.colDef.cellRendererParams.format) {
      //   //   this.fieldData =  moment(new Date(dateValue)).format("DD/MM/YYYY")
      //   // } else {
      //     this.fieldData = new Date(dateValue)
      //   // }
      // } else {
      //   this.fieldData = ''
      // }
      this.fieldData = dateValue ? new Date(dateValue) : '';
    }
  }

  ngOnDestroy() { }

  onDateChanged(newValue: string) {
    this.fieldData = newValue;
    this.params.api.stopEditing();
  }

  getValue(): any {
    return this.fieldData
  }
}