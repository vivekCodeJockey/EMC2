import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { ColDef } from "ag-grid-community";
import { Subscription, timer } from "rxjs";
import { nvtoastrService } from "../../../@theme/service/toastr/toastr.service";
import { CommonService } from "../../common.service";
import { GridCheckboxComponent } from "../../common/grid-checkbox/grid-checkbox.component";
import { worksheet, WorksheetSettings } from "./WorksheetSettings";

@Component({
  selector: "ngx-worksheet",
  templateUrl: "./worksheet.component.html",
  styleUrls: ["./worksheet.component.scss"],
})
export class WorksheetComponent implements OnInit {
  fieldSize: any = "small";
  eqScreen = false;
  tsScreen = false;
  testTrackerId = "";
  exJrfDtl;
  workSheetData: any;
  equipmentList: any[] = [];
  equipmentSelectedList: any[] = [];
  curWorkSheet: worksheet;
  tSheetColumnDefs: ColDef[];
  tSheetGrid;
  tSheetRowData: any;
  addWorkSheetBtn = false;
  equipmentGrid;
  fileToUpload: File | null = null;
  fileName: string = "";
  testStatus = "";
  timeTrackerButtonDisabled: boolean = false;
  timeTrackerButtonName: string = "Start";
  workcomment;
  countDown: Subscription;
  counter = 0;
  tick = 1000;
  testStarted = false;
  loading = false;

  wSheetForm = this.fb.group({
    eutName: [""],
    modelNo: [""],
    serialNo: [""],
    eutCurrent: [""],
    testTemperature: [""],
    operation: [""],
    testHumidity: [""],
    limitLines: [""],
    testRefDocNo: [""],
    testMethod: [""],
    testSoftwareUsed: [""],
    fileInput: [""],
  });

  tSheetDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  constructor(
    private router: Router,
    private worksheetService: CommonService,
    private fb: UntypedFormBuilder,
    private toastrService: nvtoastrService
  ) {
    if (
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.jrfDtl
    ) {
      this.exJrfDtl = this.router.getCurrentNavigation().extras.state.jrfDtl;
      this.eqScreen =
        this.router.getCurrentNavigation().extras.state.screen == 1;
      this.testTrackerId =
        this.router.getCurrentNavigation().extras.state.jrfDtl.testTrackerId;
      this.curWorkSheet = this.getWorkSheet(
        this.router.getCurrentNavigation().extras.state.jrfDtl.workSheetId
      );
    }
  }

  eqDefaultColDef = { flex: 1, theme: "ag-theme-balham" };
  eqRowData;
  eqColumnDefs = [
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60, suppressMovable: true,
    },
    { headerName: "Instrument", field: "instrumentName", suppressMovable: true, },
    {
      headerName: "Make",
      field: "make",
      width: 80,
      minWidth: 50,
      maxWidth: 120, suppressMovable: true,
    },
    {
      headerName: "Model No",
      field: "modelNo",
      width: 80,
      minWidth: 50,
      maxWidth: 120, suppressMovable: true,
    },
    {
      headerName: "Serial No",
      field: "serialNo",
      width: 200,
      minWidth: 100, suppressMovable: true,
      maxWidth: 250,
    },
    // { headerName: 'Calibration Date', field: "calibrationDate", width: 200, minWidth: 100, maxWidth: 250, cellRenderer: (data) => { return data.value ? moment(new Date(data.value)).format("DD/MM/YYYY") : '' } },
    {
      headerName: "Add",
      width: 50,
      minWidth: 50, suppressMovable: true,
      maxWidth: 50,
      field: "addEqu",
      checkboxSelection: true,
    },
  ];

  ngOnInit(): void {
    this.tSheetColumnDefs = this.curWorkSheet.columnDef;
    this.tSheetColumnDefs = [
      ...this.tSheetColumnDefs,
      {
        headerName: this.curWorkSheet.resultHeaderName,
        width: 200,
        minWidth: 200, suppressMovable: true,
        maxWidth: 200,
        field: "testStatus",
        cellRenderer: GridCheckboxComponent,
        cellRendererParams: {
          checkbox: [
            { name: "PASS", val: 1 },
            { name: "FAIL", val: 2 },
            { name: "NA", val: 3 },
          ],
          onClick: (e, type) => e.rowData && this.actions(e, type),
        },
      },
    ];

    if (this.exJrfDtl.worksheetStatus != null) {
      this.getWorkSheetData();
    } else {
      if (this.curWorkSheet.fixedvalue) {
        this.tSheetRowData = this.curWorkSheet.value;
      } else {
        this.tSheetRowData = [{}];
      }
    }
    if (this.curWorkSheet.allowAdd) {
      this.addWorkSheetBtn = true;
    }
    this.getLimitLinesGraph();
    this.equipmentList = [];
    this.equipmentSelectedList = [];
  }

  getLimitLinesGraph() {
    this.loading = true;
    let params = {
      jrfId: this.exJrfDtl.jrfId,
      testTrackerId: this.testTrackerId,
    };
    let url = "/testTracker/getLimitLinesGraph";
    this.worksheetService.getAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          let data = res.data;
          let type = data.type;
          this.fileName = data.fileName;
          delete data.type;
          delete data.fileName;
          this.wSheetForm.setValue(data);
          if (this.exJrfDtl.timeTrackerStatus != 'Completed') {
            if (type.startsWith("start")) {
              if (this.countDown != undefined) {
                this.countDown.unsubscribe();
                this.countDown = null;
              }
              this.testStarted = false;
              this.timeTrackerButtonName = "Start";
            } else if (type.startsWith("end")) {
              this.exJrfDtl.timeTrackerStatus = "Started";
              let time = type.split("@@")[1];
              if (time) {
                this.counter = time;
                this.countDown = timer(0, this.tick).subscribe(() => ++this.counter);
                this.testStarted = true;
              }
              this.timeTrackerButtonName = "Stop";
            } else {
              if (this.exJrfDtl.isButtonRequired == "true") {
                this.exJrfDtl.isButtonRequired = "false";
                this.worksheetService.openDialog("Error", type, [], "danger");
              }
            }
          }
        } else {
          this.worksheetService.openDialog("Error", res.message, [], "danger");
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  //Grid Action
  actions(e, type) {
    if (e.event.target.checked) {
      e.rowData[type.col.field] = type.checkName.val;
    } else {
      e.rowData[type.col.field] = 3;
    }
    let failStatus = false;
    let passStatus = false;
    this.tSheetGrid.forEachNode(function (node) {
      if (!failStatus) {
        if (node.data.testStatus == 2) {
          failStatus = true;
        } else if (node.data.testStatus == 1) {
          passStatus = true;
        }
      }
    });
    if (failStatus || passStatus) {
      this.testStatus = failStatus ? "FAIL" : "PASS";
    } else {
      this.testStatus = "";
    }
  }

  onGridReady(e) {
    this.tSheetGrid = e.api;
  }

  onEquipmentGridReady(e) {
    this.equipmentGrid = e.api;
    if (
      this.equipmentList.length == 0 &&
      this.equipmentSelectedList.length == 0
    ) {
      this.getEquipment();
    }
  }

  addNew() {
    this.worksheetService.gridAddRow(this.tSheetGrid);
  }

  getEquipment(searchText?) {
    this.loading = true;
    this.equipmentGrid.showLoadingOverlay();
    const limit = 10;
    const offset = this.equipmentGrid.paginationGetCurrentPage();
    const payload: any = {};
    if (searchText) {
      payload["searchText"] = searchText;
    }
    const url =
      "/testTracker/getEquipment?testTrackerId=" +
      this.testTrackerId +
      "&testId=" +
      this.exJrfDtl.testId +
      "&pageSize=" +
      limit +
      "&pageNum=" +
      offset;
    this.worksheetService.getAPI(url, payload).subscribe(
      (res: any) => {
        this.equipmentGrid.hideOverlay();
        if (res.data) {
          this.equipmentList = res.data.testMasterEquipmentList;
          this.equipmentSelectedList = res.data.testTrackerEquipmentList;
          if (this.equipmentList && this.equipmentList.length > 0) {
            let errList = [];
            for (let eql of this.equipmentList) {
              if (eql && eql.dueDate && new Date(eql.dueDate) <= new Date()) {
                errList.push(
                  "Calibration due exprie for " + eql.instrumentName
                );
              }
            }
            if (errList && errList.length > 0) {
              this.worksheetService.openDialog(
                "Warning",
                "",
                errList,
                "warning"
              );
            }
          }
        } else {
          this.equipmentGrid.showNoRowsOverlay();
        }
        this.loading = false;
      },
      (err: any) => { this.loading = false; }
    );
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  onFirstDataRendered(params: any) {
    params.api.forEachNode((node) => {
      if (
        node.data &&
        this.equipmentSelectedList.find((item) => item.id == node.data.id)
      ) {
        node.setSelected(true);
      }
    });
  }

  onSave(event) {
    event.target.disabled = true;
    event.target.nextSibling.disabled = true;
    this.loading = true;
    //Save MetaData
    if (!this.tsScreen && !this.eqScreen) {
      let errorMessageList = this.fieldValidation();
      if (errorMessageList.length == 0) {
        const formData: FormData = new FormData();
        const headers = new HttpHeaders().set(
          "Content-Type",
          "multipart/form-data"
        );
        let trackerJSON = { ...this.wSheetForm.value, id: this.testTrackerId };
        formData.append("file", this.fileToUpload);
        formData.append("trackerJSON", JSON.stringify(trackerJSON));
        this.worksheetService
          .postAPI("/testTracker/saveLimitLinesGraph", formData, {
            headers: headers,
          })
          .subscribe(
            (res: any) => {
              if (res.success) {
                this.wSheetForm.controls["fileInput"].setValue("");
                this.fileToUpload = null;
                if (this.exJrfDtl.worksheetInfoStatus == null) {
                  this.exJrfDtl.worksheetInfoStatus = "saved";
                }
                // this.toastrService.showToast(
                //   "success",
                //   "Worksheet",
                //   res.message,
                //   "BOTTOM_RIGHT"
                // );
                this.worksheetService.openDialog(
                  "Worksheet",
                  res.message,
                  [],
                  "success"
                );
              } else {
                this.worksheetService.openDialog(
                  "Error",
                  res.message,
                  "",
                  "danger"
                );
              }
              event.target.disabled = false;
              event.target.nextSibling.disabled = false;
              this.loading = false;
            },
            (error) => {
              event.target.disabled = false;
              event.target.nextSibling.disabled = false;
              console.log(error);
              this.loading = false;
            }
          );
      } else {
        event.target.disabled = false;
        event.target.nextSibling.disabled = false;
        this.loading = false;
        this.worksheetService.openDialog(
          "Warning",
          "",
          errorMessageList,
          "warning"
        );
      }
    }
    // Save Equipment
    else if (this.eqScreen) {
      let reqBody = {
        id: this.testTrackerId,
        testEquipmentList: this.equipmentGrid.getSelectedRows(),
      };
      this.worksheetService
        .postAPI("/testTracker/saveEquipment", reqBody)
        .subscribe((res: any) => {
          if (res.success) {
            // this.toastrService.showToast(
            //   "success",
            //   "Worksheet",
            //   res.message,
            //   "BOTTOM_RIGHT"
            // );
            this.worksheetService.openDialog(
              "Worksheet",
              res.message,
              [],
              "success"
            );
            this.equipmentSelectedList = reqBody.testEquipmentList;
          } else {
            this.worksheetService.openDialog(
              "Error",
              res.message,
              "",
              "danger"
            );
          }
          event.target.disabled = false;
          event.target.nextSibling.disabled = false;
          if (this.exJrfDtl.equipmentStatus == null) {
            this.exJrfDtl.equipmentStatus = "saved";
          }
          this.loading = false;
        });
    }
    // Save Worksheet
    else if (this.tsScreen) {
      let failStatus = false;
      let passStatus = false;
      let worksheetGridData: Array<any> = [];
      this.tSheetGrid.stopEditing();
      this.tSheetGrid.forEachNode(function (node) {
        if (!failStatus) {
          if (node.data.testStatus == 2) {
            failStatus = true;
            passStatus = false;
          } else if (node.data.testStatus == 1) {
            passStatus = true;
          }
        }
        worksheetGridData.push(JSON.parse(JSON.stringify(node.data)));
      });
      if (passStatus || failStatus) {
        let reqBody = {
          testTrackerId: this.testTrackerId,
          testStatus: passStatus ? "PASS" : "FAIL", // TODO: Based on grid rows status needs to set the PASS/FAIL
          worksheetData: { sheetDataList: worksheetGridData, comment: this.workcomment },
        };
        this.worksheetService
          .postAPI("/testTracker/worksheet", reqBody)
          .subscribe((res: any) => {
            if (res.success) {
              // this.toastrService.showToast(
              //   "success",
              //   "Worksheet",
              //   "Worksheet saved successfully",
              //   "BOTTOM_RIGHT"
              // );
              this.worksheetService.openDialog(
                "Worksheet",
                "Worksheet saved successfully",
                [],
                "success"
              );
            } else {
              this.worksheetService.openDialog(
                "Error",
                res.message,
                "",
                "danger"
              );
            }
            event.target.disabled = false;
            event.target.nextSibling.disabled = false;
            this.loading = false;
          });
      }
    }
  }

  getWorkSheetData() {
    this.worksheetService
      .getAPI("/testTracker/worksheet", { testTrackerId: this.testTrackerId })
      .subscribe((res: any) => {
        if (res.success) {
          this.workSheetData = res.data;
          this.tSheetRowData = res.data.worksheetData.sheetDataList;
          this.testStatus = res.data.testStatus;
          this.workcomment = res.data.worksheetData.comment
        }
      });
  }
  getWorkSheet(param) {
    return param ? WorksheetSettings[param] : WorksheetSettings["W2"];
  }

  saveTimeTracker() {
    this.loading = true;
    this.timeTrackerButtonDisabled = true;
    let params = {
      testTrackerId: this.testTrackerId,
      type: this.timeTrackerButtonName.includes("Start")
        ? "startDateTime"
        : "endDateTime",
    };
    let url = "/testTracker/saveTimeTracker";
    this.worksheetService.postAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          if (res.data.startsWith("start")) {
            this.countDown.unsubscribe();
            this.testStarted = false;
            this.countDown = null;
            this.timeTrackerButtonName = "Start";
          } else if (res.data.startsWith("end")) {
            this.exJrfDtl.timeTrackerStatus = "Started";
            let time = res.data.split("@@")[1];
            if (time) {
              this.counter = time;
              this.countDown = timer(0, this.tick).subscribe(() => ++this.counter);
              this.testStarted = true;
            }
            this.timeTrackerButtonName = "Stop";
          } else {
            this.worksheetService.openDialog("Error", res.data, [], "danger");
          }
          this.toastrService.showToast("success", "TimeTracker", res.message, "BOTTOM_RIGHT");
          if (this.exJrfDtl.timeTrackerStatus == null) {
            this.exJrfDtl.timeTrackerStatus = "Started";
          }
        } else {
          if (this.exJrfDtl.isButtonRequired == "true") {
            this.exJrfDtl.isButtonRequired = "false";
            this.worksheetService.openDialog("Error", res.message, [], "danger");
          }
        }
        this.timeTrackerButtonDisabled = false;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  completeTimeTracker() {
    this.loading = true;
    if (this.exJrfDtl.timeTrackerStatus == null) {
      this.worksheetService.openDialog(
        "Error",
        "Please start your test!",
        [],
        "danger"
      );
      // this.toastrService.showToast("success", "TimeTracker", "Please start your test!", "BOTTOM_RIGHT");
    } else {
      this.timeTrackerButtonDisabled = true;
      let url = "/testTracker/completeTimeTracker?testTrackerId=" + this.testTrackerId;
      this.worksheetService.putAPI(url, {}).subscribe((res: any) => {
        if (res.code == 200) {
          this.exJrfDtl.isButtonRequired = "false";
          this.worksheetService.openDialog("TimeTracker", res.message, [], "success");
          // this.toastrService.showToast("success", "TimeTracker", res.message, "BOTTOM_RIGHT");
        } else {
          this.worksheetService.openDialog("Error", res.message, [], "danger");
        }
        this.timeTrackerButtonDisabled = false;
        this.loading = false;
      }, (err) => {
        this.loading = false;
        console.log(err);
      });
    }
  }

  fieldValidation() {
    let errorMessageList = [];
    let testTemperature = this.wSheetForm.get("testTemperature").value;
    let testHumidity = this.wSheetForm.get("testHumidity").value;
    let limitLines = this.wSheetForm.get("limitLines").value;
    if (
      testTemperature == "" ||
      testTemperature == null ||
      testTemperature == "null"
    ) {
      errorMessageList.push("Temperature should not be empty");
    }
    if (testHumidity == "" || testHumidity == null || testHumidity == "null") {
      errorMessageList.push("RH% should not be empty");
    }
    if (limitLines == "" || limitLines == null || limitLines == "null") {
      errorMessageList.push("Limit Lines should not be empty");
    }
    return errorMessageList;
  }
}
