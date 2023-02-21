import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../common.service';
import { nvtoastrService } from '../../../@theme/service/toastr/toastr.service';

@Component({
  selector: 'ngx-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {

  userForm: UntypedFormGroup;
  email:string;
  submitted=false;
  loader=false;
  userDtl:any;
  fieldSize:any ="small"
  showBtn=false;
  constructor(private fb: UntypedFormBuilder,private userService: CommonService,private toastrService: nvtoastrService) { }

  ngOnInit(): void {
    let accountInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.userDtl= accountInfo.userDetailsEntity
    let companyDtl=this.userDtl.companyInfo
    this.email=accountInfo.email
    this.showBtn=(!this.userService.isAppInternal());
    this.userForm = this.fb.group({
      email: this.email,
      password: accountInfo.password,
      firstName: [this.userDtl.firstName, Validators.required],
      lastName: [this.userDtl.lastName, Validators.required],
      countryCode: ['+91', Validators.required],
      mobileNo: [this.userDtl.mobileNo, Validators.required],
      companyName: [companyDtl.name, Validators.required],
      designation: [this.userDtl.designation, Validators.required],
      gstNo: [companyDtl.gstNo, Validators.required],
      address1: [companyDtl.address1, Validators.required],
      address2: [companyDtl.address2, Validators.required],
      companyCity: [companyDtl.city, Validators.required],
      companyState: [companyDtl.state, Validators.required],
      companyCountry: [companyDtl.country, Validators.required],
      companyPinCode: [companyDtl.pinCode, Validators.required],
      companyTelephone: [companyDtl.telephone, Validators.required],
      companyTeleExtension: [''],
      companyFax: [companyDtl.fax, Validators.required],
      companyFaxExtension: [''],
    }    
    )
  }

  onSubmit() {
    this.submitted = true;
    this.loader = true;
    if (this.userForm.invalid) {
      this.submitted=false;
      this.loader = false;
      return;
    }
    let url = "/user/updateProfile";
    let params = {
      ...this.userForm.value
    }
    this.userService.putAPI(url, params).subscribe((res: any) => {
      switch (res.code) {
        case 200: {
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          this.toastrService.showToast("success", res.message, "", "BOTTOM_RIGHT");
          this.loader = false;
          this.submitted=false;
        } break;
        case 400:
        case 404: {
          this.userService.openDialog('Error',res.message,"","danger")
          this.submitted=false;
          this.loader = false;
        } break;
      }
    }, (err) => {
      console.log(err)
    })
  }
}
