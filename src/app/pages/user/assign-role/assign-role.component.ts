import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { ColDef } from "ag-grid-community";
import { CommonService } from "../../common.service";
import { GridActionsComponent } from "../../common/grid-actions/grid-actions.component";

@Component({
  selector: "ngx-assign-role",
  templateUrl: "./assign-role.component.html",
  styleUrls: ["./assign-role.component.scss"],
})
export class AssignRoleComponent implements OnInit {
  fieldSize: any = "small";
  roles: any = [];
  userForm: UntypedFormGroup;
  userList: any[] = [];
  userGrid: any;
  userButtonName: string = "Save";
  userGridRowData: any;
  userButtonDisabled: boolean = false;
  status: any;
  userEmail: boolean = false;
  userName: boolean = false;
  searchText: string;

  //Assignment Role Table Definition
  userColumnDefs: ColDef[] = [
    { headerName: "Sl.no", valueGetter: "node.rowIndex + 1", suppressMovable: true, width: 50, minWidth: 30, maxWidth: 80 },
    { headerName: "Login ID", field: 'username', width: 150, suppressMovable: true, minWidth: 100, maxWidth: 180 },
    { headerName: "Email", field: 'email', suppressMovable: true, },
    { headerName: "Role", field: 'roleInfoEntity.name', width: 150, suppressMovable: true, minWidth: 100, maxWidth: 180 },
    { headerName: "Status", field: 'status', width: 150, suppressMovable: true, minWidth: 100, maxWidth: 180 },
    {
      headerName: "Actions",
      cellRenderer: GridActionsComponent, suppressMovable: true,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
      cellRendererParams: {
        onClick: (e, type) => e.rowData && this.actions(e, type),
        button: ["edit", "delete"],
      },
    },
  ];
  userDefaultColDef = { flex: 1, theme: "ag-theme-balham" };
  btnPermission: any;
  constructor(private roleService: CommonService, private fb: UntypedFormBuilder, private cdr: ChangeDetectorRef) {
    roleService.setGridDynamicRowCnt(this.userGridOptions, 500);
  }

  ngOnInit(): void {
    this.btnPermission = this.roleService.getPermission(Number(localStorage.getItem('pageId')))
    this.getRoles();
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required]
    })
  }

  //Grid Options
  userGridOptions = {
    pagination: true,
    rowModelType: "infinite",
    enableCellTextSelection: "true",
    enableBrowserTooltips: "true",
    cacheBlockSize: 100,
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
    } else {
      this.deleteUser(rowData);
    }
  }

  onUserGridReady(e) {
    this.userGrid = e.api;
    this.getUser();
  }

  //Dropdown value setting
  compareById(v1, v2): boolean {
    return v1 == v2;
  }

  getRoles() {
    let url = "/user/role/getRoles";
    let params = {};
    this.roleService.getAPI(url, params).subscribe(
      (res: any) => {
        this.roles = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateGridData(rowData: any) {
    this.userForm.controls["username"].setValue(rowData.username);
    this.userForm.controls["email"].setValue(rowData.email);
    this.userEmail = true;
    this.userName = true;
    this.userForm.controls["roleId"].setValue(rowData.roleInfoEntity.id);
    this.userGridRowData = rowData;
    this.userButtonName = "Update";
  }

  saveUser() {
    let errorMessageList = this.fieldValidation();
    if (errorMessageList.length == 0 && this.userForm.valid) {
      this.userButtonDisabled = true;
      if (this.userGridRowData != null) {
        this.updateUser(this.userGridRowData);
      } else {
        let url = "/user/role/saveUser";
        let params = { ...this.userForm.value, status: "Active" };
        this.roleService.postAPI(url, params).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.cancelUser();
              this.userGrid.purgeInfiniteCache();
              this.roleService.openDialog(
                "Success",
                res.message,
                [],
                "success"
              );
            } else {
              this.userButtonDisabled = false;
              this.roleService.openDialog("Error", res.message, [], "danger");
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }
    } else {
      if (this.userForm.invalid) {
        errorMessageList.push("Email must be a valid email address!");
      }
      this.roleService.openDialog("Warning", "", errorMessageList, "warning");
    }
  }

  updateUser(rowData: any) {
    let params = {};
    if (this.status == "edit") {
      rowData["username"] = this.userForm.get("username").value;
      rowData["email"] = this.userForm.get("email").value;
      rowData["roleId"] = this.userForm.get("roleId").value;
      params = { ...this.userForm.value };
    } else {
      rowData["status"] = rowData.status == "Active" ? "Inactive" : "Active";
    }
    let url = "/user/role/updateUser";
    this.roleService.putAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          rowData["roleInfoEntity"] = res.data.roleInfoEntity;
          this.cancelUser();
          this.userGrid.refreshCells({ suppressFlash: true });
          this.roleService.openDialog("Success", res.message, [], "success");
        } else {
          this.userButtonDisabled = false;
          this.roleService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteUser(rowData: any) {
    let url = "/user/role/deleteUser";
    let params = { email: rowData.email };
    this.roleService.deleteAPI(url, params).subscribe(
      (res: any) => {
        if (res.code == 200) {
          this.cancelUser();
          this.userGrid.purgeInfiniteCache();
          this.roleService.openDialog("Success", res.message, [], "success");
        } else {
          this.roleService.openDialog("Error", res.message, [], "danger");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  cancelUser() {
    this.userForm.reset();
    this.userButtonDisabled = false;
    this.userButtonName = "Save";
    this.userGridRowData = null;
    this.userEmail = false;
    this.userName = false;
  }

  getUser() {
    if (this.userGrid) {
      let datSource = this.roleService.gridPaginationGetRows(this.userGrid, this.cdr, "/user/role/getUser", this.userList);
      this.userGrid.setDatasource(datSource);
    }
  }

  fieldValidation() {
    let errorMessageList = [];
    let username = this.userForm.get("username").value;
    let roleId = this.userForm.get("roleId").value;
    if (username == "" || username == null || username == "null") {
      errorMessageList.push("Login ID should not be empty");
    }
    if (roleId == "" || roleId == null || roleId == "null") {
      errorMessageList.push("User Role should not be empty");
    }
    return errorMessageList;
  }

  searchUser() {
    this.userGrid["searchText"] = this.searchText;
    this.userGrid.purgeInfiniteCache();
  }

  updateSearchText() {
    if (this.searchText == '') {
      this.searchUser()
    }
  }

}