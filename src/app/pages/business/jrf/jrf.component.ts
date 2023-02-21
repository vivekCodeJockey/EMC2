import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ColDef } from 'ag-grid-community';
import { CommonService } from '../../common.service';
import { NbDialogService, NbWindowControlButtonsConfig, NbWindowService, NbStepperComponent } from '@nebular/theme';
import { nvtoastrService } from '../../../@theme/service/toastr/toastr.service';
import { GridDropdownComponent } from '../../common/grid-dropdown/grid-dropdown.component';
import { BehaviorSubject } from 'rxjs';
import { Router, } from '@angular/router';
import * as moment from 'moment';
import { HttpHeaders } from '@angular/common/http';
import { mainViewComponent } from '../mainview/mainview.component';
import { GridActionsComponent } from '../../common/grid-actions/grid-actions.component';

@Component({
  selector: 'ngx-jrf',
  templateUrl: './jrf.component.html',
  styleUrls: ['./jrf.component.scss']
})
export class JrfComponent implements OnInit {
  loading = false;
  saveInProgress = false;
  shortDocFileName = "";
  descDocFileName = "";
  shortDocFileToUpload: File | null = null;
  performaDocFileToUpload: File | null = null;
  specificationObservable = new BehaviorSubject<any>(null);
  jrfForm: UntypedFormGroup;
  jrfSeqNumber = "";
  jrfRefNumber = "";
  jrfDate = "";
  existingJrfId: any;
  showButton = true;
  fieldSize: any = "small"
  newJrfForm: boolean = true;
  parameterGridApi: any;
  testGridApi: any;
  serialNoList = []
  specificationList = [];
  units = [
    "", "MHZ", "GHZ"
  ]
  baseUrl = "/jrf"

  @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
  @ViewChild('stepper') myStepper: NbStepperComponent;

  paramColumnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', hide: true },
    { headerName: "EUT Serial No", field: 'serialNo', colId: "serialNo", singleClickEdit: true, editable: true, suppressMovable: true, cellClass: "bg-Info", width: 200, minWidth: 90, maxWidth: 240 },
    {
      headerName: "Voltage Type", field: 'supplyVolt', colId: "VoltageType", singleClickEdit: true, editable: true, suppressMovable: true, width: 100, minWidth: 90, maxWidth: 120,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ["Single Phase", "Three Phase", "DC"],
      }
    },
    {
      headerName: "Voltage (V)", field: 'supplyDcValue', suppressMovable: true, colId: "voltage", width: 90, minWidth: 90, maxWidth: 90,
      valueSetter: params => {
        let nVal = params.newValue;
        params.data.supplyDcValue = ((nVal != null) && (nVal !== '') && !isNaN(Number(nVal.toString()))) ? nVal : '';
        return ((nVal != null) && (nVal !== '') && !isNaN(Number(nVal.toString())));
      },
      valueGetter: params => {
        // return (params.data["supplyVolt"] === "Single Phase")?213:((params.data["supplyVolt"] === "Three Phase")?415:params.data.supplyDcValue)
        return (params.data["supplyVolt"] === "Single Phase")?230:params.data.supplyDcValue
      },
      editable: (params) => { return params.data["supplyVolt"] != "Single Phase" },
      singleClickEdit: true,
    },
    { headerName: "Operating Frequency", field: 'operatingFreq', suppressMovable: true, colId: "opFrequency", singleClickEdit: true, editable: true, width: 150, minWidth: 90, maxWidth: 180 },
    { headerName: "Current Rating(I/p & Load)", field: 'currentRating', suppressMovable: true, colId: "cRating", singleClickEdit: true, editable: true, width: 180 },
    { headerName: "Power Ports", field: 'noOfPowerPorts', suppressMovable: true, colId: "powerPorts", singleClickEdit: true, editable: true, width: 90, minWidth: 90, maxWidth: 90 },
    { headerName: "Signal Lines", field: 'noOfSignalLines', suppressMovable: true, colId: "signalLines", singleClickEdit: true, editable: true, width: 90, minWidth: 90, maxWidth: 90 },
    { headerName: "Signal Connector type", field: 'connectorType', suppressMovable: true, colId: "connectorType", singleClickEdit: true, editable: true, width: 120, minWidth: 90, maxWidth: 150 },
    {
      headerName: 'Action', suppressMovable: true,
      cellRenderer: params => { return `<button class="jrfDelCls" data-action-type="clear" type="button" ><nb-icon Class="ion-ios-trash" data-action-type="clear" style="line-height: 15px;"></nb-icon></button>` },
      width: 70, minWidth: 70, maxWidth: 70
    }
  ];
  paramrowData = [];
  paramDefaultColDef = { flex: 1, theme: "ag-theme-balham" };
  scope: any = this;
  testColumnDefs: ColDef[];
  testrowData = [];
  btnPermission: any;
  testDefaultColDef = { flex: 1, theme: "ag-theme-balham" };
  internalJrf=false;

  constructor(private parent: mainViewComponent, private jrfService: CommonService, private fb: UntypedFormBuilder, private dialogService: NbDialogService, private toastrService: nvtoastrService, private windowService: NbWindowService) {
    if (parent && parent.jrfHiddenId != 0) {
      this.existingJrfId = this.parent.jrfHiddenId;
      this.showButton = (!(this.parent.jrfObj['jrfStatus'] == "COMPLETED"))
      this.internalJrf=this.parent.jrfObj['jrfType']=='internal'
    }else{
      this.internalJrf=jrfService.isAppInternal()
    }
  }

  ngOnInit(): void {
    this.btnPermission = this.jrfService.getPermission(Number(1))
    this.saveInProgress = false;
    this.formInit();
    let $scope = this;
    this.testColumnDefs = [
      { headerName: 'ID', field: 'id', hide: true },
      { headerName: 'ID', field: 'testId', hide: true },
      { headerName: 'ID', field: 'specificationId', hide: true },
      {
        headerName: "SL No",
        valueGetter: "node.rowIndex + 1",
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        suppressMovable: true,
      },
      {
        headerName: "EUT Serial No", field: 'serialNo', colId: "serialNo", singleClickEdit: true, editable: true, width: 100, minWidth: 90, maxWidth: 240,
        cellEditor: GridDropdownComponent,
        cellEditorParams: {
          options: [],
          labelKey: 'label',
          valueKey: 'value',
          loadInitData: function (row) {
            return $scope.serialNoList
          },
          getSelected: function (param) {
            return $scope.getSlNoComboSelected(param);
          },
        }, suppressMovable: true,
      },
      {
        headerName: "Test Standard", field: 'specificationName', colId: "tStandard", singleClickEdit: true, editable: true, width: 200, minWidth: 90, suppressMovable: true,
        cellEditor: GridDropdownComponent,
        cellEditorParams: {
          options: [],
          optionObs: $scope.specificationObservable,
          labelKey: 'specificationName',
          valueKey: 'specificationId',
          valueNode: 'specificationId',
          onChange: function (param) {
            param.rowData.testName = "";
            param.rowData.testId = "";
          },
          loadInitData: function (row) {
            return $scope.getSpecifiCombo(row);
          },
          getSelected: function (param) {
            return $scope.getSpecifiComboSelected(param);
          }
        }
      },
      {
        headerName: "Test Name", field: 'testName', colId: "tName", suppressMovable: true, width: 200, minWidth: 90, singleClickEdit: true, editable: true, maxWidth: 240,
        cellEditor: GridDropdownComponent,
        cellEditorParams: {
          options: [],
          labelKey: 'testName',
          valueKey: 'testId',
          valueNode: 'testId',
          loadInitData: function (row) {
            return $scope.getTestCombo(row);
          },
          getSelected: function (param) {
            return $scope.getTestComboSelected(param);
          },
          onChange: function (param) {
            param.rowData.additionalName = param.event.additionalName;
            $scope.testGridApi.redrawRows();
          },
        }
      },
      { headerName: "No. of Times", field: 'noOfTimes', colId: "nTTest", suppressMovable: true, singleClickEdit: true, editable: true, width: 60, minWidth: 40, maxWidth: 100 },
      {
        headerName: 'Additional',
        field: "addButton"
        , width: 90, minWidth: 90, maxWidth: 90, suppressMovable: true,
        cellRenderer: params => {
          return '<button class="jrfAddCls" data-action-type="add" type="button" ' + (params.data.additionalName && (params.data.additionalName === 'freqency/strength' || params.data.additionalName === 'cable') ? "" : "disabled") + ' >ADD</button>';
        }
      }
    ];
    this.loading = true;
    this.getSpecificationsAPI().then((obj) => {
      if (this.existingJrfId) {
        this.loadExistingDataAPI(this.existingJrfId);
      } else {
        this.loading = false;
      }
    })
  }
  eutQtyChange(param: any) {
    let qty = Number(param.target.value);
    let qtyArry = [];
    for (let i = 0; i < qty; i++) {
      qtyArry.push({});
    }
    this.parameterGridApi.setRowData(qtyArry);
  }
  onParametersGridRowClicked(e: any, type?: any) {
    if (e.event.target !== undefined) {
      let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "clear":
          {
            e.data.serialNo = "";
            e.data.supplyVolt = "";
            e.data.supplyDcValue = "";
            e.data.operatingFreq = "";
            e.data.currentRating = "";
            e.data.noOfPowerPorts = "";
            e.data.noOfSignalLines = "";
            e.data.connectorType = "";
            e.api.applyTransaction({ update: [e.data] });
          }
      }
    }
  }
  onTestGridRowClicked(e: any) {
    if (e.event.target !== undefined) {
      let actionType = e.event.target.getAttribute("data-action-type");
      switch (actionType) {
        case "add":
          {
            const buttonsConfig: NbWindowControlButtonsConfig = {
              minimize: false,
              maximize: false,
              fullScreen: false,
              close: true
            };
            this.windowService.open(
              this.contentTemplate,
              { title: 'Test Additional Details', context: { rowData: e.data, units: this.units }, buttons: buttonsConfig },
            );
          }
      }
    }
  }
  onCellValueChangedParameter(param: any) {
    if (param.colDef.field === "serialNo") {
      let serialNoList = [];
      this.parameterGridApi.forEachNodeAfterFilter((rowNode) => {
        let serialNo = rowNode.data.serialNo;
        if (serialNo) {
          serialNoList.push({ label: serialNo, value: serialNo });
        }
      });
      this.serialNoList = serialNoList;
    }
  }
  onParametersGridReady(params: any) {
    this.parameterGridApi = params.api;
  }
  onTestGridReady(params: any) {
    this.testGridApi = params.api;
  }
  formInit() {
    this.jrfForm = this.fb.group({
      id: [null],
      jrfSeqNo: [''],
      jrfRefNo: [''],
      eutName: [''],
      manufacturer: [''],
      modelNo: [''],
      nameOfSoftware: [''],
      softwareVerNo: [''],
      typeEutMount: [''],
      weight: [''],
      length: [''],
      width: [''],
      height: [''],
      eutQty: [''],
      accDtl: [''],
      standardType: [''],
      mlStdType: [''],
      mlStdSubType: [''],
      typeOfTest: [''],
      eutShortNote: [''],
      eutDescDocId: [null],
      eutDescDocName: [''],
      eutShortDocId: [null],
      eutShortDocName: [''],
      eutDesc: [''],
      custWitness: [''],
      hardCopy: [''],
      softCopy: [''],
      preCompTestData: [''],
      deviationMethod: [''],
      deviationMethodDesc: [''],
      accCriteria: [''],
      accCriteriaDesc: [''],
      statementConform: [''],
      statementConformOthDesc: [''],
      othReq: [''],
      testingRequested:[''],
      projectCode:[''],
      task:[''],
      qapDocRefNo:[''],
      atpDocRefNo:[''],
      noOfLRUsIntegrated:[''],
      emiOrEmc:[''],
      shielded:[''],
      jrfType:[this.internalJrf?'internal':'external']
    });
  }
  addTestRow() {
    this.testGridApi.applyTransaction({ add: [{ noOfTimes: 1 }] });
  }

  getSpecificationsAPI() {
    return new Promise((resolve, reject) => {
      this.jrfService.getAPI(this.baseUrl + "/specification", { params: {} }).subscribe((res: any) => {
        if (res.code == 200) {
          this.specificationList = res.data;
          this.specificationObservable.next(this.specificationList);
          resolve("");
        }
      }, (err) => {
        console.log(err);
        reject("");
      });
    });
  }
  getSpecifications() {
    return this.specificationList.map(obj => obj.specificationName);
  }
  save(isSaveSend) {
    this.saveInProgress = true;
    this.loading = true;
    let responseData = JSON.parse(JSON.stringify(this.jrfForm.value));
    let parameterGridData: Array<any> = [];
    let testGridData: Array<any> = [];
    this.testGridApi.forEachNode(function (node) {
      testGridData.push(JSON.parse(JSON.stringify(node.data)));
    });
    this.parameterGridApi.forEachNode(function (node) {
      let rowData = JSON.parse(JSON.stringify(node.data));
      if (rowData.serialNo) {
        rowData.jrfTestDtlList = testGridData.filter(obj => obj.serialNo == rowData.serialNo);
      }
      parameterGridData.push(rowData);
    });
    responseData.jrfTestInfoList = parameterGridData;
    let isError = this.validateJRF(isSaveSend, responseData);
    if (isError) {
      this.saveInProgress = false;
      this.loading = false;
      return;
    }
    // responseData.mlStdSubType = responseData.mlStdSubType && Array.isArray(responseData.mlStdSubType) ? responseData.mlStdSubType.join(",") : "";
    const formData: FormData = new FormData();
    formData.append("jrfData", JSON.stringify(responseData));
    formData.append("shortNoteDoc", this.shortDocFileToUpload);
    formData.append("perfoFile", this.performaDocFileToUpload);
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');

    this.jrfService.postAPI(this.baseUrl + (isSaveSend ? "/saveSend" : "/save"), formData, { headers: headers }).subscribe((res: any) => {
      if (res.success) {
        this.populatePageData(res.data);
        this.jrfService.openDialog("JRF", "Job Request " + (isSaveSend ? "Saved & Sent" : "Saved") + " Successfully!", [], "success");
        // this.toastrService.showToast("success", "JRF", "Job Request Saved Successfully!", "BOTTOM_RIGHT");
        this.showButton = (!isSaveSend)
      }
      else {
        this.jrfService.openDialog('Error', res.message, "", "danger")
      }
      this.loading = false;
      this.saveInProgress = false;
    }, (err) => {
      console.log(err);
      this.loading = false;
      this.saveInProgress = false;
    });
  }
  loadExistingDataAPI(jrfId) {
    this.jrfService.getAPI(this.baseUrl + "/get", { jrfId: jrfId }).subscribe((res: any) => {
      if (res.code == 200) {
        this.populatePageData(res.data);
      }
    }, (err) => {
      console.log(err);
    });
  }
  populatePageData(jrfObj) {
    let jrfTestInfoList = []
    let jrfTestDtlList = [];
    if (jrfObj.jrfTestInfoList != null) {
      jrfTestInfoList = JSON.parse(JSON.stringify(jrfObj.jrfTestInfoList));
      for (let i = 0; i < jrfTestInfoList.length; i++) {
        let jrfTestInfoDtl = jrfTestInfoList[i];
        if (jrfTestInfoDtl.jrfTestDtlList) {
          let jrfTestDtls = jrfTestInfoDtl.jrfTestDtlList;
          for (let j = 0; j < jrfTestDtls.length; j++) {
            jrfTestDtlList.push(JSON.parse(JSON.stringify(jrfTestDtls[j])));
          }
          jrfTestInfoDtl.jrfTestDtlList = null;
        }
      }
    }
    let seriolNoList = [];
    for (let i = 0; i < jrfTestInfoList.length; i++) {
      let serialNo = jrfTestInfoList[i].serialNo;
      seriolNoList.push({ label: serialNo, value: serialNo });
    }
    this.serialNoList = seriolNoList;
    this.jrfSeqNumber = jrfObj.jrfSeqNo;
    this.jrfRefNumber = jrfObj.jrfRefNo;
    this.jrfDate = moment(new Date(jrfObj.jrfDate)).format("DD/MM/YYYY HH:mm");
    jrfObj.jrfTestInfoList = null;
    let formObj = this.jrfForm.value;
    for (var k in formObj) {
      formObj[k] = jrfObj[k];
    }
    // formObj.mlStdSubType = formObj.mlStdSubType ? formObj.mlStdSubType.split(",") : [];
    this.booleanToString(formObj);
    this.jrfForm.setValue(formObj);
    this.shortDocFileName = formObj.eutShortDocName;
    this.descDocFileName = formObj.eutDescDocName;
    this.parameterGridApi.setRowData(jrfTestInfoList);
    this.testGridApi.setRowData(jrfTestDtlList);
    this.loading = false;
  }
  booleanToString(formObj) {
    formObj.custWitness = formObj.custWitness ? "true" : "false";
    formObj.deviationMethod = formObj.deviationMethod ? "true" : "false";
    formObj.accCriteria = formObj.accCriteria ? "true" : "false";
  }
  getSpecifiCombo(row) {
    return this.specificationList;
  }
  getTestCombo(row) {
    let specificationId = row.specificationId;
    let spec = this.specificationList.find(obj => obj.specificationId == specificationId);
    if (spec && spec.testList) {
      return spec.testList;
    }
    return [];
  }
  getSpecifiComboSelected(row) {
    let specificationId = row.specificationId;
    if (specificationId) {
      let spec = this.specificationList.find(obj => obj.specificationId == specificationId);
      return spec;
    }
  }
  getSlNoComboSelected(row) {
    let serialNo = row.serialNo;
    if (serialNo) {
      let spec = this.serialNoList.find(obj => obj.label == serialNo);
      return spec;
    }
  }
  getTestComboSelected(row) {
    let specificationId = row.specificationId;
    let testId = row.testId;
    if (specificationId && testId) {
      let spec = this.specificationList.find(obj => obj.specificationId == specificationId);
      if (spec && spec.testList) {
        let test = spec.testList.find(obj => obj.testId == testId);
        return test;
      }
    }
  }

  handleFileInput(files: FileList, type) {
    if (type === "SHORT") {
      this.shortDocFileToUpload = files.item(0);
      this.shortDocFileName = this.shortDocFileToUpload.name;
    } else {
      this.performaDocFileToUpload = files.item(0);
      this.descDocFileName = this.performaDocFileToUpload.name;
    }
  }
  goBack() {
    this.stopGridsEditing();
    this.myStepper.previous();
  }
  goForward() {
    this.stopGridsEditing();
    this.myStepper.next();
  }
  validateJRF(isSaveSend, responseData): boolean {
    let isError = false;
    if (isSaveSend) {
      let errrList = [];
      // console.log(responseData)
      let eutName = responseData.eutName;
      if (!(eutName && eutName.length > 0)) {
        errrList.push("EUT Name should not be empty");
      }
      let eutQty = responseData.eutQty;
      if (!eutQty) {
        errrList.push("EUT Quantity should not be empty or zero");
      }
      let eutShortNote = responseData.eutShortNote;
      if (!(eutShortNote && eutShortNote.length > 0)) {
        errrList.push("EUT Short Note should not be empty");
      }
      if (responseData.jrfTestInfoList && responseData.jrfTestInfoList.length > 0) {
        for (let i = 0; i < responseData.jrfTestInfoList.length; i++) {
          let jrfTestInfo = responseData.jrfTestInfoList[i];
          if (!jrfTestInfo.serialNo) {
            errrList.push("Serial No is missing at row-" + (i + 1) + " in Parameter Table");
          }
          if (!jrfTestInfo.supplyVolt) {
            errrList.push("Supply Volt is missing at row-" + (i + 1) + " in Parameter Table");
          }
          // if (jrfTestInfo.supplyVolt && jrfTestInfo.supplyVolt === 'DC' && !jrfTestInfo.supplyDcValue) {
          if (jrfTestInfo.supplyVolt && (jrfTestInfo.supplyVolt === 'DC'||jrfTestInfo.supplyVolt === 'Three Phase') && !jrfTestInfo.supplyDcValue) {
            errrList.push("Supply DC Voltage is missing at row-" + (i + 1) + " in Parameter Table");
          }
          if (jrfTestInfo.jrfTestDtlList && jrfTestInfo.jrfTestDtlList.length > 0) {
            for (let j = 0; j < jrfTestInfo.jrfTestDtlList.length; j++) {
              let jrfTestDtl = jrfTestInfo.jrfTestDtlList[j];
              if (!jrfTestDtl.serialNo) {
                errrList.push("Serial No is missing at row-" + (j + 1) + " in Test Table");
              }
              if (!jrfTestDtl.specificationName) {
                errrList.push("Specification is missing at row-" + (j + 1) + " in Test Table");
              }
              if (!jrfTestDtl.testName) {
                errrList.push("Test is missing at row-" + (j + 1) + " in Test Table");
              }
              if (!jrfTestDtl.noOfTimes) {
                errrList.push("No of times missing at row-" + (j + 1) + " in Test Table");
              }
              if (jrfTestDtl.additionalName) {
                if (jrfTestDtl.additionalName === 'freqency/strength') {
                  if (!jrfTestDtl.fieldStrength) {
                    errrList.push("field Strength missing at row-" + (j + 1) + " in Test Table");
                  }
                  // if (!jrfTestDtl.fieldStrengthUnit) {
                  //   errrList.push("field Strength Unit missing at row-" + (j + 1) + " in Test Table");
                  // }
                  if (!jrfTestDtl.freqRangeFrom) {
                    errrList.push("Frequency range from missing at row-" + (j + 1) + " in Test Table");
                  }
                  if (!jrfTestDtl.freqRangeFromUnit) {
                    errrList.push("Frequency range from unit missing at row-" + (j + 1) + " in Test Table");
                  }
                  if (!jrfTestDtl.freqRangeTo) {
                    errrList.push("Frequency range to missing at row-" + (j + 1) + " in Test Table");
                  }
                  if (!jrfTestDtl.freqRangeToUnit) {
                    errrList.push("Frequency range to unit missing at row-" + (j + 1) + " in Test Table");
                  }
                  if (jrfTestDtl.freqRangeFrom && jrfTestDtl.freqRangeToUnit) {
                    if (Number(jrfTestDtl.freqRangeFrom) >= Number(jrfTestDtl.freqRangeToUnit)) {
                      errrList.push("Frequency range to should greater then the frequency range from at row-" + (j + 1) + " in Test Table");
                    }
                  }
                }
                if (jrfTestDtl.additionalName === 'cable') {
                  if (!jrfTestDtl.noOfCables) {
                    errrList.push("No of cables missing at row-" + (j + 1) + " in Test Table");
                  }
                }
              }
            }
          } else {
            if (jrfTestInfo.serialNo) {
              errrList.push("No test added for serialNo:" + jrfTestInfo.serialNo);
            }
          }
        }
        //eutQty equal to parameter grid count
        const unique = [...new Set(responseData.jrfTestInfoList.map(item => item.serialNo))];
        if (Number(eutQty) != unique.length) {
          errrList.push("Parameter grid's Serial No rows count not matched with EUT Qty");
        }
      }
      if (errrList.length > 0) {
        isError = true;
        this.jrfService.openDialog("Validation Error", null, errrList, "danger");
      }
    }
    return isError;
  }

  stopGridsEditing() {
    if (this.testGridApi) {
      this.testGridApi.stopEditing();
    }
    if (this.parameterGridApi) {
      this.parameterGridApi.stopEditing();
    }
  }
}
