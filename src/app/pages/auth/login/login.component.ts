import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../common.service';
import { nvtoastrService } from '../../../@theme/service/toastr/toastr.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  logCredentials(credentials: any) {
    console.log(credentials);
  }

  signup: boolean = false;
  fpwd: boolean = false;
  invalid: boolean = false;
  loader: boolean = false;
  loginForm: UntypedFormGroup;
  showPage = "f_password";
  signBtnDisable = false;
  exApp = true;

  constructor(private loginService: CommonService, private fb: UntypedFormBuilder, private router: Router, private toastrService: nvtoastrService) {
    localStorage.clear();
    if (environment.INTERNAL_APP) {
      this.exApp = false
    }
  }

  ngOnInit(): void {
    let emailcheck = null;
    if (this.exApp) {
      emailcheck = [Validators.required, Validators.email, Validators.maxLength(50)]
    } else {
      emailcheck = [Validators.required, Validators.maxLength(50)]
    }
    this.loginForm = this.fb.group({
      username: ['', emailcheck],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
    })
  }

  showLogin() {
    this.fpwd = false;
  }

  signin() {
    if (Object.keys(this.loginForm.get('username').value).length === 0 || Object.keys(this.loginForm.get('password').value).length === 0) {
      this.toastrService.showToast("danger", this.exApp ? "Email Id " : "Login Id " + "and Password should not be empty", "", "BOTTOM_RIGHT");
      return;
    }
    if (!this.loginForm.valid) {
      this.toastrService.showToast("danger", this.exApp ? "Invalid Email Id " : "Invalid Login Id " + "and Password", "", "BOTTOM_RIGHT");
      return;
    }
    this.signBtnDisable = true;
    this.loader = true;
    this.invalid = false;
    let url = "auth/signin";
    let params = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    }
    this.loginService.postAPI(url, params).subscribe((res: any) => {
      switch (res.code) {
        case 200: {
          let rslt = res.data
          localStorage.setItem("userInfo", JSON.stringify(rslt.userDtl));
          localStorage.setItem("accesToken", rslt.accessToken);
          localStorage.setItem("refreshToken", rslt.refreshToken);
          let userRoleEntity = JSON.parse(localStorage.getItem('userInfo')).roleInfoEntity
          if (userRoleEntity.name == 'admin') {
            localStorage.setItem("permission", JSON.stringify(100));
          } else if (userRoleEntity) {
            localStorage.setItem("permission", JSON.stringify(userRoleEntity.rolePermissions.map(obj => {
              return { pageId: obj.pageId, isView: (obj.delete || obj.create || obj.edit || obj.view), isDelete: obj.delete, isEdit: obj.edit, isCreate: obj.create }
            })));
          }
          this.router.navigate(["/pages/"]);
          this.toastrService.showToast("success", "SIGNIN Successfull", "You have been successfully authenticated!", "BOTTOM_RIGHT");
          break;
        } 
        case 404: {
          this.signup = true;
          localStorage.setItem('vEmail', "true");
          localStorage.setItem('tempEmail', this.loginForm.get('username').value);
          this.showPage = "v_password";
          break;
        } 
        case 406: {
          this.toastrService.showToast("danger", "SIGNIN Failed", res?res.message:'', "BOTTOM_RIGHT");
          this.signBtnDisable = false;
          break;
        }
        case 400: {
          this.toastrService.showToast("danger", "SIGNIN Failed", "", "BOTTOM_RIGHT");
          this.signBtnDisable = false;
          this.invalid = true;
          break;
        } 
      }
      this.loader = false;
    }, (err) => {
      this.loader = false;
      console.log(err)
      this.signBtnDisable = false;
    })
  }

}
