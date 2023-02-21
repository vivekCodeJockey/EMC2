import { Component, OnInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-grid-dropdown',
  templateUrl: './grid-dropdown.component.html',
  styleUrls: ['./grid-dropdown.component.scss']
})
export class GridDropdownComponent implements OnInit, ICellEditorAngularComp {

  params: any;
  dataObs: Observable<any>;
  data: any;
  selectedItem: any;
  selectedItemVal: any;
  fieldSize: any = "small"
  labelKey: any;
  valueKey: any;
  valueNode: any;
  getCellValue: any;

  constructor() { }
  getValue() {
    if (this.getCellValue && this.getCellValue instanceof Function) {
      return this.getCellValue({selectedValue:this.selectedItem,rowData:this.params.node.data});
    }
    if(this.selectedItem && this.labelKey && this.labelKey in this.selectedItem){
      return this.selectedItem[this.labelKey];
    }
    return this.selectedItem;
  }

  ngOnInit(): void {
    if (this.dataObs) {
      this.dataObs.subscribe(val => {
        // deal with asynchronous Observable result
        this.data = val;
      })
    }
  }

  agInit(params: any) {
    if(params.getSelected && params.getSelected instanceof Function){
      this.selectedItem=params.getSelected(params.node.data);
    }else{
      this.selectedItem=params.node.data[params.colDef.field];
    }
   
    this.params = params;
    this.dataObs = params.optionObs;
    this.data = params.options;
    if(params.loadInitData && params.loadInitData instanceof Function){
      this.data = params.loadInitData(params.node.data);
    }
    this.labelKey = params.labelKey;
    this.valueKey = params.valueKey;
    this.getCellValue = params.cellValue;
    this.valueNode = params.valueNode;
  }


  onChange($event) {
    if(this.valueKey && this.valueNode){
      this.params.node.data[this.valueNode]=$event[this.valueKey];
    }
    if (this.params.onChange instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onChange(params)
    }
  }

}
