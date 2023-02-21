import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NbDateService } from "@nebular/theme";
import { IDatasource, IGetRowsParams } from "ag-grid-community";
import { CommonService } from "../../common.service";
import { GridActionsComponent } from "../../common/grid-actions/grid-actions.component";

@Component({
  selector: "ngx-equipmentmaster",
  templateUrl: "./equipmentmaster.component.html",
  styleUrls: ["./equipmentmaster.component.scss"],
  providers: [DatePipe],
})
export class EquipmentmasterComponent implements OnInit {
  fieldSize: any = "small";
  min: Date;
  max: Date;
  equipmentList: [];
  equipmentButtonName: string = "Save";
  equipmentGridRowData: any;
  equipmentGrid: any;
  equipmentForm: UntypedFormGroup;
  equipmentButtonDisabled: boolean = false;
  status: any;
  searchText: string;

  //Equipment Master Table Definition
  equipColumnDefs = [
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60, suppressMovable: true,
    },
    {
      headerName: "Instrument",
      field: "instrumentName",
      width: 220,
      tooltipField: "instrumentName",
      minWidth: 200,cellClass: "text-truncate",
      maxWidth: 250, suppressMovable: true,
    },
    {
      headerName: "Make",
      field: "make",
      width: 150,
      minWidth: 100,
      tooltipField: "make",cellClass: "text-truncate",
      maxWidth: 180, suppressMovable: true,
    },
    { headerName: "Model No", field: "modelNo", width: 200,tooltipField: "modelNo",cellClass: "text-truncate", minWidth: 100, suppressMovable: true, },
    {
      headerName: "Serial No",tooltipField: "serialNo",cellClass: "text-truncate",
      field: "serialNo",
      width: 120,
      minWidth: 60,
      maxWidth: 150, suppressMovable: true,
    },
    {
      headerName: "Caliburation Date",
      field: "calibrationDate",
      width: 120,
      minWidth: 60,
      maxWidth: 150,
      cellRenderer: (data) => {
        return this.datePipe.transform(data.value, "dd-MM-yyyy");
      }, suppressMovable: true,
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      width: 120,
      minWidth: 60,
      maxWidth: 150,
      cellRenderer: (data) => {
        return this.datePipe.transform(data.value, "dd-MM-yyyy");
      }, suppressMovable: true,
    },
    {
      headerName: "Status",
      field: "status",
      width: 80,
      minWidth: 60,
      maxWidth: 100, suppressMovable: true,
    },
    {
      headerName: "Actions",
      width: 110,
      minWidth: 110,
      maxWidth: 110,
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onClick: (e, type) => e.rowData && this.actions(e, type),
        button: ["edit", "delete", "enable"],
        buttonPer: this.equipmentService.getPermission(Number(localStorage.getItem('pageId')))
      },
      pinned: "right",
      cellClass: "ag-pinned-right-cols-container", suppressMovable: true,
    },
  ];
  equipDefaultColDef = { flex: 1, theme: "ag-theme-balham" };
  btnPermission: any;
  constructor(
    protected dateService: NbDateService<Date>,
    private datePipe: DatePipe,
    private equipmentService: CommonService,
    private cdr: ChangeDetectorRef,
    private fb: UntypedFormBuilder
  ) {
    this.min = this.dateService.today();
    // this.max = this.dateService.addDay(this.dateService.today(), 5);
    // this.min = this.dateService.addDay(this.dateService.today(), -5);
    // this.max = this.dateService.addDay(this.dateService.today(), 5);
    equipmentService.setGridDynamicRowCnt(this.gridOptions, 500);
  }

  ngOnInit(): void {
    this.btnPermission = this.equipmentService.getPermission(Number(localStorage.getItem('pageId')))
    this.equipmentForm = this.fb.group({
      instrumentName: ["", Validators.required],
      make: ["", Validators.required],
      modelNo: ["", Validators.required],
      serialNo: ["", Validators.required],
      calibrationDate: [
        this.datePipe.transform("", "dd-MM-yyyy"),
        Validators.required,
      ],
      dueDate: [this.datePipe.transform("", "dd-MM-yyyy"), Validators.required],
      calibrationApplicable: ['']
    });
  }

  //Grid Options
  gridOptions = {
    pagination: true,
    rowModelType: "infinite",
    // paginationPageSize: 10,
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    // cacheBlockSize: 100,
    rowSelection: "single",
    animateRows: true,
    domLayout: "autoHeight",
  };

  //Grid Action
  actions(e, type) {
    let rowData = JSON.parse(JSON.stringify(e.rowData));
    if (type == "edit") {
      this.status = type;
      this.updateGridData(e.rowData);
    } else if (type == "delete") {
      this.deleteEquipment(rowData);
    } else {
      this.status = type;
      this.updateEquipment(e.rowData);
    }
  }

  onEquipmentGridReady(e) {
    this.equipmentGrid = e.api;
    this.getEquipment();
  }

  updateGridData(rowData: any) {
    this.equipmentForm.controls["instrumentName"].setValue(rowData.instrumentName);
    this.equipmentForm.controls["make"].setValue(rowData.make);
    this.equipmentForm.controls["modelNo"].setValue(rowData.modelNo);
    this.equipmentForm.controls["serialNo"].setValue(rowData.serialNo);
    if (rowData.calibrationApplicable == "true") {
      this.equipmentForm.controls["calibrationApplicable"].setValue(true);
      this.equipmentForm.controls["calibrationDate"].setValue(new Date(rowData.calibrationDate));
      this.equipmentForm.controls["dueDate"].setValue(new Date(rowData.dueDate));
    } else {
      this.equipmentForm.controls["calibrationDate"].setValue("");
      this.equipmentForm.controls["dueDate"].setValue("");
      this.equipmentForm.controls["calibrationApplicable"].setValue(false);
    }
    this.equipmentGridRowData = rowData;
    this.equipmentButtonName = "Update";
  }

  showAndHide(selected: any) {
    if (!selected) {
      this.equipmentForm.controls["calibrationDate"].setValue("");
      this.equipmentForm.controls["dueDate"].setValue("");
    }
  }

  saveEquipment() {
    let errorMessageList = this.fieldValidation();
    if (errorMessageList.length == 0) {
      this.equipmentButtonDisabled = true;
      if (this.equipmentGridRowData != null) {
        this.updateEquipment(this.equipmentGridRowData);
      } else {
        let url = "/master/equipment/addEquipment";
        let params = { ...this.equipmentForm.value, status: "Active" };
        this.equipmentService.postAPI(url, params).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.cancelEquipment();
              this.equipmentGrid.purgeInfiniteCache();
              this.equipmentService.openDialog(
                "Success",
                res.message,
                [],
                "success"
              );
            } else {
              this.equipmentButtonDisabled = false;
              this.equipmentService.openDialog(
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
      this.equipmentService.openDialog(
        "Warning",
        "",
        errorMessageList,
        "warning"
      );
    }
  }

  updateEquipment(rowData: any) {
    if (this.status == "edit") {
      rowData["instrumentName"] =
        this.equipmentForm.get("instrumentName").value;
      rowData["make"] = this.equipmentForm.get("make").value;
      rowData["modelNo"] = this.equipmentForm.get("modelNo").value;
      rowData["serialNo"] = this.equipmentForm.get("serialNo").value;
      rowData["calibrationDate"] =
        this.equipmentForm.get("calibrationDate").value;
      rowData["dueDate"] = this.equipmentForm.get("dueDate").value;
      let calibrationApplicable = this.equipmentForm.get("calibrationApplicable").value;
      rowData["calibrationApplicable"] = calibrationApplicable ? "true" : "false";
    } else {
      rowData["status"] = rowData.status == "Active" ? "Inactive" : "Active";
    }
    let url = "/master/equipment/updateEquipment";
    this.equipmentService.putAPI(url, rowData).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cancelEquipment();
          this.equipmentGrid.refreshCells({ suppressFlash: true });
          this.equipmentService.openDialog(
            "Success",
            res.message,
            [],
            "success"
          );
        } else {
          this.equipmentButtonDisabled = false;
          this.equipmentService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteEquipment(rowData: any) {
    let url = "/master/equipment/deleteEquipment";
    let params = { equipmentId: rowData.id };
    this.equipmentService.deleteAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cancelEquipment();
          this.equipmentGrid.purgeInfiniteCache();
          this.equipmentService.openDialog(
            "Success",
            res.message,
            [],
            "success"
          );
        } else {
          this.equipmentService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cancelEquipment() {
    this.equipmentButtonDisabled = false;
    this.equipmentForm.controls["instrumentName"].setValue("");
    this.equipmentForm.controls["make"].setValue("");
    this.equipmentForm.controls["modelNo"].setValue("");
    this.equipmentForm.controls["serialNo"].setValue("");
    this.equipmentForm.controls["calibrationDate"].setValue("");
    this.equipmentForm.controls["dueDate"].setValue("");
    this.equipmentForm.controls["calibrationApplicable"].setValue("");
    this.equipmentButtonName = "Save";
    this.equipmentGridRowData = null;
  }

  getEquipment() {
    if (this.equipmentGrid) {
      let datSource = this.equipmentService.gridPaginationGetRows(this.equipmentGrid, this.cdr, "/master/equipment/getEquipment", this.equipmentList);
      this.equipmentGrid.setDatasource(datSource);
    }
  }

  fieldValidation() {
    let errorMessageList = [];
    let instrumentName = this.equipmentForm.get("instrumentName").value;
    let make = this.equipmentForm.get("make").value;
    let modelNo = this.equipmentForm.get("modelNo").value;
    let serialNo = this.equipmentForm.get("serialNo").value;
    let calibrationDate = this.equipmentForm.get("calibrationDate").value;
    let dueDate = this.equipmentForm.get("dueDate").value;
    let calibrationApplicable = this.equipmentForm.get("calibrationApplicable").value;
    if (
      instrumentName == "" ||
      instrumentName == null ||
      instrumentName == "null"
    ) {
      errorMessageList.push("InstrumentName should not be empty");
    }
    if (make == "" || make == null || make == "null") {
      errorMessageList.push("Make should not be empty");
    }
    if (modelNo == "" || modelNo == null || modelNo == "null") {
      errorMessageList.push("Model No should not be empty");
    }
    if (serialNo == "" || serialNo == null || serialNo == "null") {
      errorMessageList.push("Serial No should not be empty");
    }
    if (calibrationApplicable == true) {
      if (calibrationDate == "" || calibrationDate == null || calibrationDate == "null") {
        errorMessageList.push("Calibration Date should not be empty");
      }
      if (dueDate == "" || dueDate == null || dueDate == "null") {
        errorMessageList.push("Due Date should not be empty");
      }
    }
    return errorMessageList;
  }

  searchEquip() {
    this.equipmentGrid["searchText"] = this.searchText;
    this.equipmentGrid.purgeInfiniteCache();
  }

  updateSearchText() {
    if (this.searchText == '') {
      this.searchEquip()
    }
  }
}