import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColDef } from "ag-grid-community";
import { CommonService } from "../../common.service";
import { GridActionsComponent } from "../../common/grid-actions/grid-actions.component";

@Component({
  selector: 'ngx-allowuser',
  templateUrl: './allowuser.component.html',
  styleUrls: ['./allowuser.component.scss']
})
export class AllowuserComponent implements OnInit {

  customerGrid: any;
  customerList: any = [];
  fieldSize: any = "small";
  searchText: string;

  customerColumnDefs: ColDef[] = [
    { headerName: "Sl.no", valueGetter: "node.rowIndex + 1", suppressMovable: true, width: 60, minWidth: 60, maxWidth: 60 },
    {
      headerName: "Name", field: 'name ',
      valueGetter: params => {
        let data = params.data;
        if (data) {
          return data["userDetailsEntity"]["firstName"] + " " + data["userDetailsEntity"]["lastName"];
        }
      },
      width: 150, suppressMovable: true, minWidth: 100, maxWidth: 180
    },
    { headerName: "Email", field: 'email', width: 250, suppressMovable: true, minWidth: 200, maxWidth: 280 },
    { headerName: "Mobile No.", field: 'userDetailsEntity.mobileNo', width: 150, suppressMovable: true, minWidth: 100, maxWidth: 180 },
    { headerName: "Company Name", field: 'userDetailsEntity.companyInfo.name', width: 250, suppressMovable: true, minWidth: 200 },
    {
      headerName: "Actions", cellRenderer: GridActionsComponent, suppressMovable: true, width: 80, minWidth: 80, maxWidth: 80,
      cellRendererParams: {
        onClick: (e, type) => e.rowData && this.actions(e, type), button: ["approve", "reject"],
      },
    }];
  customerDefaultColDef = { flex: 1, theme: "ag-theme-balham" };

  constructor(private allowuserService: CommonService, private cdr: ChangeDetectorRef) {
    allowuserService.setGridDynamicRowCnt(this.customerGridOptions, 500);
  }

  ngOnInit(): void { }

  //Grid Options
  customerGridOptions = {
    pagination: true,
    rowModelType: "infinite",
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    rowSelection: "single",
    animateRows: true,
    domLayout: "autoHeight",
  };

  //Grid Action
  actions(e, type) {
    // let rowData = JSON.parse(JSON.stringify(e.rowData));
    this.updateCustomerApproval(e.rowData.id, type);
  }

  onCustomerGridReady(e) {
    this.customerGrid = e.api;
    this.getCustomer();
  }

  updateCustomerApproval(accountInfoId: any, status: any) {
    let customerApproval = "";
    if (status == "approve") {
      customerApproval = "Approved";
    } else {
      customerApproval = "Rejected";
    }
    let url = "auth/updateCustomerApproval?accountInfoId=" + accountInfoId + "&customerApproval=" + customerApproval;
    this.allowuserService.putAPI(url, {}).subscribe((res: any) => {
      if (res.code == 200) {
        this.customerGrid.refreshInfiniteCache();
        this.allowuserService.openDialog("Success", res.message, [], "success");
      } else {
        this.allowuserService.openDialog("Error", res.message, [], "danger");
      }
    }, (err) => { console.log(err) });
  }

  getCustomer(searchText?) {
    if (this.customerGrid) {
      let datSource = this.allowuserService.gridPaginationGetRows(this.customerGrid, this.cdr, "auth/getCustomerApproval", searchText, this.customerList)
      this.customerGrid.setDatasource(datSource);
    }
  }

  searchUser() {
    this.customerGrid["searchText"] = this.searchText;
    this.customerGrid.purgeInfiniteCache();
  }

  updateSearchText() {
    if (this.searchText == '') {
      this.searchUser()
    }
  }
}
