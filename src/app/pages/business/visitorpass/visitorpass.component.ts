import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ColDef, IDatasource, IGetRowsParams } from "ag-grid-community";
import { CommonService } from "../../common.service";
import { GridActionsComponent } from "../../common/grid-actions/grid-actions.component";
import { mainViewComponent } from "../mainview/mainview.component";
import { nvtoastrService } from "../../../@theme/service/toastr/toastr.service";

@Component({
  selector: "ngx-visitorpass",
  templateUrl: "./visitorpass.component.html",
  styleUrls: ["./visitorpass.component.scss"],
})
export class VisitorpassComponent implements OnInit {
  fieldSize: any = "small";
  visitorPassList: any = [];
  visitorPassGrid: any;
  visitorPassButtonName: string = "Save";
  visitorPassGridEditor: boolean = false;
  visitorPassButtonDisabled: boolean = false;
  jrfId: any;
  btnPermission;

  //Equipment Master Table Definition
  passColumnDefs: ColDef[] = [
    { headerName: "JRFId", field: "jrfId", hide: true },
    { headerName: "Status", field: "status", hide: true },
    {
      headerName: "SL No",
      field: "serialNo",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60,suppressMovable: true,
    },
    {
      headerName: "Name",
      field: "visitorName",
      editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit)&&(params.data!=undefined),
      width: 150,
      minWidth: 100,
      maxWidth: 180,suppressMovable: true,
    },
    {
      headerName: "Mobile:Make",
      field: "mobileMake",
      editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit)&&(params.data!=undefined),
      width: 150,
      minWidth: 100,
      maxWidth: 180,suppressMovable: true,
    },
    {
      headerName: "Mobile:Model No",
      field: "mobileModelNo",
      editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit)&&(params.data!=undefined),
      width: 200,
      minWidth: 100,suppressMovable: true,
    },
    {
      headerName: "Laptop:Make",
      field: "laptopMake",
      editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit)&&(params.data!=undefined),
      width: 200,
      minWidth: 100,suppressMovable: true,
    },
    {
      headerName: "Laptop:Sl.No",
      field: "laptopModelNo",
      editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit)&&(params.data!=undefined),
      width: 200,
      minWidth: 100,suppressMovable: true,
    },
    {
      headerName: "Data:Make",
      field: "dataMake",
      editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit)&&(params.data!=undefined),
      width: 120,
      minWidth: 60,
      maxWidth: 150,suppressMovable: true,
    },
    {
      headerName: "USB:Make",
      field: "usbMake",
      editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit)&&(params.data!=undefined),
      width: 120,
      minWidth: 60,
      maxWidth: 150,suppressMovable: true,
    },
    {
      headerName: "Actions",
      cellRenderer: GridActionsComponent,suppressMovable: true,
      hide: true,field:'vdelete',
      cellRendererParams: {
        onClick: (e, type) => e.rowData && this.actions(e, type),
        button: ["delete"],
      },
      pinned: "right",
      cellClass: "ag-pinned-right-cols-container",
      width: 65,
      minWidth: 65,
      maxWidth: 65,
    },
  ];
  passDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  constructor(
    private parent: mainViewComponent,
    private visitorPassService: CommonService,
    private cdr: ChangeDetectorRef,
    private toastrService: nvtoastrService
  ) {
    if (parent && parent.jrfHiddenId != 0) {
      this.jrfId = this.parent.jrfHiddenId;
    }
    visitorPassService.setGridDynamicRowCnt(this.gridOptions, 500);
    this.btnPermission = this.visitorPassService.getPermission(8)
  }

  ngOnInit(): void {}

  //Grid Options
  gridOptions = {
    pagination: true,
    rowModelType: "infinite",
    // cacheBlockSize: 10,
    paginationPageSize: 10,
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    singleClickEdit: true,
    domLayout: "autoHeight",
    rowSelection: "single",
    animateRows: true,
  };

  //Grid Action
  actions(e, type) {
    e.rowData["status"] = "Update";
    let rowData = JSON.parse(JSON.stringify(e.rowData));
    if (type == "edit") {
      this.visitorPassGridEditor = true;
      this.visitorPassButtonName = "Update";
    } else {
      this.deleteVisitorPass(rowData);
    }
  }

  //Grid Initialization
  onVisitorPassGridReady(e) {
    this.visitorPassGrid = e.api;
    this.visitorPassGrid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "vdelete",
      this.btnPermission?.isDelete||this.btnPermission?.isCreate||this.btnPermission?.isEdit
    );
    this.getVisitorPass();
  }

  saveVisitorPass() {
    let errorMessageList = [];
    // let errorMessageList = this.fieldValidation();
    if (errorMessageList.length == 0) {
      this.visitorPassButtonDisabled = true;
      this.visitorPassGrid.stopEditing();
      if (this.visitorPassGridEditor) {
        this.updateVisitorPass();
      } else {
        let params = [];
        let url = "/bussiness/visitorPass/addVisitorPass";
        this.visitorPassGrid.forEachNode(function (node) {
          params.push(node.data);
        });
        this.visitorPassService.postAPI(url, params).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.cancelVisitorPass();
              this.getVisitorPass();
              this.toastrService.showToast(
                "success",
                "Vistor Pass",
                res.message,
                "BOTTOM_RIGHT"
              );
            } else {
              this.visitorPassButtonDisabled = false;
              this.visitorPassService.openDialog(
                "Error",
                res.message,
                [],
                "danger"
              );
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    } else {
      this.visitorPassService.openDialog(
        "Warning",
        "",
        errorMessageList,
        "warning"
      );
    }
  }

  updateVisitorPass() {
    let url = "/bussiness/visitorPass/updateVisitorPass";
    let params = [];
    this.visitorPassGrid.forEachNode(function (node) {
      if (node.data.status == "Update") {
        node.data["status"] = "Active";
        params.push(node.data);
      }
    });
    this.visitorPassService.putAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cancelVisitorPass();
          this.getVisitorPass();
          this.toastrService.showToast(
            "success",
            "Vistor Pass",
            res.message,
            "BOTTOM_RIGHT"
          );
          this.visitorPassService.openDialog(
            "Success",
            res.message,
            [],
            "success"
          );
        } else {
          this.visitorPassButtonDisabled = false;
          this.visitorPassService.openDialog(
            "Error",
            res.message,
            [],
            "danger"
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteVisitorPass(rowData: any) {
    if (rowData.id) {
      let url = "/bussiness/visitorPass/deleteVisitorPass";
      let params = { visitorPassId: rowData.id };
      this.visitorPassService.deleteAPI(url, params).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.cancelVisitorPass();
            this.getVisitorPass();
            this.toastrService.showToast(
              "success",
              "Vistor Pass",
              res.message,
              "BOTTOM_RIGHT"
            );
            this.visitorPassService.openDialog(
              "Success",
              res.message,
              [],
              "success"
            );
          } else {
            this.visitorPassService.openDialog(
              "Error",
              res.message,
              [],
              "danger"
            );
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.getVisitorPass(null, "deleteRow");
    }
  }

  gridFunctionality(type) {
    if (type == "addRow") {
      let addRowFlag = true;
      this.visitorPassList.forEach((obj, index) => {
        if ((!obj.id && obj.visitorName == null) || obj.visitorName == "") {
          this.visitorPassService.openDialog(
            "Error",
            "Row should not be empty!",
            [],
            "danger"
          );
          addRowFlag = false;
        }
      });
      if (addRowFlag) {
        const colDefs = this.visitorPassGrid.getColumnDefs();
        const newRowObj = {};
        colDefs.forEach((eachColDef) => {
          const { field } = eachColDef;
          newRowObj[field] = null;
        });
        newRowObj["jrfId"] = this.jrfId;
        newRowObj["status"] = "Active";
        let newRow = [newRowObj];
        this.visitorPassList = [...this.visitorPassList, ...newRow];
      }
    } else if (type == "deleteRow") {
      this.visitorPassList.forEach((obj, index) => {
        if (obj.visitorName == null || obj.visitorName == "") {
          this.visitorPassList.splice(index, 1);
        }
      });
    }
    return this.visitorPassList;
  }

  getVisitorPass(searchText?, type?) {
    const dataSource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        if (type) {
          this.visitorPassGrid.hideOverlay();
          let updateRowData = this.gridFunctionality(type);
          params.successCallback(
            updateRowData,
            updateRowData.length > 0 ? updateRowData.length : 100
          );
        } else {
          this.visitorPassGrid.showLoadingOverlay();
          const limit = this.gridOptions['cacheBlockSize'];
          const offset = this.visitorPassGrid.paginationGetCurrentPage();
          const payload: any = {};
          if (searchText) {
            payload["searchText"] = searchText;
          }
          const url =
            "/bussiness/visitorPass/getVisitorPass?jrfId=" +
            this.jrfId +
            "&pageSize=" +
            limit +
            "&pageNum=" +
            offset;
          this.visitorPassService.getAPI(url, payload).subscribe(
            (res: any) => {
              this.visitorPassGrid.hideOverlay();
              if (res.data && res.data.length > 0) {
                this.visitorPassList = res.data;
                params.successCallback(
                  res.data ? res.data : [],
                  res.total ? res.total : 100
                );
              } else {
                this.visitorPassGrid.showNoRowsOverlay();
              }
              this.cdr.markForCheck();
            },
            (err: any) => {
              this.cdr.markForCheck();
            }
          );
        }
      },
    };
    if (this.visitorPassGrid) {
      this.visitorPassGrid.setDatasource(dataSource);
    }
  }

  cancelVisitorPass() {
    this.visitorPassButtonDisabled = false;
    this.visitorPassButtonName = "Save";
    this.visitorPassGridEditor = false;
  }
}
