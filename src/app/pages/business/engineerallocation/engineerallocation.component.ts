import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NbDateService, NbWindowRef } from "@nebular/theme";
import { ColDef } from "ag-grid-community";
import { BehaviorSubject } from "rxjs";
import { CommonService } from "../../common.service";
import { GridActionsComponent } from "../../common/grid-actions/grid-actions.component";
import { GridDatepickerComponent } from "../../common/grid-datepicker/grid-datepicker.component";
import { GridDropdownComponent } from "../../common/grid-dropdown/grid-dropdown.component";

@Component({
  selector: "ngx-engineerallocation",
  templateUrl: "./engineerallocation.component.html",
  styleUrls: ["./engineerallocation.component.scss"],
  providers: [DatePipe],
})
export class EngineerallocationComponent implements OnInit {
  fieldSize: any = "small";
  engineerAllocationList: any[] = [];
  engineerAllocationDeleteList: any[] = [];
  engineerAllocationGrid: any;
  engineerAllocationButtonDisabled: boolean = false;
  engineerAllocationForm: UntypedFormGroup;
  jrfRefNumber: any;
  jrfDate: any;
  testTrackerId: any;
  jrfId: any;
  min: Date;
  max: Date;
  engineerNameList: any[] = [];
  btnPermission;
  engineerObservable = new BehaviorSubject<any>(null);
  testerColumnDefs: ColDef[];
  
  testerDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  constructor(
    private datePipe: DatePipe,
    protected dateService: NbDateService<Date>,
    private engineerAllocationService: CommonService,
    private cdr: ChangeDetectorRef,
    private fb: UntypedFormBuilder,
    private router: Router,
    public windowRef: NbWindowRef
  ) {
    this.min = this.dateService.addDay(this.dateService.today(), -5);
    this.max = this.dateService.addDay(this.dateService.today(), 5);
    if (windowRef && windowRef.config.context["jrfId"]) {
      console.log(windowRef.config.context);
      this.jrfId = windowRef.config.context["jrfId"];
      this.jrfRefNumber = windowRef.config.context["jrfRefNumber"];
      this.jrfDate = windowRef.config.context["jrfDate"];
    }
    this.btnPermission = this.engineerAllocationService.getPermission(9)
  }

  ngOnInit(): void {
    let $scope = this;
    this.testerColumnDefs = [
      { field: "status", hide: true },
      { field: 'engineerId', hide: true },
      { field: "rowId", valueGetter: "node.rowIndex + 1", hide: true },
      {
        headerName: "SL No",
        valueGetter: "node.rowIndex + 1",
        width: 60,
        minWidth: 60,
        maxWidth: 60,
      },
      {
        headerName: "Engineer Name",
        field: "engineerName",
        valueGetter: function (param) {
          return $scope.getSelectedEngineerName(param.data);
        },
        editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit),
        cellEditor: GridDropdownComponent,
        cellEditorParams: {
          options: [],
          optionObs: $scope.engineerObservable,
          labelKey: 'engineerName',
          valueKey: 'engineerId',
          valueNode: 'engineerId',
          loadInitData: function (row) {
            return $scope.engineerNameList;
          },
          getSelected: function (param) {
            return $scope.getEngineerComboSelected(param);
          }
        }
      },
      {
        headerName: "From Date",
        field: "fromDate",
        editable: (params) => (this.btnPermission?.isCreate || this.btnPermission?.isEdit),
        width: 150,
        minWidth: 100,
        maxWidth: 250,
        cellRenderer: (data) => {
          return this.datePipe.transform(data.value, "dd-MM-yyyy");
        },
        cellEditor: GridDatepickerComponent,
        cellRendererParams: { field: "date", format: "dd-MM-yyyy" },
      },
      {
        headerName: "Actions",
        cellRenderer: GridActionsComponent,
        hide: true, field: 'eadelete',
        cellRendererParams: {
          onClick: (e, type) => e.rowData && this.actions(e, type),
          button: ["delete"],
        },
        width: 70,
        minWidth: 70,
        maxWidth: 70,
      },
    ]
  }

  gridOptions = {
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    singleClickEdit: true,
    rowSelection: "single",
    animateRows: true,
    domLayout: "autoHeight",
  };

  getEngineerNameList() {
    return new Promise((resolve, reject) => {
      const url = "/testTracker/getEngineerNameList";
      this.engineerAllocationService.getAPI(url, {}).subscribe((res: any) => {
        if (res.data && res.data.length > 0) {
          this.engineerNameList = res.data;
          this.engineerObservable.next(this.engineerNameList);
          resolve("");
        }
      }, (err: any) => {
        console.log(err);
        reject("");
      })
    });
  }

  getEngineerComboSelected(param) {
    let engineerId = param.engineerId;
    if (engineerId) {
      let engineerObj = this.engineerNameList.find(obj => obj.engineerId == engineerId);
      return engineerObj;
    }
  }

  getSelectedEngineerName(param) {
    let engineerId = param.engineerId;
    if (engineerId) {
      let engineerObj = this.engineerNameList.find(obj => obj.engineerId == engineerId);
      return engineerObj.engineerName;
    }
  }

  //Grid Action
  actions(e, type) {
    this.addAndDeleteRows("deleteRow", e.rowData.id);
  }

  //Grid Initialization
  onEngineerAllocationGridReady(e) {
    this.engineerAllocationGrid = e.api;
    this.engineerAllocationGrid.columnModel.gridOptionsWrapper.gridOptions.columnApi.setColumnVisible(
      "eadelete",
      this.btnPermission?.isDelete || this.btnPermission?.isCreate || this.btnPermission?.isEdit
    );
    this.engineerAllocationGrid.showLoadingOverlay();
    this.getEngineerNameList().then((obj) => {
      this.getEngineerAllocation();
    })
  }

  saveEngineerAllocation() {
    let errorMessageList = [];
    if (errorMessageList.length == 0) {
      this.engineerAllocationButtonDisabled = true;
      this.engineerAllocationGrid.stopEditing();
      let params = [];
      let url = "/testTracker/saveEngineer";
      this.engineerAllocationGrid.forEachNode(function (node) {
        params.push(node.data);
      });
      this.engineerAllocationDeleteList.forEach((obj) => {
        params.push(obj);
      });
      let reqBody = {
        id: this.testTrackerId,
        testEngineerList: params,
      };
      this.engineerAllocationService.postAPI(url, reqBody).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.cancelEngineerAllocation();
            this.getEngineerAllocation();
            console.log(this.windowRef.config.context);
            if (this.windowRef.config.context['engineerStatus'] == null) {
              this.windowRef.config.context['engineerStatus'] = 'Started';
            }
            this.engineerAllocationService.openDialog(
              "Success",
              res.message,
              [],
              "success"
            );
          } else {
            this.engineerAllocationButtonDisabled = false;
            this.engineerAllocationService.openDialog(
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
      this.engineerAllocationService.openDialog(
        "Warning",
        "",
        errorMessageList,
        "warning"
      );
    }
  }

  addAndDeleteRows(type, rowId?) {
    if (type == "addRow") {
      let addRowFlag = true;
      this.engineerAllocationList.forEach((obj, index) => {
        if ((!obj.id && obj.engineerId == null) || obj.engineerId == "") {
          this.engineerAllocationService.openDialog(
            "Error",
            "Row should not be empty!",
            [],
            "danger"
          );
          addRowFlag = false;
        }
      });
      if (addRowFlag) {
        const colDefs = this.engineerAllocationGrid.getColumnDefs();
        const newRowObj = {};
        colDefs.forEach((eachColDef) => {
          const { field } = eachColDef;
          newRowObj[field] = null;
        });
        newRowObj["status"] = "Active";
        let newRow = [newRowObj];
        this.engineerAllocationList = [
          ...this.engineerAllocationList,
          ...newRow,
        ];
      }
    } else if (type == "deleteRow") {
      this.engineerAllocationList.forEach((obj, index) => {
        if (obj.id && rowId && obj.id == rowId) {
          obj["status"] = "Delete";
          this.engineerAllocationDeleteList.push(obj);
          this.engineerAllocationList.splice(index, 1);
        } else {
          if (!obj.id && (obj.engineerId == null || obj.engineerId == "")) {
            this.engineerAllocationList.splice(index, 1);
          }
        }
      });
      this.engineerAllocationList = [...this.engineerAllocationList];
    }
  }

  getEngineerAllocation() {
    this.engineerAllocationGrid.showLoadingOverlay();
    const url = "/testTracker/getEngineer?testTrackerId=" + this.testTrackerId;
    this.engineerAllocationService.getAPI(url, {}).subscribe(
      (res: any) => {
        this.engineerAllocationGrid.hideOverlay();
        if (res.data && res.data.length > 0) {
          this.engineerAllocationList = res.data;
        } else {
          this.engineerAllocationGrid.showNoRowsOverlay();
        }
      },
      (err: any) => { }
    );
  }

  cancelEngineerAllocation() {
    this.engineerAllocationButtonDisabled = false;
    this.engineerAllocationDeleteList = [];
  }
}
