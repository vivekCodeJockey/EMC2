import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { ColDef, IDatasource, IGetRowsParams } from "ag-grid-community";
import { CommonService } from "../../common.service";
import { GridActionsComponent } from "../../common/grid-actions/grid-actions.component";

@Component({
  selector: "ngx-tariff-master",
  templateUrl: "./tariff-master.component.html",
  styleUrls: ["./tariff-master.component.scss"],
})
export class TariffMasterComponent implements OnInit {
  categoryMasterList: any = [];
  specificationMasterList: any = [];
  testMasterList: any = [];
  tariffList: any = [];
  fieldFrequencyList: any = [];
  fieldSize: any = "small";
  tariffButtonName: string = "Save";
  tariffGridRowData: any;
  tabActive: boolean = true;
  tariffGrid: any;
  fieldFrequencyGrid: any;
  tariffForm: UntypedFormGroup;
  tariffButtonDisabled: boolean = false;
  status: any;
  emptyDivHideShow: boolean = false;
  cableDivHideShow: boolean = false;
  fieldStrengthDivHideShow: boolean = false;
  tariffId: any;
  btnPermission: any;
  searchText: string;

  //Tariff Master Table Definition
  tariffColumnDefs: ColDef[] = [
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60, suppressMovable: true,
    },
    {
      headerName: "Category",
      field: "testMaster.specificationMaster.categoryMaster.name",
      width: 150,
      minWidth: 100,
      maxWidth: 180, suppressMovable: true,
    },
    {
      headerName: "Specification",
      field: "testMaster.specificationMaster.name",
      width: 150,
      minWidth: 100,
      maxWidth: 180, suppressMovable: true,
    },
    {
      headerName: "Test Name",
      field: "testMaster.testName",
      width: 200,
      minWidth: 100, suppressMovable: true,
    },
    {
      headerName: "Amount",
      field: "basePrice",
      width: 120,
      minWidth: 60,
      maxWidth: 150, suppressMovable: true,
    },
    {
      headerName: "Status",
      field: "status",
      width: 120,
      minWidth: 60,
      maxWidth: 150, suppressMovable: true,
    },
    {
      headerName: "Actions",
      cellRenderer: GridActionsComponent, suppressMovable: true,
      cellRendererParams: {
        onClick: (e, type) => e.rowData && this.actions(e, type, "Tariff"),
        button: ["edit", "delete", "enable"],
        buttonPer: this.tariffService.getPermission(Number(localStorage.getItem('pageId')))
      },
      pinned: "right",
      cellClass: "ag-pinned-right-cols-container",
      width: 110,
      minWidth: 110,
      maxWidth: 110,
    },
  ];
  tariffDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  //Field/Frequency Table Definition
  fStrengthColumnDefs: ColDef[] = [
    { headerName: "Status", field: "status", hide: true },
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60, suppressMovable: true,
    },
    {
      headerName: "Field Strength V/M",
      field: "fieldStrength",
      editable: true,
      width: 150,
      minWidth: 100,
      maxWidth: 230, suppressMovable: true,
      valueSetter: params => {
        let nVal = params.newValue;
        params.data.fieldStrength = ((nVal != null) && (nVal !== '') && !isNaN(Number(nVal.toString()))) ? nVal : '';
        return ((nVal != null) && (nVal !== '') && !isNaN(Number(nVal.toString())));
      },
      valueGetter: params => {
        return params.data.fieldStrength;
      },
    },
    {
      headerName: "Frequency Range",
      field: "frequencyRange",
      editable: true,
      width: 150,
      minWidth: 100,
      maxWidth: 230, suppressMovable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: [
          "10K to 80MHz",
          "80MHz to 1GHz",
          "1GHz to 2.5GHz",
          "2.5GHz to 7.5GHz",
          "7.5GHz to 18GHz",
          "18GHz to 26GHz",
          "26GHz to 40 GHz",
        ],
      },
    },
    {
      headerName: "Amount",
      field: "amount",
      editable: true,
      width: 150,
      minWidth: 100, suppressMovable: true,
      maxWidth: 230,
      valueSetter: params => {
        let nVal = params.newValue;
        params.data.amount = ((nVal != null) && (nVal !== '') && !isNaN(Number(nVal.toString()))) ? nVal : '';
        return ((nVal != null) && (nVal !== '') && !isNaN(Number(nVal.toString())));
      },
      valueGetter: params => {
        return params.data.amount;
      },
    },
    {
      headerName: "Actions",
      cellRenderer: GridActionsComponent, suppressMovable: true,
      cellRendererParams: {
        onClick: (e, type) =>
          e.rowData && this.actions(e, type, "FieldFrequency"),
        button: ["delete"],
        buttonPer: this.tariffService.getPermission(Number(localStorage.getItem('pageId')))
      },
      pinned: "right",
      cellClass: "ag-pinned-right-cols-container",
      width: 65,
      minWidth: 65,
      maxWidth: 65,
    },
  ];
  fStrengthDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  //Grid Options
  gridOptions = {
    pagination: true,
    rowModelType: "infinite",
    // paginationPageSize: 10,
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    singleClickEdit: true,
    // cacheBlockSize: 100,
    rowSelection: "single",
    animateRows: true,
    domLayout: "autoHeight",
  };

  fGridOptions = {
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    singleClickEdit: true,
    rowSelection: "single",
    animateRows: true,
    domLayout: "autoHeight"
  };

  onTariffGridReady(e) {
    this.tariffGrid = e.api;
  }

  onfStrengthGridReady(e) {
    this.fieldFrequencyGrid = e.api;
  }

  //Grid Action
  actions(e, type, gridName) {
    let rowData = JSON.parse(JSON.stringify(e.rowData));
    if (type == "edit") {
      this.status = type;
      this.updateGridData(e.rowData);
    } else if (type == "delete") {
      this.deleteGridData(rowData, gridName);
    } else {
      this.status = type;
      this.activeInactiveGridData(e.rowData, gridName);
    }
  }

  ngOnInit(): void {
    this.btnPermission = this.tariffService.getPermission(Number(localStorage.getItem('pageId')))
    this.tariffForm = this.fb.group({
      categoryId: ["", Validators.required],
      specificationId: ["", Validators.required],
      testId: ["", Validators.required],
      basePrice: ["0.00", Validators.required],
      additionalTestCharge: ["0.00", Validators.required],
      singlePhase: ["0.00", Validators.required],
      threePhase: ["0.00", Validators.required],
      dc: ["0.00", Validators.required],
      cableCount: ["0.00", Validators.required],
      cableAmount: ["0.00", Validators.required],
      perCable: ["0.00", Validators.required],
    });
    this.getCategoryMaster();
  }

  constructor(
    private tariffService: CommonService,
    private cdr: ChangeDetectorRef,
    private fb: UntypedFormBuilder
  ) {
    tariffService.setGridDynamicRowCnt(this.gridOptions, 200);
    // tariffService.setGridDynamicRowCnt(this.catGridOptions,500);
  }

  getActiveTab(activeTab: any) {
    if (activeTab.tabTitle === "Tariff") {
      this.tabActive = true;
      this.tariffGrid.infiniteRowModel.datasource == undefined ? this.getTariff() : "";
      // this.tariffList.length == 0 ? this.getTariff() : "";
    } else {
      this.tabActive = false;
    }
  }

  updateGridData(rowData: any) {
    this.emptyDivHideShow = false;
    this.cableDivHideShow = false;
    this.fieldStrengthDivHideShow = false;
    this.getSpecificationMaster(rowData.categoryId);
    this.getTestMaster(rowData.specificationId);
    this.specificationMasterList = [rowData.testMaster.specificationMaster];
    this.testMasterList = [rowData.testMaster];
    this.tabActive = false;
    this.tariffForm.controls["categoryId"].setValue(rowData.categoryId);
    setTimeout(() => {
      this.tariffForm.controls["specificationId"].setValue(
        rowData.specificationId
      );
      this.tariffForm.controls["testId"].setValue(rowData.testId);
      this.cdr.markForCheck();
    });
    this.tariffForm.controls["basePrice"].setValue(rowData.basePrice);
    this.tariffForm.controls["additionalTestCharge"].setValue(
      rowData.additionalTestCharge
    );
    let tariffAddtional = rowData.testMaster.additionalName;
    switch (tariffAddtional) {
      case "supplyVoltage":
        this.tariffForm.controls["singlePhase"].setValue(rowData.singlePhase);
        this.tariffForm.controls["threePhase"].setValue(rowData.threePhase);
        this.tariffForm.controls["dc"].setValue(rowData.dc);
        this.emptyDivHideShow = true;
        break;
      case "cable":
        this.tariffForm.controls["cableCount"].setValue(rowData.cableCount);
        this.tariffForm.controls["cableAmount"].setValue(rowData.cableAmount);
        this.tariffForm.controls["perCable"].setValue(rowData.perCable);
        this.cableDivHideShow = true;
        break;
      case "freqency/strength":
        this.fieldFrequencyList = [];
        this.fieldFrequencyGrid
          ? this.getFieldFrequency(rowData.id)
          : setTimeout(() => this.getFieldFrequency(rowData.id), 1000);
        this.tariffId = rowData.id;
        this.fieldStrengthDivHideShow = true;
        break;
    }
    this.tariffGridRowData = rowData;
    this.tariffButtonName = "Update";
  }

  deleteGridData(rowData: any, gridName: any) {
    if (gridName == "Tariff") {
      this.deleteTariff(rowData);
    } else {
      this.deleteFieldFrequency(rowData);
    }
  }

  activeInactiveGridData(rowData, gridName) {
    if (gridName == "Tariff") {
      this.updateTariff(rowData);
    }
  }

  saveTariff() {
    let errorMessageList = this.fieldValidation();
    if (errorMessageList.length == 0) {
      this.tariffButtonDisabled = true;
      if (this.tariffGridRowData != null) {
        this.updateTariff(this.tariffGridRowData);
      } else {
        let url = "/master/tariff/addTariff";
        let testObj = this.testMasterList.filter(
          (obj) => obj.id == this.tariffForm.get("testId").value
        );
        let params = { ...this.tariffForm.value, status: "Active" };
        params = this.removeComma(params);
        if (testObj[0].additionalName == "freqency/strength") {
          this.fieldFrequencyGrid.stopEditing();
          let fieldStrengthList = [];
          this.fieldFrequencyGrid.forEachNode(function (node) {
            if (node.data.fieldStrength && node.data.frequencyRange && node.data.amount) {
              fieldStrengthList.push(node.data);
            }
          });
          params["fieldFrequencyDtl"] = fieldStrengthList;
        }
        this.tariffService.postAPI(url, params).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.cancelTariff();
              this.tariffGrid.purgeInfiniteCache();
              this.tariffService.openDialog(
                "Success",
                res.message,
                [],
                "success"
              );
              this.tabActive = true;
            } else {
              this.tariffButtonDisabled = false;
              this.tariffService.openDialog("Error", res.message, [], "danger");
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    } else {
      this.tariffService.openDialog("Warning", "", errorMessageList, "warning");
    }
  }

  updateTariff(rowData: any) {
    if (this.status == "edit") {
      let testObj = this.testMasterList.filter(
        (obj) => obj.id == this.tariffForm.get("testId").value
      );
      rowData["categoryId"] = this.tariffForm.get("categoryId").value;
      rowData["specificationId"] = this.tariffForm.get("specificationId").value;
      rowData["testId"] = this.tariffForm.get("testId").value;
      rowData["basePrice"] = this.tariffForm.get("basePrice").value;
      rowData["additionalTestCharge"] = this.tariffForm.get(
        "additionalTestCharge"
      ).value;
      rowData["singlePhase"] = this.tariffForm.get("singlePhase").value;
      rowData["threePhase"] = this.tariffForm.get("threePhase").value;
      rowData["dc"] = this.tariffForm.get("dc").value;
      rowData["cableCount"] = this.tariffForm.get("cableCount").value;
      rowData["cableAmount"] = this.tariffForm.get("cableAmount").value;
      rowData["perCable"] = this.tariffForm.get("perCable").value;
      rowData = this.removeComma(rowData);
      if (testObj[0].additionalName == "freqency/strength") {
        this.fieldFrequencyGrid.stopEditing();
        let fieldStrengthList = [];
        this.fieldFrequencyGrid.forEachNode(function (node) {
          if (node.data.fieldStrength && node.data.frequencyRange && node.data.amount) {
            fieldStrengthList.push(node.data);
          }
        });
        rowData["fieldFrequencyDtl"] = fieldStrengthList;
      }
    } else {
      rowData["status"] = rowData.status == "Active" ? "Inactive" : "Active";
    }
    let url = "/master/tariff/updateTariff";
    this.tariffService.putAPI(url, rowData).subscribe(
      (res: any) => {
        if (res.code == 200) {
          rowData["testMaster"] = res.data.testMaster;
          this.cancelTariff();
          this.tariffGrid.refreshCells({ suppressFlash: true });
          this.tariffService.openDialog("Success", res.message, [], "success");
          this.tabActive = true;
        } else {
          this.tariffButtonDisabled = false;
          this.tariffService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteTariff(rowData: any) {
    let url = "/master/tariff/deleteTariff";
    let params = { tariffId: rowData.id };
    this.tariffService.deleteAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cancelTariff();
          this.tariffGrid.purgeInfiniteCache();
          this.tariffService.openDialog("Success", res.message, [], "success");
        } else {
          this.tariffService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteFieldFrequency(rowData: any) {
    if (rowData.id) {
      let url = "/master/tariff/deleteFieldFrequency";
      let params = { fieldFrequencyId: rowData.id };
      this.tariffService.deleteAPI(url, params).subscribe(
        (res: any) => {
          if (res.code == 200) {
            this.getFieldFrequency(this.tariffId);
            this.tariffService.openDialog(
              "Success",
              res.message,
              [],
              "success"
            );
          } else {
            this.tariffService.openDialog("Error", res.message, [], "danger");
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.gridFunctionality("deleteRow");
    }
  }

  cancelTariff() {
    this.tariffButtonDisabled = false;
    this.tariffForm.reset();
    this.tariffButtonName = "Save";
    this.tariffGridRowData = null;
    this.specificationMasterList = [];
    this.testMasterList = [];
    this.fieldFrequencyGrid && this.fieldFrequencyGrid.setDatasource([]);
    this.emptyDivHideShow = false;
    this.cableDivHideShow = false;
    this.fieldStrengthDivHideShow = false;
  }

  getCategoryMaster() {
    let url = "/master/test/getCategoryMaster";
    this.tariffService.getAPI(url, {}).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.categoryMasterList = res.data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getSpecificationMaster(categoryId: any) {
    this.tariffForm.controls["specificationId"].setValue("");
    this.specificationMasterList = [];
    let url = "/master/test/getSpecificationMaster";
    let params = { categoryId: Number(categoryId) };
    this.tariffService.getAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.specificationMasterList = res.data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getTestMaster(specificationId: any) {
    this.tariffForm.controls["testId"].setValue("");
    this.testMasterList = [];
    let url = "/master/tariff/getTestMaster";
    let params = { specificationId: Number(specificationId) };
    this.tariffService.getAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.testMasterList = res.data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  doHideAndShow(testId: any) {
    this.emptyDivHideShow = false;
    this.cableDivHideShow = false;
    this.fieldStrengthDivHideShow = false;
    let testObj = this.testMasterList.filter((obj) => obj.id == testId);
    switch (testObj[0].additionalName) {
      case "supplyVoltage":
        this.emptyDivHideShow = true;
        break;
      case "cable":
        this.cableDivHideShow = true;
        break;
      case "freqency/strength":
        this.fieldStrengthDivHideShow = true;
        break;
    }
    this.tariffForm.controls["singlePhase"].setValue("0.00");
    this.tariffForm.controls["threePhase"].setValue("0.00");
    this.tariffForm.controls["dc"].setValue("0.00");
    this.tariffForm.controls["cableCount"].setValue("0.00");
    this.tariffForm.controls["cableAmount"].setValue("0.00");
    this.tariffForm.controls["perCable"].setValue("0.00");
  }

  getTariff() {
    if (this.tariffGrid) {
      let datSource = this.tariffService.gridPaginationGetRows(this.tariffGrid, this.cdr, "/master/tariff/getTariff", this.tariffList)
      this.tariffGrid.setDatasource(datSource);
    }
  }

  gridFunctionality(type) {
    if (type == "addRow") {
      let addRowFlag = true;
      this.fieldFrequencyList.forEach((obj, index) => {
        if ((!obj.id && obj.fieldStrength == null) || obj.fieldStrength == "") {
          this.tariffService.openDialog(
            "Error",
            "Row should not be empty!",
            [],
            "danger"
          );
          addRowFlag = false;
        }
      });
      if (addRowFlag) {
        const colDefs = this.fieldFrequencyGrid.getColumnDefs();
        const newRowObj = {};
        colDefs.forEach((eachColDef) => {
          const { field } = eachColDef;
          newRowObj[field] = null;
        });
        newRowObj["status"] = "Active";
        let newRow = [newRowObj];
        this.fieldFrequencyList = [...this.fieldFrequencyList, ...newRow];
      }
    } else if (type == "deleteRow") {
      this.fieldFrequencyList.forEach((obj, index) => {
        if (obj.fieldStrength == null || obj.fieldStrength == "") {
          this.fieldFrequencyList.splice(index, 1);
        }
      });
      this.fieldFrequencyList = [...this.fieldFrequencyList];
    }
  }

  getFieldFrequency(tariffId) {
    this.fieldFrequencyGrid.showLoadingOverlay();
    const url = "/master/tariff/getFieldFrequency?tariffId=" + tariffId;
    this.tariffService.getAPI(url, {}).subscribe((res: any) => {
      this.fieldFrequencyGrid.hideOverlay();
      if (res.data && res.data.length > 0) {
        this.fieldFrequencyList = res.data;
      } else {
        this.fieldFrequencyGrid.showNoRowsOverlay();
      }
      this.cdr.markForCheck();
    }, (err: any) => {
      this.cdr.markForCheck();
    });
  }

  fieldValidation() {
    let errorMessageList = [];
    let categoryId = this.tariffForm.get("categoryId").value;
    let specificationId = this.tariffForm.get("specificationId").value;
    let testId = this.tariffForm.get("testId").value;
    let basePrice = this.tariffForm.get("basePrice").value;
    let additionalTestCharge = this.tariffForm.get(
      "additionalTestCharge"
    ).value;
    let singlePhase = this.tariffForm.get("singlePhase").value;
    let threePhase = this.tariffForm.get("threePhase").value;
    let dc = this.tariffForm.get("dc").value;
    let cableCount = this.tariffForm.get("cableCount").value;
    let cableAmount = this.tariffForm.get("cableAmount").value;
    let perCable = this.tariffForm.get("perCable").value;
    let testObj = this.testMasterList.filter((obj) => obj.id == testId);

    if (categoryId == "" || categoryId == null || categoryId == "null") {
      errorMessageList.push("Category should not be empty");
    }
    if (
      specificationId == "" ||
      specificationId == null ||
      specificationId == "null"
    ) {
      errorMessageList.push("Specification should not be empty");
    }
    if (testId == "" || testId == null || testId == "null") {
      errorMessageList.push("Test Name should not be empty");
    }
    // if (Number(basePrice) == 0 || isNaN(basePrice)) {
    //   errorMessageList.push("Base Price should be number");
    // }
    // if (Number(additionalTestCharge) == 0 || isNaN(additionalTestCharge)) {
    //   errorMessageList.push("Addtional Test Charge should be number");
    // }
    // switch (testObj[0].additionalName) {
    //   case "supplyVoltage":
    //     if (Number(singlePhase) == 0 || isNaN(singlePhase)) {
    //       errorMessageList.push("Single Phase should be number");
    //     }
    //     if (Number(threePhase) == 0 || isNaN(threePhase)) {
    //       errorMessageList.push("Three Phase should be number");
    //     }
    //     if (Number(dc) == 0 || isNaN(dc)) {
    //       errorMessageList.push("DC should be number");
    //     }
    //     break;
    //   case "cable":
    //     if (Number(cableCount) == 0 || isNaN(cableCount)) {
    //       errorMessageList.push("Cable Count should be number");
    //     }
    //     if (Number(cableAmount) == 0 || isNaN(cableAmount)) {
    //       errorMessageList.push("Cable Amount should be number");
    //     }
    //     if (Number(perCable) == 0 || isNaN(perCable)) {
    //       errorMessageList.push("Per Cable should be number");
    //     }
    //     break;
    // }
    if (testObj[0].additionalName == "freqency/strength") {
      this.fieldFrequencyGrid.stopEditing();
      this.fieldFrequencyGrid.forEachNode(function (node, index) {
        let data = node.data;
        let fieldStrength = data.fieldStrength;
        let frequencyRange = data.frequencyRange;
        let amount = data.amount;
        if (fieldStrength || frequencyRange || amount) {
          if (Number(data.fieldStrength) == 0 || isNaN(data.fieldStrength)) {
            errorMessageList.push("Field Strength V/M should be number row - " + (index + 1));
          }
          if (data.frequencyRange == "" || data.frequencyRange == null || data.frequencyRange == "null") {
            errorMessageList.push("Frequency Range should not be empty row - " + (index + 1));
          }
          if (Number(data.amount) == 0 || isNaN(data.amount)) {
            errorMessageList.push("Amount should be number row - " + (index + 1));
          }
        }
      });
    }
    return errorMessageList;
  }

  removeComma(data) {
    let testId = this.tariffForm.get("testId").value;
    let testObj = this.testMasterList.filter((obj) => obj.id == testId);
    data["basePrice"] = data["basePrice"]
      ? data["basePrice"].toString().replace(/,/g, "")
      : "0.00";
    data["additionalTestCharge"] = data["additionalTestCharge"]
      ? data["additionalTestCharge"].toString().replace(/,/g, "")
      : "0.00";
    switch (testObj[0].additionalName) {
      case "supplyVoltage":
        data["singlePhase"] = data["singlePhase"]
          ? data["singlePhase"].toString().replace(/,/g, "")
          : "0.00";
        data["threePhase"] = data["threePhase"]
          ? data["threePhase"].toString().replace(/,/g, "")
          : "0.00";
        data["dc"] = data["dc"]
          ? data["dc"].toString().replace(/,/g, "")
          : "0.00";
        break;
      case "cable":
        data["cableCount"] = data["cableCount"]
          ? data["cableCount"].toString().replace(/,/g, "")
          : "0.00";
        data["cableAmount"] = data["cableAmount"]
          ? data["cableAmount"].toString().replace(/,/g, "")
          : "0.00";
        data["perCable"] = data["perCable"]
          ? data["perCable"].toString().replace(/,/g, "")
          : "0.00";
    }
    return data;
  }

  searchtariff() {
    this.tariffGrid["searchText"] = this.searchText;
    this.tariffGrid.purgeInfiniteCache();
  }

  updateSearchText() {
    if (this.searchText == '') {
      this.searchtariff()
    }
  }
}