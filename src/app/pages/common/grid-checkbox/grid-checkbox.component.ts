import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'ngx-grid-checkbox',
  templateUrl: './grid-checkbox.component.html',
  styleUrls: ['./grid-checkbox.component.scss']
})
export class GridCheckboxComponent implements OnInit, ICellRendererAngularComp  {

  constructor() { }
  params: any;
  data: any;
  fieldData;
  fieldName;
  
  ngOnInit(): void {
  }

  refresh(params: ICellRendererParams): boolean {
    // throw new Error('Method not implemented.');
    return false;
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    // throw new Error('Method not implemented.');
  }

  agInit(params: any) {
    this.params = params;
    if (params.colDef.cellRendererParams) {
      this.fieldName = params.colDef.cellRendererParams.checkboxName
    }
    this.data = params.data;
    if (this.data) {
      this.fieldData = true;
    }
  }


  onClick($event, type) {
    if (this.params.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      if (params.rowData) {
        this.params.onClick(params, type)
      }
    }
  }
}
