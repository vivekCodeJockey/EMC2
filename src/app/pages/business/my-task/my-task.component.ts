import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NbWindowService, NbWindowState } from "@nebular/theme";
import { LayoutService } from "../../../@core/utils";

import {
  ColDef,
  ICellRendererParams,
  IDatasource,
  IGetRowsParams
} from "ag-grid-community";
import * as moment from "moment";
import { nvtoastrService } from "../../../@theme/service/toastr/toastr.service";
import { CommonService } from "../../common.service";
import { GridActionsComponent } from "../../common/grid-actions/grid-actions.component";
import { EngineerallocationComponent } from "../engineerallocation/engineerallocation.component";

@Component({
  selector: "ngx-my-task",
  templateUrl: "./my-task.component.html",
  styleUrls: ["./my-task.component.scss"],
})
export class MyTaskComponent implements OnInit {
  isAdminPer = false;
  isQuoPer = false;
  isSlotPer = false;
  isWorkPer = false;
  isEngPer = false;
  loading = false;
  fieldSize: any = "small";
  grid: any;
  testGridShow = false;
  jobGridShow = false;
  userRolePer;
  jobsearchText: string;
  testsearchText: string;
  currentTab: string = '';

  constructor(
    private taskService: CommonService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastrService: nvtoastrService,
    private windowService: NbWindowService,
    private layoutService: LayoutService,
  ) {
    this.userRolePer = JSON.parse(localStorage.getItem("permission"));
    if (this.userRolePer == "100") {
      this.jobGridShow = true;
      if (!taskService.isAppInternal()) {
        this.isAdminPer = false;
        this.testGridShow = false;
      } else {
        this.isAdminPer = true;
        this.testGridShow = true;
      }
    } else {
      let qpage = this.userRolePer.find((obj) => obj.pageId === 2);
      let spage = this.userRolePer.find((obj) => obj.pageId === 7);
      let epage = this.userRolePer.find((obj) => obj.pageId === 9);
      let wpage = this.userRolePer.find((obj) => obj.pageId === 11);
      let jpage = this.userRolePer.find((obj) => obj.pageId === 10);
      let upage = this.userRolePer.find((obj) => obj.pageId === 12);
      let rpage = this.userRolePer.find((obj) => obj.pageId === 13);

      if (!taskService.isAppInternal() && jpage && jpage.isView) {
        this.jobGridShow = true;
      }
      if (upage && upage.isView) {
        this.testGridShow = true;
      }
      if (rpage && rpage.isView) {
        this.jobGridShow = true;
      }
      if (qpage && qpage.isView) {
        this.isQuoPer = true;
        this.jobGridShow = true;
      }
      if (spage && spage.isView) {
        this.isSlotPer = true;
        this.jobGridShow = true;
      }
      if (epage && epage.isView) {
        this.isEngPer = true;
        this.testGridShow = true;
      }
      if (wpage && wpage.isView) {
        this.isWorkPer = true;
        this.testGridShow = true;
      }
    }
    let defheight = 310
    // if (this.testGridShow && this.jobGridShow) {
    //   defheight = 530
    // }
    taskService.setGridDynamicRowCnt(this.gridOptions, defheight);
    taskService.setGridDynamicRowCnt(this.testGridOptions, defheight);
    layoutService.onChangeLayoutSize().subscribe((value: string) => {
      setTimeout(() => {
      if(this.grid&&(!this.grid.destroyCalled)){
        this.grid.sizeColumnsToFit();
      }
    }, 1000)
    })
  }

  columnDefs: ColDef[] = [
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      suppressMovable: true,
    },
    {
      headerName: "Req No",
      field: "jrfSeqNo",
      flex: 1,
      tooltipField: "jrfSeqNo",
      minWidth: 110,
      cellRenderer: function (params: ICellRendererParams) {
        let link = `<a href="#" style="cursor:pointer;" data-action-type="jrf-edit" onclick="return false;">${params.value || ""
          }</a>`;
        return link;
      },
      suppressMovable: true,
    },
    {
      headerName: "JRF No",
      field: "jrfRefNo",
      flex: 2,
      tooltipField: "jrfRefNo",
      minWidth: 220,
      cellRenderer: function (params: ICellRendererParams) {
        let link = `<a href="#" style="cursor:pointer;" data-action-type="jrf-edit" onclick="return false;">${params.value || ""
          }</a>`;
        return link;
      },
      suppressMovable: true,
    },
    {
      headerName: "JRF Date",
      field: "jrfDate",
      width: 90,
      minWidth: 90,
      maxWidth: 90,
      cellRenderer: (data) => {
        return data.value
          ? moment(new Date(data.value)).format("DD/MM/YYYY")
          : "";
      },
      suppressMovable: true,
    },
    {
      headerName: "JRF Status",
      field: "jrfStatus",
      width: 90,
      minWidth: 90,
      hide: true,
      maxWidth: 90,
      suppressMovable: true,
    },
    {
      headerName: "Type",
      field: "jrfType",
      valueGetter: params => {
        let tdata = params.data;
        return tdata&&tdata['jrfType']=='internal'?'Internal':'External'
      },
      width: 70,
      minWidth: 70,
      maxWidth: 70,
      suppressMovable: true,
    },{
      headerName: "Quotation Date",
      field: "quoDate",
      width: 110,
      minWidth: 110,
      hide: true,
      maxWidth: 110,
      cellRenderer: (data) => {
        return data.value
          ? moment(new Date(data.value)).format("DD/MM/YYYY")
          : "";
      },
      suppressMovable: true,
    },
    {
      headerName: "Quotation Status",
      field: "quoStatus",
      width: 120,
      minWidth: 120,
      hide: true,
      maxWidth: 120,
      suppressMovable: true,
    },
    {
      headerName: "Status",
      field: "jobStatus",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      suppressMovable: true,
    },
    {
      headerName: "Quote",
      field: "qaction",
      hide: true,
      width: 62,
      minWidth: 62,
      maxWidth: 62,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onClick: (e, type, col) => this.actions(e, type, col),
        button: ["Open"],
      },
      suppressMovable: true,
    },
    {
      headerName: "Slot",
      hide: true,
      field: "saction",
      width: 62,
      minWidth: 62,
      maxWidth: 62,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onClick: (e, type, col) => this.actions(e, type, col),
        button: ["Open"],
      },
      suppressMovable: true,
    },
    {
      headerName: "Report",
      hide: true,
      field: "tGaction",
      width: 62,
      minWidth: 62,
      maxWidth: 62,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onClick: (e, type, col) => this.actions(e, type, col),
        button: ["Open"],
      },
      suppressMovable: true,
    },
  ];
  defaultColDef = { flex: 1, theme: "ag-theme-balham" };

  gridOptions = {
    pagination: true,
    rowModelType: "infinite",
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    // cacheBlockSize: 100,
    rowSelection: "single",
    animateRows: true,
    domLayout: "autoHeight",
    infiniteInitialRowCount: 0,
  };

  testGrid: any;
  testColumnDefs: ColDef[] = [
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      suppressMovable: true,
    },
    {
      headerName: "Test No",
      field: "testSeqNo",
      tooltipField: "testSeqNo",
      flex: 1,
      // width: 200,
      minWidth: 200,
      // maxWidth: 220,
      suppressMovable: true,
    },
    {
      headerName: "JRF No",
      field: "jrfRefNumber",
      tooltipField: "jrfRefNo",
      flex: 1,
      minWidth: 220,
      cellRenderer: function (params: ICellRendererParams) {
        let link = `<a href="#" style="cursor:pointer;" data-action-type="jrf-edit" onclick="return false;">${params.value || ""
          }</a>`;
        return link;
      },
      suppressMovable: true,
    },
    {
      headerName: "Test Planned",
      field: "testPlannedDate",
      width: 120,
      minWidth: 110,
      maxWidth: 120,
      suppressMovable: true,
    }, {
      headerName: "Status",
      field: "tStatus",
      valueGetter: params => {
        let tdata = params.data;
        if (tdata) {
          if (tdata.engineerStatus==null) {
            return 'Assign engineer'
          } else if (tdata.equipmentStatus==null) {
            return 'Not started'
          } else if (tdata.equipmentStatus) {
            return tdata.timeTrackerStatus=='Completed'?'Completed':'In progress'
          }
        } 
      },
      width: 120,
      minWidth: 120,
      maxWidth: 120,
      suppressMovable: true,
    },
    {
      headerName: "Engineer",
      hide: true,
      field: "eaction",
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onClick: (e, type, col) => this.actions(e, type, col),
        button: ["Open"],
      },
      suppressMovable: true,
    },
    {
      headerName: "Equipment",
      field: "equaction",
      hide: true,
      width: 85,
      minWidth: 85,
      maxWidth: 85,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onClick: (e, type, col) => this.actions(e, type, col),
        button: ["Open"],
      },
      suppressMovable: true,
    },
    {
      headerName: "Work Sheet",
      hide: true,
      field: "tIaction",
      width: 90,
      minWidth: 90,
      maxWidth: 90,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onClick: (e, type, col) => this.actions(e, type, col),
        button: ["Open"],
      },
      suppressMovable: true,
    },
    {
      headerName: "Doc Upload",
      hide: true,
      field: "tUaction",
      width: 90,
      minWidth: 90,
      maxWidth: 90,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onClick: (e, type, col) => this.actions(e, type, col),
        button: ["Open"],
      },
      suppressMovable: true,
    },
  ];
  testDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  testGridOptions = {
    pagination: true,
    rowModelType: "infinite",
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    // cacheBlockSize: 100,
    rowSelection: "single",
    animateRows: true,
    domLayout: "autoHeight",
    infiniteInitialRowCount: 0,
  };

  ngOnInit(): void { 
    // console.log("Before delay");
    // console.log(this.grid);
    // setTimeout(() => {
    //   console.log("Delayed for 1 second.");
    //   if(!this.grid.destroyCalled){
    //     this.grid.sizeColumnsToFit();
    //   }
    // }, 10000)
  }

  onGridRowClicked(e: any) {
    if (e.event.target !== undefined) {
      let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "jrf-edit": {
          this.router.navigate(["/pages/business/jrf"], {
            skipLocationChange: true,
            state: {
              jrfId: e.data.jrfId,
              jrfDtl: e.data,
              permission: this.userRolePer,
            },
          });
          break;
        }
      }
    }
  }

  actions(e, type, col) {
    let $scope = this;
    let rowData = JSON.parse(JSON.stringify(e.rowData));
    switch (col.field) {
      //equipment
      case "equaction": {
        if (rowData.engineerStatus != null) {
          this.router.navigate(["/pages/business/worksheet"], {
            skipLocationChange: true,
            state: { jrfDtl: rowData, screen: 1, permission: this.userRolePer },
          });
        } else {
          this.toastrService.showToast(
            "danger",
            "Add Equipment Not Allowed",
            "Engineer not allocated for " + rowData.testSeqNo + "",
            "TOP_RIGHT"
          );
        }
        break;
      }
      //worksheetInfo
      case "tIaction": {
        if (rowData.equipmentStatus != null) {
          this.router.navigate(["/pages/business/worksheet"], {
            skipLocationChange: true,
            state: { jrfDtl: rowData, screen: 2, permission: this.userRolePer },
          });
        } else {
          this.toastrService.showToast(
            "danger",
            "Worksheet Not Allowed",
            "Equipment not yet add for " + rowData.testSeqNo + "",
            "TOP_RIGHT"
          );
        }
        break;
      }
      //test document upload
      case "tUaction": {
        this.router.navigate(["/pages/business/documnetUpload"], {
          skipLocationChange: true,
          state: { jrfDtl: rowData, permission: this.userRolePer },
        });
        break;
      }
      //report generation
      case "tGaction":
        this.router.navigate(["/pages/business/generateReport"], {
          skipLocationChange: true,
          state: { jrfDtl: rowData, permission: this.userRolePer },
        });
        break;
      //quotation
      case "qaction": {
        if (rowData.jrfType && rowData.jrfType == 'internal') {
          this.toastrService.showToast(
            "danger",
            "Quotation Edit Not Allowed",
            "JRF Sequence No:" + rowData.jrfSeqNo + " is internal JRF",
            "TOP_RIGHT"
          );
        } else if (rowData.jrfStatus === "COMPLETED") {
          this.router.navigate(["/pages/business/quotation"], {
            skipLocationChange: true,
            state: { jrfId: rowData.jrfId, permission: this.userRolePer },
          });
        } else {
          this.toastrService.showToast(
            "danger",
            "Quotation Edit Not Allowed",
            "JRF Sequence No:" + rowData.jrfSeqNo + " is not yet completed",
            "TOP_RIGHT"
          );
        }
        break;
      }
      //slot
      case "saction": {
        if ((rowData.poStatus === "PO Uploaded") || (rowData.jrfType && rowData.jrfType == 'internal')) {
          this.router.navigate(["/pages/business/slot"], {
            skipLocationChange: true,
            state: { jrfId: rowData.jrfId, permission: this.userRolePer },
          });
        } else {
          this.toastrService.showToast(
            "danger",
            "Slot allocation Not Allowed",
            "JRF Sequence No:" + rowData.jrfSeqNo + " PO not yet recevied ",
            "TOP_RIGHT"
          );
        }
        break;
      }
      //engineer allocation
      case "eaction": {
        let olddata = JSON.parse(JSON.stringify(rowData.engineerStatus));
        this.windowService
          .open(EngineerallocationComponent, {
            title: "Engineer Allocation",
            hasBackdrop: true,
            context: rowData,
            closeOnEsc: false,
            closeOnBackdropClick: false,
            initialState: NbWindowState.FULL_SCREEN,
            buttons: {
              minimize: false,
              maximize: false,
              fullScreen: false,
            },
          })
          .onClose.subscribe(function (param) {
            if (olddata !== rowData.engineerStatus) {
              $scope.testGrid.purgeInfiniteCache();
            }
          });
        break;
      }
    }
  }

  onGridReady(e) {
    this.grid = e.api;
    this.getJobStatus();
    this.grid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "jrfType",
      this.taskService.isAppInternal()
    );
    this.grid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "qaction",
      this.isAdminPer || this.isQuoPer
    );
    this.grid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "saction",
      this.isAdminPer || this.isSlotPer
    );
    this.grid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "tGaction",
      this.isAdminPer || this.isWorkPer
    );
  }

  getActiveTab(activeTab: any) {
    switch (activeTab.tabTitle) {
      case "In-Progress": { this.testGrid.payload = { 'testCompleted': 'inprogress' }; this.testGrid.purgeInfiniteCache(); this.testGrid.sizeColumnsToFit();break; }
      case "Completed": { this.testGrid.payload = { 'testCompleted': 'completed' }; this.testGrid.purgeInfiniteCache();this.testGrid.sizeColumnsToFit(); break; }
    }
  }

  onTestGridReady(e) {
    this.testGrid = e.api;
    this.testGrid.payload = { 'testCompleted': 'inprogress' }
    this.getTestStatus();
    this.testGrid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "equaction",
      this.isAdminPer || this.isWorkPer
    );
    this.testGrid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "tIaction",
      this.isAdminPer || this.isWorkPer
    );
    this.testGrid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "tSaction",
      this.isAdminPer || this.isWorkPer
    );
    this.testGrid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "tUaction",
      this.isAdminPer || this.isWorkPer
    );
    this.testGrid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "eaction",
      this.isAdminPer || this.isEngPer
    );
  }

  getJobStatus() {
    if (this.grid) {
      let datSource = this.taskService.gridPaginationGetRows(this.grid, this.cdr, "/jobStatus", null, this.loading)
      this.grid.setDatasource(datSource);
    }
  }

  getTestStatus() {
    if (this.testGrid) {
      let datSource = this.taskService.gridPaginationGetRows(this.testGrid, this.cdr, "/testTracker", null, this.loading)
      this.testGrid.setDatasource(datSource);
    }
  }

  reloadTracker() {
    if (this.jobGridShow) {
      this.grid.purgeInfiniteCache();
    }
    if (this.testGridShow) {
      this.testGrid.purgeInfiniteCache();
    }
  }

  searchtest() {
    this.testGrid["searchText"] = this.testsearchText;
    this.testGrid.purgeInfiniteCache();
  }

  updateSearchTestText() {
    if (this.testsearchText == '') {
      this.searchtest()
    }
  }
  searchJob() {
    this.grid["searchText"] = this.jobsearchText;
    this.grid.purgeInfiniteCache();
  }

  updateSearchJobText() {
    if (this.jobsearchText == '') {
      this.searchJob()
    }
  }
}
