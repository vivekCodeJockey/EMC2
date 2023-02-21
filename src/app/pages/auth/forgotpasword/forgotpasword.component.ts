import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../common.service';
import { nvtoastrService } from '../../../@theme/service/toastr/toastr.service';

@Component({
  selector: 'ngx-forgotpasword',
  templateUrl: './forgotpasword.component.html',
  styleUrls: ['./forgotpasword.component.scss']
})
export class ForgotpaswordComponent implements OnInit {

  @Input() customTitle: string = "f_password";
  @Input() email: string;
  @Output() login = new EventEmitter<any>();
  emailOTP: any;
  resetOTP: any;
  pwd: any;
  confirmpwd: any;
  emailId: any;
  constructor(private loginService: CommonService, private toastrService: nvtoastrService,) { }

  ngOnInit(): void {
    if (localStorage.getItem('vEmail')) {
      this.email = localStorage.getItem('tempEmail');
      localStorage.clear();
      this.resendSignupOTP();
    }
  }

  sendForgotOTP() {
    if (this.emailId) {
      let url = "auth/generateOTP";
      let params = {
        email: this.emailId,
        type: "resetOTP"
      }
      this.loginService.getAPI(url, params).subscribe((res: any) => {
        switch (res.code) {
          case 200: {
            this.customTitle = 'r_password'
            this.toastrService.showToast("success", res.message, "", "BOTTOM_RIGHT");
          } break;
          case 400:
          case 404: {
            this.loginService.openDialog('Error', res.message, "", "danger");
          } break;
        }
      }, (err) => {
        console.log(err);
      })
    }
  }

  resetPassword() {
    if (this.resetOTP.length < 6) {
      this.toastrService.showToast("danger", "Enter valid OTP", "", "BOTTOM_RIGHT");
      return;
    } else if (this.pwd.length < 8) {
      this.toastrService.showToast("danger", "Password should be mininum 8 character", "", "BOTTOM_RIGHT");
      return;
    }
    if (this.pwd = this.confirmpwd) {
      let url = "auth/changePassword";
      let params = {
        password: this.pwd,
        otp: this.resetOTP,
        email: this.emailId
      }
      this.loginService.putAPI(url, params).subscribe((res: any) => {
        switch (res.code) {
          case 200: {
            this.toastrService.showToast("success", res.message, "", "BOTTOM_RIGHT");
            this.customTitle = ""
            // window.location.reload();
            this.login.emit();
          } break;
          case 400:
          case 404: {
            this.loginService.openDialog('Error', res.message, "", "danger");
          } break;
        }
      }, (err) => {
        console.log(err);
      })
    } else {
      this.toastrService.showToast("danger", "Password and confirm password should be same", "", "BOTTOM_RIGHT");
    }
  }

  verifyOTP() {
    let url = "auth/verifyEmail";
    if (this.emailOTP) {
      if (this.emailOTP.length < 5) {
        this.toastrService.showToast("danger", "Enter valid OTP", "", "BOTTOM_RIGHT");
        return;
      }
      let params = {
        email: this.email,
        otp: this.emailOTP
      }
      this.loginService.postAPI(url, params).subscribe((res: any) => {

        switch (res.code) {
          case 200: {
            this.toastrService.showToast("success", res.message, "", "BOTTOM_RIGHT");
            this.customTitle = "verified_password"
            // window.location.reload();
          } break;
          case 400:
          case 404: {
            this.loginService.openDialog('Error', res.message, "", "danger");
          } break;
        }
      }, (err) => {
        console.log("Please enter OTP")
      })
    } else {
      this.toastrService.showToast("danger", "Enter valid OTP", "", "BOTTOM_RIGHT");
    }

  }

  resendSignupOTP() {
    let url = "auth/generateOTP";
    let params = {
      email: this.email,
      type: "signUpOTP"
    }
    this.loginService.getAPI(url, params).subscribe((res: any) => {
      switch (res.code) {
        case 200: this.toastrService.showToast("success", res.message, "", "BOTTOM_RIGHT"); break;
        case 400:
        case 404: {
          this.loginService.openDialog('Error', res.message, "", "danger");
        } break;
      }
    }, (err) => {
      console.log(err)
    })
  }

  reloadPage(){
    window.location.reload()
  }
}
