import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'ngx-grid-actions',
  templateUrl: './grid-actions.component.html',
  styleUrls: ['./grid-actions.component.scss']
})
export class GridActionsComponent implements ICellRendererAngularComp {

  params: any;
  data: any;
  enableBtn: boolean = true;
  // buttonStatus: string = "warning";
  toolTip: string = "Active";
  showBtnObj = null;
  iconObj = {
    download:{cls: "ion-android-download",sts:'success'},
    view: {cls:"ion-eye",sts:'primary'}, add: {cls:"ion-android-add",sts:'default'},
    edit: {cls:"ion-edit",sts:'primary'}, delete: {cls:"ion-ios-trash",sts:'danger'},
    enable:{cls:'ion-ios-plus-outline',sts:'success'},
    disable:{cls:'ion-ios-minus-outline',sts:'warning'},
    approve:{cls:'ion-checkmark',sts:'success'},
    reject:{cls:'ion-close',sts:'danger'},
    Open:{cls:'fa fa-folder-open',sts:'default'},
    send:{cls:'fa fa-paper-plane',sts:'default'},
    default: {cls:"ion-edit",sts:'default'}
  }
  constructor() { }
  refresh(params: ICellRendererParams): boolean {
    // throw new Error('Method not implemented.');
    return false;
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  agInit(params: any) {
    this.params = params;
    this.data = params.data;
    if (this.data) {
      if (params.colDef.cellRendererParams) {
        let cellParam = params.colDef.cellRendererParams;
        if (cellParam.button && cellParam.button.indexOf('enable') > -1 && this.data.status == "Active") {
          this.enableBtn = false;
          // this.buttonStatus = "success";
          this.toolTip = "Inactive";
        }
        if (cellParam.buttonPer) {
          this.showBtnObj = cellParam.buttonPer;
        }
      }
    }
  }


  onClick($event, type) {
    if (this.params.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      if (params.rowData) {
        this.params.onClick(params, type.buttonName, type.col)
      }
    }
  }

}
