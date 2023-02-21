import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MENU_ITEMS } from '../../../pages/pages-menu';
import { CommonService } from '../../common.service';

@Component({
  selector: 'ngx-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  screenNames: any = MENU_ITEMS;
  newRole: boolean = false;
  roleId: any;
  fieldSize: any = "small"
  roles: any = [];
  rolePermissions: any = [];
  roleForm: UntypedFormGroup;
  buttonDisabled: boolean = false;

  constructor(private roleService: CommonService, private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required]
    })
    this.getRoles();
  }

  getRoles() {
    let url = "/user/role/getRoles";
    let params = {}
    this.roleService.getAPI(url, params).subscribe((res: any) => {
      this.roles = res.data;
    }, (err) => {
      console.log(err);
    });
  }

  getRolePermissions(roleId: any) {
    let url = "/user/role/getRolePermission";
    let params = {
      roleId: Number(roleId)
    }
    this.rolePermissions = [];
    this.roleService.getAPI(url, params).subscribe((res: any) => {
      if (res.data && res.data.length > 0) {
        this.rolePermissions = res.data.filter(o1 => this.screenNames.some(o2 => o1.pageId === o2.pageId));
      } else {
        this.screenNames.filter(page => page.pageId !== 0).forEach(element => {
          let menubasicObjects = {
            "view": false,
            "create": false,
            "edit": false,
            "delete": false,
            "pageId": element.pageId,
            "pageName": element.title,
          }
          this.rolePermissions.push(menubasicObjects);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }

  saveRole() {
    if(this.roleForm.invalid) {
      this.roleService.openDialog("Warning", 'Role Name should not be empty!', [], "warning");
      return;
    } else {
      this.buttonDisabled = true;
      let url = "/user/role/saveRole";
      let params = {
        name: this.roleForm.get('roleName').value,
      }
      this.roleService.putAPI(url, params).subscribe((res: any) => {
        if (res.code == 200) {
          this.cancel();
          this.roleService.openDialog("Success", res.message, [], "success");
          this.getRoles();
        } else {
          this.roleService.openDialog("Error", res.message, [], "danger");
        }
        this.buttonDisabled = false;
      }, (err) => {
        console.log(err);
      });
    }
  }

  saveRolePermission() {
    this.buttonDisabled = true;
    let url = "/user/role/saveRolePermission?roleId=";
    let params = [];
    let cnt = 0;
    this.rolePermissions.forEach(element => {
      cnt = cnt + 1;
      let obj = {
        "view": element.view,
        "create": element.create,
        "edit": element.edit,
        "delete": element.delete,
        "pageId": element.pageId,
        "pageName": element.pageName,
      }
      params.push(obj);
    });
    this.roleService.putAPI(url + this.roleId, params).subscribe((res: any) => {
      if (res.code == 200) {
        this.roleService.openDialog("Success", res.message, [], "success");
      } else {
        this.roleService.openDialog("Error", res.message, [], "danger");
      }
      this.buttonDisabled = false;
    }, (err) => {
      console.log(err);
    });
  }

  cancel() {
    this.roleForm.controls['roleName'].setValue('');
    this.newRole = false;
  }

}
