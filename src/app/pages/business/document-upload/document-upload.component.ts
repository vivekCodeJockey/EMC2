import { HttpHeaders } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NbWindowService } from "@nebular/theme";
import { ColDef, IDatasource, IGetRowsParams } from "ag-grid-community";
import { WebcamImage } from "ngx-webcam";
import { Observable, Subject } from "rxjs";
import { nvtoastrService } from "../../../@theme/service/toastr/toastr.service";
import { CommonService } from "../../common.service";
import { GridActionsComponent } from "../../common/grid-actions/grid-actions.component";

@Component({
  selector: "ngx-document-upload",
  templateUrl: "./document-upload.component.html",
  styleUrls: ["./document-upload.component.scss"],
})
export class DocumentUploadComponent implements OnInit {

  loading = false;

  // private trigger: Subject<any> = new Subject();
  // public webcamImage!: WebcamImage;
  // private nextWebcam: Subject<any> = new Subject();
  // sysImage = "";
  exJrfDtl: any;
  fileToUpload: FileList | null = null;
  imgFileName;
  clientHeight;
  fieldSize: any = "small";
  documentForm: UntypedFormGroup;
  documentButtonDisabled: boolean = false;
  documentGrid: any;
  documentList: any[] = [];
  extensionType: any;
  base64: any;

  @ViewChild("contentTemplate", { static: true })
  contentTemplate: TemplateRef<any>;

  //Document Upload Table Definition
  documentColumnDefs: ColDef[] = [
    {
      headerName: "SL No",
      valueGetter: "node.rowIndex + 1",
      width: 60,
      minWidth: 60,
      maxWidth: 60, suppressMovable: true,
    },
    { headerName: "File Header", field: "title", suppressMovable: true, },
    {
      headerName: "File Type",
      field: "category",
      width: 100,
      minWidth: 80,
      maxWidth: 120, suppressMovable: true,
    },
    { headerName: "File Name", field: "fileMaster.name" },
    {
      headerName: "Actions",
      cellRenderer: GridActionsComponent,
      width: 130,
      minWidth: 130,
      maxWidth: 130, suppressMovable: true,
      cellRendererParams: {
        onClick: (e, type) => e.rowData && this.actions(e, type),
        button: ["view", "download", "delete"],
      },
    },
  ];
  documentDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

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

  constructor(
    private docService: CommonService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private windowService: NbWindowService,
    private toastrService: nvtoastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.clientHeight = (Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)) - 150
    if (
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.jrfDtl
    ) {
      this.exJrfDtl = this.router.getCurrentNavigation().extras.state.jrfDtl;
    }
    docService.setGridDynamicRowCnt(this.gridOptions, 500);
  }

  ngOnInit(): void {
    this.documentForm = this.fb.group({
      fileType: ["", [Validators.required]],
      fileHeader: ["", [Validators.required]],
      fileInput: [""],
    });
  }

  //Grid Action
  actions(e, type) {
    let data = e.rowData;
    switch (type) {
      case "delete":
        this.deleteDocument(data.id);
        break;
      case "view":
        this.viewDocument(data.fileMaster.id);
        break;
      case "download":
        this.downloadDocument(data.fileMaster.id);
        break;
    }
  }

  //Grid Initialization
  onDocumentGridReady(e) {
    this.documentGrid = e.api;
    this.documentGrid.payload = { 'testTrackerId': this.exJrfDtl.testTrackerId }
    this.getDocument();
  }

  handleFileInput(files: FileList, type?: any) {
    if (type == 'image') {
      // &&this.fileToUpload&&this.fileToUpload.length>0
      this.imgFileName = files[0].name
    }
    this.fileToUpload = files;
  }

  uploadDocument() {
    let errorMessageList = this.fieldValidation();
    if (errorMessageList.length == 0) {
      this.documentButtonDisabled = true;
      const endpoint = "/testTracker/saveReportFiles";
      const formData: FormData = new FormData();
      Array.from(this.fileToUpload).forEach((file, index) => {
        formData.append("file", this.fileToUpload[index]);
      });
      formData.append("testTrackerId", this.exJrfDtl.testTrackerId);
      formData.append("title", this.documentForm.get("fileHeader").value);
      formData.append("category", this.documentForm.get("fileType").value);
      const headers = new HttpHeaders().set(
        "Content-Type",
        "multipart/form-data"
      );
      this.docService
        .postAPI(endpoint, formData, { headers: headers })
        .subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.cancelDocument();
              this.documentGrid.purgeInfiniteCache();
              this.toastrService.showToast(
                "success",
                "Document",
                res.message,
                "BOTTOM_RIGHT"
              );
            } else {
              this.documentButtonDisabled = false;
              this.docService.openDialog("Error", res.message, [], "danger");
            }
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      this.docService.openDialog("Warning", "", errorMessageList, "warning");
    }
  }

  deleteDocument(reportFileId: any) {
    let url = "/testTracker/deleteReportFiles?reportFileId=" + reportFileId;
    this.docService.deleteAPI(url, {}).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cancelDocument();
          this.documentGrid.purgeInfiniteCache();
          this.toastrService.showToast(
            "success",
            "Document",
            res.message,
            "BOTTOM_RIGHT"
          );
        } else {
          this.documentButtonDisabled = false;
          this.docService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  viewDocument(fileId: any) {
    this.loading = true;
    let url = "/file/getBase64Encode";
    let params = { fileId: fileId };
    this.docService.getAPI(url, params).subscribe(
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
          this.docService.openDialog("Error", res.message, [], "danger");
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
    let url = "/file/getBase64Encode";
    let params = { fileId: fileId };
    this.docService.getAPI(url, params).subscribe(
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
          this.docService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getDocument() {
    // const dataSource: IDatasource = {
    //   getRows: (params: IGetRowsParams) => {
    //     this.documentGrid.showLoadingOverlay();
    //     const limit = this.gridOptions['cacheBlockSize'];
    //     const offset = this.documentGrid.paginationGetCurrentPage();
    //     const payload: any = {};
    //     if (searchText) {
    //       payload["searchText"] = searchText;
    //     }
    //     const url =
    //       "/testTracker/getReportFiles?testTrackerId=" +
    //       this.exJrfDtl.testTrackerId +
    //       "&pageSize=" +
    //       limit +
    //       "&pageNum=" +
    //       offset;
    //     this.docService.getAPI(url, payload).subscribe(
    //       (res: any) => {
    //         if (res.data && res.data.length > 0) {
    //           this.documentGrid.hideOverlay();
    //           this.documentList = res.data;
    //           params.successCallback(
    //             res.data ? res.data : [],
    //             res.total ? res.total : 100
    //           );
    //         } else {
    //           this.documentGrid.showNoRowsOverlay();
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
    if (this.documentGrid) {
      let datSource = this.docService.gridPaginationGetRows(this.documentGrid, this.cdr, "/testTracker/getReportFiles", this.documentList, this.loading)
      this.documentGrid.setDatasource(datSource);
    }
  }

  cancelDocument() {
    this.documentButtonDisabled = false;
    this.fileToUpload = null;
    this.documentForm.controls["fileType"].setValue("");
    this.documentForm.controls["fileHeader"].setValue("");
    this.documentForm.controls["fileInput"].setValue("");
  }

  // public getSnapshot(): void {
  //   this.trigger.next(void 0);
  // }
  // public captureImg(webcamImage: WebcamImage): void {
  //   this.webcamImage = webcamImage;
  //   this.sysImage = webcamImage!.imageAsDataUrl;
  //   console.info("got webcam image", this.sysImage);
  // }
  // public get invokeObservable(): Observable<any> {
  //   return this.trigger.asObservable();
  // }
  // public get nextWebcamObservable(): Observable<any> {
  //   return this.nextWebcam.asObservable();
  // }

  fieldValidation() {
    let errorMessageList = [];
    let fileType = this.documentForm.get("fileType").value;
    let fileHeader = this.documentForm.get("fileHeader").value;
    if (fileType == "" || fileType == null || fileType == "null") {
      errorMessageList.push("File Type should not be empty");
    }
    if (fileHeader == "" || fileHeader == null || fileHeader == "null") {
      errorMessageList.push("File Header should not be empty");
    }
    if (this.fileToUpload == null) {
      errorMessageList.push("Please Choose File");
    }
    return errorMessageList;
  }
}
