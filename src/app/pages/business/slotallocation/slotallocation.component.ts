import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IDatasource, IGetRowsParams } from 'ag-grid-community';
import { CommonService } from '../../common.service';
import { GridActionsComponent } from '../../common/grid-actions/grid-actions.component';
import { GridDatepickerComponent } from '../../common/grid-datepicker/grid-datepicker.component';
import { nvtoastrService } from '../../../@theme/service/toastr/toastr.service';
import * as moment from 'moment';

@Component({
  selector: 'ngx-slotallocation',
  templateUrl: './slotallocation.component.html',
  styleUrls: ['./slotallocation.component.scss'],
  providers: [DatePipe]
})
export class SlotallocationComponent implements OnInit {

  fieldSize: any = "small";
  loading=false;
  slotAllocationList: any[] = [];
  slotAllocationGrid: any;
  slotAllocationButtonName: string = 'Save';
  slotAllocationGridEditor: boolean = false;
  slotAllocationButtonDisabled: boolean = false;
  slotAllocationForm: UntypedFormGroup;
  jrfRefNumber: any;
  jrfDate: any;
  jrfId: any;
  btnPermission;

  slotColumnDefs = [{ headerName: 'JRFId', field: 'jrfId', hide: true }, { headerName: 'Status', field: 'status', hide: true },
  { headerName: "SL No", suppressMovable: true, valueGetter: "node.rowIndex + 1", width: 60, minWidth: 60, maxWidth: 60 },
  {
    headerName: "Lab Type", suppressMovable: true, field: 'labType', editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit) && (params.data != undefined), cellEditor: 'agSelectCellEditor',
    cellEditorParams: { values: ["Chamber", "Non-Chamber"] }
  },
  {
    headerName: "From Date Time", suppressMovable: true, field: 'fromDateTime', editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit) && (params.data != undefined),
    cellRenderer: (data) => { return this.datePipe.transform(data.value, 'dd-MM-yyyy H:mm') },
    cellEditor: GridDatepickerComponent,
    cellRendererParams: { field: "dateTime", format: "dd-MM-yyyy H:mm" }
  },
  {
    headerName: "To Date Time", suppressMovable: true, field: 'toDateTime', editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit) && (params.data != undefined),
    cellRenderer: (data) => { return this.datePipe.transform(data.value, 'dd-MM-yyyy H:mm') },
    cellEditor: GridDatepickerComponent,
    cellRendererParams: { field: "dateTime", format: "dd-MM-yyyy H:mm" }
  },
  {
    headerName: 'Actions', suppressMovable: true, field: 'sdelete', cellRenderer: GridActionsComponent,
    hide: true,
    cellRendererParams: {
      onClick: (e, type) => e.rowData && this.actions(e, type), button: ['delete'],
    },
    pinned: 'right', cellClass: 'ag-pinned-right-cols-container', width: 70, minWidth: 70, maxWidth: 70
  }]
  slotDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  constructor(private datePipe: DatePipe, private slotAllocationService: CommonService, private cdr: ChangeDetectorRef, private fb: UntypedFormBuilder, private router: Router, private toastrService: nvtoastrService) {
    if (this.router.getCurrentNavigation().extras.state && this.router.getCurrentNavigation().extras.state.jrfId) {
      this.jrfId = this.router.getCurrentNavigation().extras.state.jrfId;
    }
    slotAllocationService.setGridDynamicRowCnt(this.gridOptions, 500);
  }

  ngOnInit(): void {
    this.btnPermission = this.slotAllocationService.getPermission(7)
    this.getJRFDetails();
    this.slotAllocationForm = this.fb.group({
      eutName: [''],
      weight: [''],
      quantity: [''],
      length: [''],
      width: [''],
      height: ['']
    })
  }

  //Grid Options
  gridOptions = {
    pagination: true,
    rowModelType: 'infinite',
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    singleClickEdit: true,
    // cacheBlockSize: 100,
    rowSelection: 'single',
    animateRows: true,
    domLayout: 'autoHeight',
  };

  //Grid Action
  actions(e, type) {
    e.rowData['status'] = "Update";
    let rowData = JSON.parse(JSON.stringify(e.rowData));
    if (type == "edit") {
      this.slotAllocationGridEditor = true;
      this.slotAllocationButtonName = 'Update';
    } else {
      this.deleteSlotAllocation(rowData);
    }
  }

  //Grid Initialization
  onSlotAllocationGridReady(e) {
    this.slotAllocationGrid = e.api;
    this.slotAllocationGrid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "sdelete",
      this.btnPermission?.isDelete || this.btnPermission?.isCreate || this.btnPermission?.isEdit
    );
    this.getSlotAllocation();
  }

  getJRFDetails() {
    let params = { jrfId: this.jrfId };
    let url = "/operation/slotAllocation/getJRFDetails";
    this.slotAllocationService.getAPI(url, params).subscribe((res: any) => {
      if (res.code == 200) {
        let data = res.data;
        this.jrfRefNumber = data.jrfRefNo;
        this.jrfDate = data.jrfDate ? moment(new Date(data.jrfDate)).format("DD/MM/YYYY HH:mm") : "";
        this.slotAllocationForm.controls['eutName'].setValue(data.eutName);
        this.slotAllocationForm.controls['weight'].setValue(data.weight);
        this.slotAllocationForm.controls['quantity'].setValue(data.eutQty);
        this.slotAllocationForm.controls['length'].setValue(data.length);
        this.slotAllocationForm.controls['width'].setValue(data.width);
        this.slotAllocationForm.controls['height'].setValue(data.height);
      } else {
        this.slotAllocationService.openDialog("Error", res.message, [], "danger");
      }
    }, (err) => {
      console.log(err);
    });
  }

  saveSlotAllocation() {
    let errorMessageList = [];
    // let errorMessageList = this.fieldValidation();
    if (errorMessageList.length == 0) {
      this.loading=true;
      this.slotAllocationButtonDisabled = true;
      this.slotAllocationGrid.stopEditing();
      if (this.slotAllocationGridEditor) {
        this.updateSlotAllocation();
      } else {
        let params = [];
        let url = "/operation/slotAllocation/addSlotAllocation";
        this.slotAllocationGrid.forEachNode(function (node) {
          if(node.data){
            params.push(JSON.parse(JSON.stringify(node.data)));
          }
        });
        if (params.length > 0) {
          this.slotAllocationService.postAPI(url, params).subscribe((res: any) => {
            if (res.code == 200) {
              this.cancelSlotAllocation();
              this.getSlotAllocation();
              this.slotAllocationService.openDialog("Success", res.message, [], "success");
              // this.toastrService.showToast("success", "Slot Allocation", res.message, "BOTTOM_RIGHT");
            } else {
              this.slotAllocationButtonDisabled = false;
              this.slotAllocationService.openDialog("Error", res.message, [], "danger");
            }
            this.loading=false;
          }, (err) => {
            this.loading=false;
            console.log(err);
          });
        } else {
          this.slotAllocationButtonDisabled = false;
          this.loading=false;
          this.slotAllocationService.openDialog("Warning", 'Please add atleast one record', [], "warning");
        }
      }
    } else {
      this.slotAllocationService.openDialog("Warning", '', errorMessageList, "warning");
    }
  }

  updateSlotAllocation() {
    let url = "/operation/slotAllocation/updateSlotAllocation";
    let params = []
    this.slotAllocationGrid.forEachNode(function (node) {
      if (node.data.status == "Update") {
        let data = node.data;
        data['status'] = "Active";
        params.push(data);
      }
    });
    if (params.length > 0) {
      this.slotAllocationService.putAPI(url, params).subscribe((res: any) => {
        if (res.code == 200) {
          this.cancelSlotAllocation();
          this.getSlotAllocation();
          this.slotAllocationService.openDialog("Success", res.message, [], "success");
          // this.toastrService.showToast("success", "Slot Allocation", res.message, "BOTTOM_RIGHT");
        } else {
          this.slotAllocationButtonDisabled = false;
          this.slotAllocationService.openDialog("Error", res.message, [], "danger");
        }
      }, (err) => {
        console.log(err);
      });
    } else {
      this.slotAllocationService.openDialog("Warning", 'Please add atleast one record', [], "warning");
    }
  }

  deleteSlotAllocation(rowData: any) {
    if (rowData.id) {
      this.loading=true;
      let url = "/operation/slotAllocation/deleteSlotAllocation";
      let params = { slotAllocationId: rowData.id }
      this.slotAllocationService.deleteAPI(url, params).subscribe((res: any) => {
        if (res.code == 200) {
          this.cancelSlotAllocation();
          this.getSlotAllocation();
          this.slotAllocationService.openDialog("Success", res.message, [], "success");
          // this.toastrService.showToast("success", "Slot Allocation", res.message, "BOTTOM_RIGHT");
        } else {
          this.slotAllocationService.openDialog("Error", res.message, [], "danger");
        }
        this.loading=false;
      }, (err) => {
        this.loading=false;
        console.log(err);
      });
    } else {
      this.getSlotAllocation(null, "deleteRow");
    }
  }

  gridFunctionality(type) {
    if (type == "addRow") {
      let addRowFlag = true;
      this.slotAllocationList.forEach((obj, index) => {
        if (!obj.id && obj.fromDateTime == null || obj.fromDateTime == '') {
          this.slotAllocationService.openDialog("Error", "Row should not be empty!", [], "danger");
          addRowFlag = false;
        }
      });
      if (addRowFlag) {
        const colDefs = this.slotAllocationGrid.getColumnDefs();
        const newRowObj = {};
        colDefs.forEach((eachColDef) => {
          const { field } = eachColDef;
          newRowObj[field] = null;
        });
        newRowObj['jrfId'] = this.jrfId;
        newRowObj['status'] = "Active";
        let newRow = [newRowObj];
        this.slotAllocationList = [...this.slotAllocationList, ...newRow];
      }
    } else if (type == "deleteRow") {
      this.slotAllocationList.forEach((obj, index) => {
        // if (obj.fromDateTime == null || obj.fromDateTime == '') {
          this.slotAllocationList.splice(index, 1);
        // }
      });
    }
    return this.slotAllocationList;
  }

  getSlotAllocation(searchText?, type?) {
    const dataSource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        if (type) {
          this.slotAllocationGrid.hideOverlay();
          let updateRowData = this.gridFunctionality(type);
          params.successCallback(updateRowData, updateRowData.length > 0 ? updateRowData.length : 100)
        } else {
          this.slotAllocationGrid.showLoadingOverlay();
          const limit = this.gridOptions['cacheBlockSize'];
          const offset = this.slotAllocationGrid.paginationGetCurrentPage();
          const payload: any = {}
          if (searchText) {
            payload["searchText"] = searchText;
          }
          const url = "/operation/slotAllocation/getSlotAllocation?jrfId=" + this.jrfId + "&pageSize=" + limit + "&pageNum=" + offset;
          this.slotAllocationService.getAPI(url, payload).subscribe((res: any) => {
            this.slotAllocationGrid.hideOverlay();
            if (res.data && res.data.length > 0) {
              this.slotAllocationList = res.data;
              params.successCallback(
                (res.data) ? res.data : [],
                (res.total) ? res.total : 100
              )
            } else {
              this.slotAllocationGrid.showNoRowsOverlay();
            }
            this.cdr.markForCheck();
          }, (err: any) => {
            this.cdr.markForCheck();
          })
        }
      }
    }
    if (this.slotAllocationGrid) {
      this.slotAllocationGrid.setDatasource(dataSource);
    }
  }

  cancelSlotAllocation() {
    this.slotAllocationButtonDisabled = false;
    this.slotAllocationButtonName = 'Save';
    this.slotAllocationGridEditor = false;
  }
}