import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { ColDef } from "ag-grid-community";
import { CommonService } from "../../common.service";
import { GridActionsComponent } from "../../common/grid-actions/grid-actions.component";
import { WorksheetSettings } from "../worksheet/WorksheetSettings";

@Component({
  selector: "ngx-standard-master",
  templateUrl: "./standard-master.component.html",
  styleUrls: ["./standard-master.component.scss"],
})
export class StandardMasterComponent implements OnInit {
  categoryMasterList: any = [];
  categoryList: any = [];
  specificationMasterList: any = [];
  specificationList: any = [];
  testList: any = [];
  fieldSize: any = "small";
  testGrid: any;
  categoryGrid: any;
  specificationGrid: any;
  categoryButtonName: string = "Save";
  specificationButtonName: string = "Save";
  testButtonName: string = "Save";
  categoryGridRowData: any;
  specificationGridRowData: any;
  testGridRowData: any;
  categoryForm: UntypedFormGroup;
  specificationForm: UntypedFormGroup;
  testForm: UntypedFormGroup;
  categoryButtonDisabled: boolean = false;
  specificationButtonDisabled: boolean = false;
  testButtonDisabled: boolean = false;
  status: any;
  WorksheetSettingsList = [];
  btnPermission: any = {};
  WorksheetSettingData;
  searchtestText: string;
  searchCatText: string;
  searchSpecText: string;

  //Test Master Table Definition
  testColumnDefs: ColDef[] = [
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60, suppressMovable: true,
    },
    {
      headerName: "Category",
      field: "specificationMaster.categoryMaster.name",
      width: 150,
      minWidth: 100,
      maxWidth: 180, suppressMovable: true,
    },
    {
      headerName: "Specification",
      field: "specificationMaster.name",
      width: 150,
      minWidth: 100,
      maxWidth: 180, suppressMovable: true,
    },
    { headerName: "Test Name", field: "testName", width: 200, minWidth: 100 },
    {
      headerName: "Status",
      field: "status",
      width: 120,
      minWidth: 60,
      maxWidth: 150, suppressMovable: true,
    },
    {
      headerName: "Actions",
      cellRenderer: GridActionsComponent,
      cellRendererParams: {
        onClick: (e, type) => e.rowData && this.actions(e, type, "Test"),
        button: ["edit", "delete", "enable"],
        buttonPer: this.standardService.getPermission(Number(localStorage.getItem('pageId')))
      },
      pinned: "right",
      cellClass: "ag-pinned-right-cols-container",
      width: 110,
      minWidth: 110,
      maxWidth: 110, suppressMovable: true,
    },
  ];
  testDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  //Specification Table Definition
  specColumnDefs: ColDef[] = [
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60, suppressMovable: true,
    },
    {
      headerName: "Category",
      field: "categoryMaster.name",
      width: 150,
      minWidth: 100,
      maxWidth: 180, suppressMovable: true,
    },
    { headerName: "Specification", field: "name", width: 200, minWidth: 100, suppressMovable: true },
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
        onClick: (e, type) =>
          e.rowData && this.actions(e, type, "Specification"),
        button: ["edit", "delete", "enable"],
        buttonPer: this.standardService.getPermission(Number(localStorage.getItem('pageId')))
      },
      pinned: "right",
      cellClass: "ag-pinned-right-cols-container",
      width: 110,
      minWidth: 110,
      maxWidth: 110,
    },
  ];
  specDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  //Category Table Definition
  categoryColumnDefs: ColDef[] = [
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60, suppressMovable: true,
      maxWidth: 60,
    },
    {
      headerName: "Category",
      field: "name",
      width: 150,
      minWidth: 100, suppressMovable: true,
      maxWidth: 180,
    },
    {
      headerName: "Description",
      field: "categoryDescription",
      width: 200,
      minWidth: 100, suppressMovable: true,
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
        onClick: (e, type) => e.rowData && this.actions(e, type, "Category"),
        button: ["edit", "delete", "enable"],
        buttonPer: this.standardService.getPermission(Number(localStorage.getItem('pageId')))
      },
      pinned: "right",
      cellClass: "ag-pinned-right-cols-container",
      width: 110,
      minWidth: 110,
      maxWidth: 110,
    },
  ];
  categoryDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  //Grid Options
  gridOptions = {
    pagination: true,
    rowModelType: "infinite",
    // paginationPageSize: 6,
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    // cacheBlockSize: 100,
    rowSelection: "single",
    animateRows: true,
    domLayout: "autoHeight",
    infiniteInitialRowCount: 0,
  };

  catGridOptions = {
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

  specGridOptions = {
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
  actions(e, type, gridName) {
    let rowData = JSON.parse(JSON.stringify(e.rowData));
    if (type == "edit") {
      this.status = type;
      this.updateGridData(e.rowData, gridName);
    } else if (type == "delete") {
      this.deleteGridData(rowData, gridName);
    } else {
      this.status = type;
      this.activeInactiveGridData(e.rowData, gridName);
    }
  }

  ngOnInit(): void {
    this.btnPermission = this.standardService.getPermission(Number(localStorage.getItem('pageId')))
    this.categoryForm = this.fb.group({
      categoryName: ["", Validators.required],
      categoryDescription: ["", Validators.required],
    });
    this.specificationForm = this.fb.group({
      categoryId: ["", Validators.required],
      specificationName: ["", Validators.required],
    });
    this.testForm = this.fb.group({
      testCategoryId: ["", Validators.required],
      specificationId: ["", Validators.required],
      testName: ["", Validators.required],
      additionalName: ["", Validators.required],
      reportHeader: ["", Validators.required],
      workSheetId: ["", Validators.required]
    });
    this.getCategoryMaster();
    this.WorksheetSettingData = WorksheetSettings;
    for (var key in WorksheetSettings) {
      if (WorksheetSettings.hasOwnProperty(key)) {
        this.WorksheetSettingsList.push(key)
      }
    }
  }

  constructor(
    private standardService: CommonService,
    private cdr: ChangeDetectorRef,
    private fb: UntypedFormBuilder
  ) {
    standardService.setGridDynamicRowCnt(this.gridOptions, 500);
    standardService.setGridDynamicRowCnt(this.catGridOptions, 500);
    standardService.setGridDynamicRowCnt(this.specGridOptions, 500);
  }

  onTestGridReady(e) {
    this.testGrid = e.api;
  }

  onCategoryGridReady(e) {
    this.categoryGrid = e.api;
  }

  onSpecificationGridReady(e) {
    this.specificationGrid = e.api;
  }

  getActiveTab(activeTab: any) {
    switch (activeTab.tabTitle) {
      case "Category":
        this.categoryGrid.infiniteRowModel.datasource == undefined ? this.getCategory() : "";
        // this.categoryList.length == 0 ? this.getCategory() : "";
        break;
      case "Specification":
        this.specificationGrid.infiniteRowModel.datasource == undefined ? this.getSpecification() : "";
        // this.specificationList.length == 0 ? this.getSpecification() : "";
        break;
      case "Test":
        this.testGrid.infiniteRowModel.datasource == undefined ? this.getTest() : "";
        // this.testList.length == 0 ? this.getTest() : "";
        break;
    }
  }

  updateGridData(rowData: any, gridName: any) {
    switch (gridName) {
      case "Category":
        this.categoryForm.controls["categoryName"].setValue(rowData.name);
        this.categoryForm.controls["categoryDescription"].setValue(
          rowData.categoryDescription
        );
        this.categoryGridRowData = rowData;
        this.categoryButtonName = "Update";
        break;
      case "Specification":
        this.specificationForm.controls["categoryId"].setValue(
          rowData.categoryId
        );
        this.specificationForm.controls["specificationName"].setValue(
          rowData.name
        );
        this.specificationGridRowData = rowData;
        this.specificationButtonName = "Update";
        break;
      case "Test":
        this.getSpecificationMaster(rowData.categoryId);
        this.specificationMasterList = [rowData.specificationMaster];
        // this.testForm.controls['testCategoryId'].setValue(rowData.categoryId);
        setTimeout(() => {
          this.testForm.controls["testCategoryId"].setValue(rowData.categoryId);
          this.testForm.controls["specificationId"].setValue(
            rowData.specificationId
          );
          this.cdr.markForCheck();
        });
        this.testForm.controls["testName"].setValue(rowData.testName);
        this.testForm.controls["additionalName"].setValue(
          rowData.additionalName
        );
        this.testForm.controls["reportHeader"].setValue(rowData.reportHeader);
        this.testForm.controls["workSheetId"].setValue(rowData.workSheetId);
        this.testGridRowData = rowData;
        this.testButtonName = "Update";
        break;
    }
  }

  deleteGridData(rowData: any, gridName: any) {
    switch (gridName) {
      case "Category":
        this.deleteCategory(rowData);
        break;
      case "Specification":
        this.deleteSpecification(rowData);
        break;
      case "Test":
        this.deleteTest(rowData);
        break;
    }
  }

  activeInactiveGridData(rowData, gridName) {
    switch (gridName) {
      case "Category":
        this.updateCategory(rowData);
        break;
      case "Specification":
        this.updateSpecification(rowData);
        break;
      case "Test":
        this.updateTest(rowData);
        break;
    }
  }

  saveCategory() {
    let errorMessageList = this.fieldValidation("Category");
    if (errorMessageList.length == 0) {
      this.categoryButtonDisabled = true;
      if (this.categoryGridRowData != null) {
        this.updateCategory(this.categoryGridRowData);
      } else {
        let url = "/master/test/addCategory";
        let params = {
          name: this.categoryForm.get("categoryName").value,
          categoryDescription: this.categoryForm.get("categoryDescription")
            .value,
          status: "Active",
        };
        this.standardService.postAPI(url, params).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.cancelCategory();
              this.getCategoryMaster();
              this.categoryGrid.purgeInfiniteCache();
              this.standardService.openDialog(
                "Success",
                res.message,
                [],
                "success"
              );
            } else {
              this.categoryButtonDisabled = false;
              this.standardService.openDialog(
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
      this.standardService.openDialog(
        "Warning",
        "",
        errorMessageList,
        "warning"
      );
    }
  }

  updateCategory(rowData: any) {
    if (this.status == "edit") {
      rowData["name"] = this.categoryForm.get("categoryName").value;
      rowData["categoryDescription"] = this.categoryForm.get(
        "categoryDescription"
      ).value;
    } else {
      rowData["status"] = rowData.status == "Active" ? "Inactive" : "Active";
    }
    let url = "/master/test/updateCategory";
    this.standardService.putAPI(url, rowData).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cancelCategory();
          this.getCategoryMaster();
          this.categoryGrid.refreshCells({ suppressFlash: true });
          this.standardService.openDialog(
            "Success",
            res.message,
            [],
            "success"
          );
        } else {
          this.categoryButtonDisabled = false;
          this.standardService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteCategory(rowData: any) {
    let url = "/master/test/deleteCategory";
    let params = { categoryId: rowData.id };
    this.standardService.deleteAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cancelCategory();
          this.categoryGrid.purgeInfiniteCache();
          this.standardService.openDialog(
            "Success",
            res.message,
            [],
            "success"
          );
        } else {
          this.standardService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cancelCategory() {
    this.categoryButtonDisabled = false;
    this.categoryForm.reset();
    this.categoryButtonName = "Save";
    this.categoryGridRowData = null;
  }

  getCategoryMaster() {
    let url = "/master/test/getCategoryMaster";
    this.standardService.getAPI(url, {}).subscribe(
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

  getCategory() {
    if (this.categoryGrid) {
      let datSource = this.standardService.gridPaginationGetRows(this.categoryGrid, this.cdr, "/master/test/getCategory", this.categoryList)
      this.categoryGrid.setDatasource(datSource);
    }
  }

  saveSpecification() {
    let errorMessageList = this.fieldValidation("Specification");
    if (errorMessageList.length == 0) {
      this.specificationButtonDisabled = true;
      if (this.specificationGridRowData != null) {
        this.updateSpecification(this.specificationGridRowData);
      } else {
        let url = "/master/test/addSpecification";
        let params = {
          categoryId: Number(this.specificationForm.get("categoryId").value),
          name: this.specificationForm.get("specificationName").value,
          status: "Active",
        };
        this.standardService.postAPI(url, params).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.cancelSpecification();
              this.specificationGrid.purgeInfiniteCache();
              this.standardService.openDialog(
                "Success",
                res.message,
                [],
                "success"
              );
            } else {
              this.specificationButtonDisabled = false;
              this.standardService.openDialog(
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
      this.standardService.openDialog(
        "Warning",
        "",
        errorMessageList,
        "warning"
      );
    }
  }

  updateSpecification(rowData: any) {
    if (this.status == "edit") {
      rowData["categoryId"] = this.specificationForm.get("categoryId").value;
      rowData["name"] = this.specificationForm.get("specificationName").value;
    } else {
      rowData["status"] = rowData.status == "Active" ? "Inactive" : "Active";
    }
    let url = "/master/test/updateSpecification";
    this.standardService.putAPI(url, rowData).subscribe(
      (res: any) => {
        if (res.code == 200) {
          rowData["categoryMaster"] = res.data.categoryMaster;
          this.cancelSpecification();
          this.specificationGrid.refreshCells({ suppressFlash: true });
          this.standardService.openDialog(
            "Success",
            res.message,
            [],
            "success"
          );
        } else {
          this.specificationButtonDisabled = false;
          this.standardService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteSpecification(rowData: any) {
    let url = "/master/test/deleteSpecification";
    let params = { specificationId: rowData.id };
    this.standardService.deleteAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cancelSpecification();
          this.specificationGrid.purgeInfiniteCache();
          this.standardService.openDialog(
            "Success",
            res.message,
            [],
            "success"
          );
        } else {
          this.standardService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cancelSpecification() {
    this.specificationButtonDisabled = false;
    this.specificationForm.reset();
    this.specificationButtonName = "Save";
    this.specificationGridRowData = null;
  }

  getSpecificationMaster(testCategoryId: any) {
    this.testForm.controls["specificationId"].setValue("");
    this.specificationMasterList = [];
    let url = "/master/test/getSpecificationMaster";
    let params = { categoryId: Number(testCategoryId) };
    this.standardService.getAPI(url, params).subscribe(
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

  getSpecification() {
    if (this.specificationGrid) {
      let datSource = this.standardService.gridPaginationGetRows(this.specificationGrid, this.cdr, "/master/test/getSpecification", this.specificationList)
      this.specificationGrid.setDatasource(datSource);
    }
  }

  saveTest() {
    let errorMessageList = this.fieldValidation("Test");
    if (errorMessageList.length == 0) {
      this.testButtonDisabled = true;
      if (this.testGridRowData != null) {
        this.updateTest(this.testGridRowData);
      } else {
        let url = "/master/test/addTest";
        let params = {
          categoryId: Number(this.testForm.get("testCategoryId").value),
          specificationId: Number(this.testForm.get("specificationId").value),
          testName: this.testForm.get("testName").value,
          additionalName: this.testForm.get("additionalName").value,
          reportHeader: this.testForm.get("reportHeader").value,
          workSheetId: this.testForm.get("workSheetId").value,
          status: "Active",
        };
        this.standardService.postAPI(url, params).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.cancelTest();
              this.testGrid.purgeInfiniteCache();
              this.standardService.openDialog(
                "Success",
                res.message,
                [],
                "success"
              );
            } else {
              this.testButtonDisabled = false;
              this.standardService.openDialog(
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
      this.standardService.openDialog(
        "Warning",
        "",
        errorMessageList,
        "warning"
      );
    }
  }

  updateTest(rowData: any) {
    if (this.status == "edit") {
      rowData["categoryId"] = this.testForm.get("testCategoryId").value;
      rowData["specificationId"] = this.testForm.get("specificationId").value;
      rowData["testName"] = this.testForm.get("testName").value;
      rowData["additionalName"] = this.testForm.get("additionalName").value;
      rowData["reportHeader"] = this.testForm.get("reportHeader").value;
      rowData["workSheetId"] = this.testForm.get("workSheetId").value;
    } else {
      rowData["status"] = rowData.status == "Active" ? "Inactive" : "Active";
    }
    let url = "/master/test/updateTest";
    this.standardService.putAPI(url, rowData).subscribe(
      (res: any) => {
        if (res.code == 200) {
          rowData["specificationMaster"] = res.data.specificationMaster;
          this.cancelTest();
          this.testGrid.refreshCells({ suppressFlash: true });
          this.standardService.openDialog(
            "Success",
            res.message,
            [],
            "success"
          );
        } else {
          this.testButtonDisabled = false;
          this.standardService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteTest(rowData: any) {
    let url = "/master/test/deleteTest";
    let params = { testId: rowData.id };
    this.standardService.deleteAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cancelTest();
          this.testGrid.purgeInfiniteCache();
          this.standardService.openDialog(
            "Success",
            res.message,
            [],
            "success"
          );
        } else {
          this.standardService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cancelTest() {
    this.testButtonDisabled = false;
    this.testForm.reset();
    this.testButtonName = "Save";
    this.testGridRowData = null;
    this.specificationList = [];
    this.specificationMasterList = [];
  }

  getTest() {
    if (this.testGrid) {
      let datSource = this.standardService.gridPaginationGetRows(this.testGrid, this.cdr, "/master/test/getTest", this.testList)
      this.testGrid.setDatasource(datSource);
    }
  }

  fieldValidation(tabName) {
    let errorMessageList = [];
    let categoryName = this.categoryForm.get("categoryName").value;
    let categoryDescription = this.categoryForm.get(
      "categoryDescription"
    ).value;
    let categoryId = this.specificationForm.get("categoryId").value;
    let specificationName =
      this.specificationForm.get("specificationName").value;
    let testCategoryId = this.testForm.get("testCategoryId").value;
    let specificationId = this.testForm.get("specificationId").value;
    let testName = this.testForm.get("testName").value;
    let reportHeader = this.testForm.get("reportHeader").value;
    switch (tabName) {
      case "Category":
        if (
          categoryName == "" ||
          categoryName == null ||
          categoryName == "null"
        ) {
          errorMessageList.push("Category Name should not be empty");
        }
        if (
          categoryDescription == "" ||
          categoryDescription == null ||
          categoryDescription == "null"
        ) {
          errorMessageList.push("Description should not be empty");
        }
        return errorMessageList;
      case "Specification":
        if (categoryId == "" || categoryId == null || categoryId == "null") {
          errorMessageList.push("Category should not be empty");
        }
        if (
          specificationName == "" ||
          specificationName == null ||
          specificationName == "null"
        ) {
          errorMessageList.push("Specification should not be empty");
        }
        return errorMessageList;
      case "Test":
        if (
          testCategoryId == "" ||
          testCategoryId == null ||
          testCategoryId == "null"
        ) {
          errorMessageList.push("Category should not be empty");
        }
        if (
          specificationId == "" ||
          specificationId == null ||
          specificationId == "null"
        ) {
          errorMessageList.push("Specification should not be empty");
        }
        if (testName == "" || testName == null || testName == "null") {
          errorMessageList.push("Test Name should not be empty");
        }
        if (
          reportHeader == "" ||
          reportHeader == null ||
          reportHeader == "null"
        ) {
          errorMessageList.push("Report Header should not be empty");
        }
        return errorMessageList;
    }
  }

  searchTest() {
    this.testGrid["searchText"] = this.searchtestText;
    this.testGrid.purgeInfiniteCache();
  }
  updateTestText() {
    if (this.searchtestText == '') {
      this.searchTest()
    }
  }
  
  searchCat() {
    this.categoryGrid["searchText"] = this.searchCatText;
    this.categoryGrid.purgeInfiniteCache();
  }

  updateCatText() {
    if (this.searchCatText == '') {
      this.searchCat()
    }
  }

  searchSpec() {
    this.specificationGrid["searchText"] = this.searchSpecText;
    this.specificationGrid.purgeInfiniteCache();
  }

  updateSpecText() {
    if (this.searchSpecText == '') {
      this.searchSpec()
    }
  }

}