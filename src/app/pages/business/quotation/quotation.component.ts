import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonService } from '../../common.service';
import { ColDef } from 'ag-grid-community';
import { UntypedFormGroup, AbstractControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NbDialogService, NbWindowControlButtonsConfig, NbWindowService } from '@nebular/theme';
import { nvtoastrService } from '../../../@theme/service/toastr/toastr.service';
import * as converter from 'number-to-words';

@Component({
  selector: 'ngx-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})
export class QuotationComponent implements OnInit {
  baseUrl = "/bussiness/quotation";
  dialogObj = { remarks: "" };
  grid: any;
  loading = false;
  editFlag: boolean = false;
  quoteForm: UntypedFormGroup = null;
  jrfSeqNumber = "";
  quoRefNumber = "";
  existingJrfId: any;
  jrfDate = "";
  jrfRefDate = "";
  quoteRowData = [];
  quoteGridRowData = [];
  tWord = '';
  quoteColumnDefs: ColDef[] = null;
  quoteDefaultColDef = { flex: 1, theme: "ag-theme-balham" };
  fieldSize: any = "small"
  btnPermission;
  qouRemarksWinRef: any;
  @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;

  ngOnInit(): void {
    if (this.existingJrfId) {
      this.quoteForm = this.fb.group({
        totalAmount: [0.00, Validators.required],
        discount: [0.00, Validators.required],
        taxAmount: [0.00, Validators.required],
        grandTotalAmount: [0.00, Validators.required],
        roundedOff: [0.00, Validators.required],
        id: [null],
        jrfId: [null],
        referenceNo: [null],
        referenceId: [null],
        taxType: [null],
        quotationComments: [null],
        companyAddress: [null],
        companyName: [null],
        userName: [null]
      })
      this.loadExistingDataAPI(this.existingJrfId)
      this.quoteColumnDefs = [
        { headerName: "SL No", valueGetter: "node.rowIndex + 1", suppressMovable: true, width: 60, minWidth: 60, maxWidth: 60 },
        { headerName: "Details of Test", field: 'testDescription', suppressMovable: true, editable: (params) => { return this.editFlag }, width: 350, minWidth: 200 },
        {
          headerName: 'Qty (No’s)', field: "qty", suppressMovable: true, editable: (params) => { return this.editFlag }, width: 80, minWidth: 50, maxWidth: 120,
          valueFormatter: params => { if (params.data.qty) { return params.data.qty } else { return '0.00' } }
        },
        {
          headerName: 'Unit Price INR.', field: "unitPrice", suppressMovable: true, editable: (params) => { return this.editFlag }, width: 80, minWidth: 50, maxWidth: 120, type: 'rightAligned'
          , cellRenderer: this.CurrencyCellRendererUSD
        },
        {
          headerName: 'Total Price INR.', field: "totalPrice", suppressMovable: true, width: 180, minWidth: 150, maxWidth: 200, cellRenderer: this.CurrencyCellRendererUSD,
        }];
    }
  }

  constructor(private quoteService: CommonService, private fb: UntypedFormBuilder, private router: Router, private dialogService: NbDialogService, private windowService: NbWindowService, private toastrService: nvtoastrService) {
    if (this.router.getCurrentNavigation().extras.state && this.router.getCurrentNavigation().extras.state.jrfId) {
      this.existingJrfId = this.router.getCurrentNavigation().extras.state.jrfId;
    } else {
      this.router.navigate(['/pages/business']);
    }
    this.btnPermission = this.quoteService.getPermission(2)
  }

  addNewRow() {
    this.grid.applyTransaction({ add: [{ qty: 0, unitPrice: 0, totalPrice: 0 }] })
  }

  CurrencyCellRendererUSD(params: any) {
    var inrFormat = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    });
    return inrFormat.format(params.value);
  }

  colTotal = {
    'mySum': params => {
      let sum = 0;
      params.values.forEach(value => sum += value);
      return sum;
    }
  }

  loadExistingDataAPI(jrfId) {
    this.loading = true;
    this.quoteService.getAPI("/bussiness/quotation", { jrfId: jrfId }).subscribe((res: any) => {
      if (res.code == 200) {
        this.populatePageData(res.data);
      }
    }, (err) => {
      this.loading = false;
    });
  }
  populatePageData(jrfObj) {
    if (jrfObj.quotationDtl) {
      this.quoteRowData = jrfObj.quotationDtl;
      this.quoteGridRowData = jrfObj.quotationDtl;
    } else {
      this.quoteRowData = [{}];
      this.quoteGridRowData = [{}];
    }
    this.jrfSeqNumber = jrfObj.jrfSequenceNumber;
    if (jrfObj.jrfDate) {
      this.jrfDate = moment(new Date(jrfObj.jrfDate)).format("DD/MM/YYYY HH:mm");
    }
    this.quoRefNumber = jrfObj.referenceNo;
    if (jrfObj.quoDate) {
      this.jrfRefDate = moment(new Date(jrfObj.quoDate)).format("DD/MM/YYYY HH:mm");
    }
    let formObj = this.quoteForm.value;
    for (var k in formObj) {
      formObj[k] = jrfObj[k];
    }
    this.quoteForm.setValue(formObj);
    this.onTotalChange(this.quoteForm.value.grandTotalAmount)
    this.loading = false;
  }

  onTotalChange(param) {
    this.tWord = converter.toWords(param)
  }

  openPrintPreview(event) {
    event.target.disabled = true
    setTimeout(() => {
      var divContents = document.getElementById("quotationPrint").innerHTML;
      var printWin = window.open('', '', 'height=700, width=1000');
      printWin.document.write('<html><head><style>page-header, .page-header-space{ height: 90px}.page-footer, .page-footer-space {height: 0.2px; }.page-footer { position: fixed;bottom: 0;width: 100%;}        .page-header {position: fixed;width: 99%;margin-left: 0.5%;} .page { page-break-after: always;} @page {      margin: 20mm; size: A4 }  #pageFooter:after { } @media print {size: A4 ;thead {display: table-header-group;}tfoot {display: table-footer-group;} body {margin: 0;size: A4 }}</style></head>');
      printWin.document.write('<body>' + divContents + '</body></html>');
      printWin.document.close();
      printWin.print();
      event.target.disabled = false
    }, 2000);
    this.quoteGridRowData = this.geGridData()
  }
  onCellValueChanged(param) {
    if (param.colDef.field !== 'testDescription') {
      let row = param.data;
      row.totalPrice = Number(row.qty) * Number(row.unitPrice);
      this.grid.applyTransaction({ update: [row] });
      this.updateTotalAndTax();
    }
  }
  updateTotalAndTax() {
    let gridData = this.geGridData();
    let discount = this.quoteForm.get('discount').value
    let totalAmt = 0;
    for (let i = 0; i < gridData.length; i++) {
      let row = gridData[i];
      totalAmt += Number(row.totalPrice);
    }
    let discountedAmt = totalAmt - Number(discount);
    let taxAmt = discountedAmt * (18 / 100);
    let grandTotalAmountNoRound = discountedAmt + taxAmt;
    let grandTotalAmountRounded = Number(grandTotalAmountNoRound).toFixed();
    let roundedOff = Number(grandTotalAmountRounded) - grandTotalAmountNoRound;
    this.quoteForm.get("totalAmount").setValue(Number(discountedAmt).toFixed(2));
    this.quoteForm.get("discount").setValue(Number(discount).toFixed(2));
    this.quoteForm.get("taxAmount").setValue(Number(taxAmt).toFixed(2));
    this.quoteForm.get("grandTotalAmount").setValue(Number(grandTotalAmountRounded).toFixed(2));
    this.quoteForm.get("roundedOff").setValue(Number(roundedOff).toFixed(2));
    this.onTotalChange(Number(grandTotalAmountRounded))
  }

  onGridReady(e) {
    this.grid = e.api;
  }

  geGridData() {
    let testGridData: Array<any> = [];
    this.grid.forEachNode(function (node) {
      testGridData.push(node.data);
    });
    return testGridData;
  }
  saveQuotation(isSend) {
    let $scope = this;
    this.getQoutationRemarks().then(function () {
      let requestPayLoad = JSON.parse(JSON.stringify($scope.quoteForm.value));
      requestPayLoad.quotationDtl = $scope.geGridData();
      $scope.loading = true;
      $scope.quoteService.postAPI($scope.baseUrl + (isSend ? "/saveSend" : "/save"), requestPayLoad).subscribe((res: any) => {
        if (res.success) {
          $scope.populatePageData(res.data);
          $scope.quoteService.openDialog("Quotation", "Quotation " + (isSend ? (($scope.editFlag) ? "Saved & Sent" : "Send") : "Saved") + " Successfully!", [], "success")
          // $scope.toastrService.showToast("success", "Quotation", "Quotation " + (isSend ? (($scope.editFlag) ? "Save & Send" : "Send") : "Saved") + " Successfully!", "BOTTOM_RIGHT");
          if ($scope.dialogObj&&$scope.dialogObj.remarks) {
            $scope.dialogObj.remarks = '';
          }
          if (isSend&&$scope.editFlag) {
            $scope.editFlag = false;
          }
        } else {
          $scope.quoteService.openDialog('Error', res.message, "", "danger")
        }
        $scope.loading = false;
      }, (err) => {
        console.log(err);
        $scope.loading = false;
      });
    }).catch(e => {
      console.log(e);
   });
  }

  getQoutationRemarks() {
    let $scope = this;
    return new Promise(function (res, rej) {
      if ($scope.editFlag) {
        const buttonsConfig: NbWindowControlButtonsConfig = {
          minimize: false,
          maximize: false,
          fullScreen: false,
          close: true
        };
        $scope.windowService.open(
          $scope.contentTemplate,
          {
            title: 'Comments',
            context: { obj: $scope.dialogObj },
            hasBackdrop: true,
            closeOnBackdropClick: false,
            closeOnEsc: false,
            buttons: buttonsConfig,
          },
        ).onClose.subscribe(function (param) {
          if (!$scope.dialogObj.remarks) {
            $scope.toastrService.showToast("danger", "Quotation Remarks Should Not be empty", "", "TOP_RIGHT");
            rej();
          } else {
            let existRemarks = $scope.quoteForm.get("quotationComments").value || "";
            existRemarks += (existRemarks ? $scope.dialogObj.remarks : "@@" + $scope.dialogObj.remarks);
            $scope.quoteForm.get("quotationComments").setValue(existRemarks);
            res("");
          }
        });
      } else {
        res("");
      }
    });
  }

}