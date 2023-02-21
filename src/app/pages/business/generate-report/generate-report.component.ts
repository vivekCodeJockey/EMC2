import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NbWindowService } from '@nebular/theme';
import { CommonService } from '../../common.service';
import { nvtoastrService } from '../../../@theme/service/toastr/toastr.service';
import { HttpHeaders } from '@angular/common/http';
import { ColDef, IDatasource, IGetRowsParams } from "ag-grid-community";
import { GridActionsComponent } from "../../common/grid-actions/grid-actions.component";

@Component({
  selector: 'ngx-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit {

  fieldSize: any = "small";
  jrfRefNumber = "";
  jrfRefDate = "";
  jrfId = 0;
  extensionType: any;
  base64: any;
  fileInput: any;
  fileToUpload: File | null = null;
  // existingJrfId: any;
  reportGrid: any;
  reportList: any;
  loading:boolean=false;
  clientHeight;
  documentButtonDisabled: boolean = false;

  @ViewChild('contentTemplate', { static: true }) contentTemplate: TemplateRef<any>;

  // extensionType
  // : 
  // "application/pdf"
  // fileDescription
  // : 
  // "Report File"
  // name
  // : 
  // "TeamScope16022022.pdf"
  // referenceCategory
  // : 
  // "Report"
  // referenceId
  // : 
  // 15
  // referenceType
  // : 
  // "JRF_Report"
 
  reportColumnDefs: ColDef[] = [
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60, suppressMovable: true,
    },
    // { headerName: "File Header", field: "title", suppressMovable: true, },
    { headerName: "File Name", field: "name" ,width: 100,
    minWidth: 80,},
    {
      headerName: "File Type",
      field: "referenceCategory",
      width: 100,
      minWidth: 80,
      maxWidth: 120, suppressMovable: true,
    },
    {
      headerName: "Actions",
      cellRenderer: GridActionsComponent,
      width: 140,
      minWidth: 140,
      maxWidth: 140, suppressMovable: true,
      cellRendererParams: {
        onClick: (e, type) => e.rowData && this.actions(e, type),
        button: ["send","view", "download", "delete"],
      },
    },
  ];
  reportDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  //Grid Options
  gridOptions = {
    pagination: true,
    rowModelType: "infinite",
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    // cacheBlockSize: 100,
    rowSelection: "single",
    animateRows: true,
    domLayout: "autoHeight",
  };

  constructor(private router: Router, private apiService: CommonService, private windowService: NbWindowService, private toastrService: nvtoastrService
    , private cdr: ChangeDetectorRef
  ) {
    let state = this.router.getCurrentNavigation().extras.state.jrfDtl;
    this.jrfRefNumber = state.jrfRefNo;
    this.jrfRefDate = state.jrfDate;
    this.jrfId = state.jrfId;
    this.clientHeight  = (Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0))-150
    apiService.setGridDynamicRowCnt(this.gridOptions, 500);
  }

  ngOnInit(): void {

  }

  actions(e, type) {
    let data = e.rowData;
    switch (type) {
      case "delete":
        this.deleteDocument(data.id);
        break;
      case "view":
        this.viewDocument(data.id);
        break;
      case "download":
        this.downloadDocument(data.id);
        break;
      case "send":
        this.sendReport(data.id);
        break;
    }
  }

  onReportGridReady(e) {
    this.reportGrid = e.api;
    this.reportGrid.payload = { 'referenceId': this.jrfId, 'referenceType':"JRF_Report"}
    this.getReport();
  }

  getReport() {
    // const dataSource: IDatasource = {
    //   getRows: (params: IGetRowsParams) => {
    //     this.reportGrid.showLoadingOverlay();
    //     const limit = this.gridOptions['cacheBlockSize'];
    //     const offset = this.reportGrid.paginationGetCurrentPage();
    //     const payload: any = {};
    //     if (searchText) {
    //       payload["searchText"] = searchText;
    //     }
    //     payload["referenceId"] = this.jrfId ;
    //     payload["referenceType"] = "JRF_Report";
    //     const url =
    //       "/report/uploadedFiles"
    //       // "&pageSize=" +
    //       // limit +
    //       // "&pageNum=" +
    //       // offset;
    //     this.apiService.getAPI(url, payload).subscribe(
    //       (res: any) => {
    //         if (res.data && res.data.length > 0) {
    //           this.reportGrid.hideOverlay();
    //           this.reportList = res.data;
    //           params.successCallback(
    //             res.data ? res.data : [],
    //             res.total ? res.total : 100
    //           );
    //         } else {
    //           this.reportGrid.showNoRowsOverlay();
    //           params.successCallback([], 0);
    //         }
    //         this.cdr.markForCheck();
    //       },
    //       (err: any) => {
    //         this.cdr.markForCheck();
    //       }
    //     );
    //   },
    // };
    if (this.reportGrid) {
      let datSource = this.apiService.gridPaginationGetRows(this.reportGrid, this.cdr, "/report/uploadedFiles", this.reportList, this.loading)
      this.reportGrid.setDatasource(datSource);
    }
  }

  generateReport(event) {
    this.loading = true;
    event.target.disabled = true;
    this.apiService.getAPI("/report", { jrfId: this.jrfId }).subscribe((res: any) => {
      if (res.success) {
        let data = res.data;
        this.extensionType = data.extensionType;
        if (this.extensionType == 'pdf') {
          this.base64 = data.base64;
          this.windowService.open(
            this.contentTemplate,
            {
              title: 'File View',
              context: this.base64,
              hasBackdrop: false,
              closeOnEsc: false,
              buttons: {
                minimize: false,
                maximize: false,
                fullScreen: false,
              }
            });
        } else {
          if (res.message) {
            let data = res.data;
          let base64 = "data:" + data.extensionType + ";base64," + data.base64;
          var link = document.createElement("a");
          document.body.appendChild(link);
          link.setAttribute("href", base64);
          link.setAttribute("download", data.fileName);
          link.click();
            this.apiService.openDialog("Success", res.message, [], "success");
          }
        }
        event.target.disabled = false;
      } else {
        this.apiService.openDialog('Error', res.message, "", "danger")
        event.target.disabled = false;
      }
      this.loading = false;
    });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadDocument(event) {
    if (this.fileToUpload) {
      this.loading = true;
      event.target.disabled = true;
      const endpoint = "/file/uploadDocument";
      const formData: FormData = new FormData();
      formData.append('file', this.fileToUpload);
      formData.append('fileType', "FINALREPORT");
      formData.append('referenceId', this.jrfId.toString());
      formData.append('referenceType', "JRF_Report");
      formData.append('referenceCategory', "Report");
      formData.append('fileDescription', "Report File");
      const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
      this.apiService.postAPI(endpoint, formData, { headers: headers }).subscribe((res: any) => {
        if (res.code == 200) {
          this.fileInput = "";
          this.fileToUpload = null;
          this.apiService.openDialog("Document", res.message, [], "success");
          this.reportGrid.purgeInfiniteCache();
        } else {
          this.apiService.openDialog("Error", res.message, [], "danger");
        }
        event.target.disabled = false;
        this.loading = false;
      }, error => {
        event.target.disabled = false;
        console.log(error);
        this.loading = false;
      });
    } else {
      this.apiService.openDialog("Warning", "Please Choose File", [], "warning");
    }
  }

  
  viewDocument(fileId: any) {
    this.loading = true;
    let url = "/file/getBase64Encode";
    let params = { fileId: fileId };
    this.apiService.getAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          let data = res.data;
          this.extensionType = data.extensionType;
          this.base64 = data.base64;
          this.windowService.open(this.contentTemplate, {
            title: "File View",
            context: this.base64,
            hasBackdrop: true,
            closeOnEsc: false,
            buttons: {
              minimize: false,
              maximize: false,
              fullScreen: true,
            },
          });
          this.toastrService.showToast(
            "success",
            "Document",
            "Document view opened",
            "BOTTOM_RIGHT"
          );
          this.loading = false;
        } else {
          this.apiService.openDialog("Error", res.message, [], "danger");
          this.loading = false;
        }
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  downloadDocument(fileId: any) {
    this.loading = true;
    let url = "/file/getBase64Encode";
    let params = { fileId: fileId };
    this.apiService.getAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          let data = res.data;
          let base64 = "data:" + data.extensionType + ";base64," + data.base64;
          var link = document.createElement("a");
          document.body.appendChild(link);
          link.setAttribute("href", base64);
          link.setAttribute("download", data.fileName);
          link.click();
          this.toastrService.showToast(
            "success",
            "Document",
            "Document will be downloaded",
            "BOTTOM_RIGHT"
          );
        } else {
          this.apiService.openDialog("Error", res.message, [], "danger");
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  sendReport(fileId: any) {
    this.loading = true;
    let url = "/report/send/"+fileId;
    // let params = { fileId: fileId };
    let params = { };
    this.apiService.postAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          let data = res.data;
          this.apiService.openDialog("Document", "Report sent successfully", [], "success");
        } else {
          this.apiService.openDialog("Error", res.message, [], "danger");
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  deleteDocument(fileId: any) {
    this.loading = true;
    let url = "/file/deleteDocument";
    let params = { fileId: fileId };
    this.apiService.deleteAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.apiService.openDialog("Document", res.message, [], "success");
          this.reportGrid.purgeInfiniteCache();
        } else {
          this.apiService.openDialog("Error", res.message, [], "danger");
        }
        this.loading = false;
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

}
