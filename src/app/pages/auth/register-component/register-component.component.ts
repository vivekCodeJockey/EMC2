import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService,NbWindowService } from '@nebular/theme';
import { Observable, of, Subject } from 'rxjs';
import { AlertMessageComponent } from '../../../@custom/component/alert-message/alert-message.component';
import { TermandconditionComponent } from '../termandcondition/termandcondition.component';
import { CommonService } from '../../common.service';
import PasswordValidation from '../passwordValidation';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { nvtoastrService } from '../../../@theme/service/toastr/toastr.service';

@Component({
  selector: 'ngx-register-component',
  templateUrl: './register-component.component.html',
  styleUrls: ['./register-component.component.scss']
})
export class RegisterComponentComponent implements OnInit {


  signVerify: boolean = false;
  signupForm: UntypedFormGroup;
  submitted: boolean = false;
  loader: boolean = false;
  companyLoader: boolean = false;
  companyList: any = [];
  filteredOptions$: Observable<string[]>;
  companyNameUpdate = new Subject<string>();
  @ViewChild('autoInput') input;
  constructor(private loginService: CommonService, private fb: UntypedFormBuilder, private toastrService: nvtoastrService,
    private dialogService: NbDialogService,private windowService: NbWindowService) {
    this.companyNameUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        this.getCompanyList();
      });
  }



  ngOnInit(): void {
    if (localStorage.getItem('vEmail')) {
      this.signVerify = true;
    }
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required,Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required,Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: [{value:'+91',disabled: true}, Validators.required,],
      mobileNo: ['', [Validators.required,Validators.minLength(10)]],
      companyName: ['', Validators.required],
      designation: ['', Validators.required],
      gstNo: ['', [Validators.required,Validators.minLength(15)]],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      companyCity: ['', Validators.required],
      companyState: ['', Validators.required],
      companyCountry: ['', Validators.required],
      companyPinCode: ['', Validators.required],
      companyTelephone: ['', Validators.required],
      companyTeleExtension: ['', Validators.required],
      companyFax: ['', Validators.required],
      companyFaxExtension: ['', Validators.required],
      terms: [''],
    },
      { validators: [PasswordValidation.match('password', 'confirmPassword')] }
    )
      }
  private filter(value: string): string[] {
    const filterValue = value;
    return this.companyList.filter(optionValue =>
      optionValue ? optionValue["name"].toLowerCase().includes(filterValue) : []
    );
  }
  getFilteredOptions(value: string): Observable<string[]> {
    return of(value).pipe(
      map(filterString => this.filter(filterString)),
    );
  }

  onSelectionChange($event) {
    this.filteredOptions$ = this.getFilteredOptions($event);
  }
  getCompanyList() {
    this.companyLoader = true;
    let url = "auth/getCustomer?searchtext=''";
    if (this.input.nativeElement.value) {
      url = "auth/getCustomer?searchtext=" + this.input.nativeElement.value;
    }
    this.loginService.getAPI(url, {}).subscribe((res: any) => {
      switch (res.code) {
        case 200: {
          this.companyLoader = false;
          this.companyList = res.data;
          this.filteredOptions$ = of(res.data);
        } break;
        case 400:
        case 404: {
          this.dialogService.open(AlertMessageComponent, {
            context: {
              title: 'Error',
              message: res.message,
              status: "danger"
            },
          });
        } break;
      }
    }, (err) => {
      this.companyLoader = false;
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loader = true;
    if (this.signupForm.invalid) {
      this.submitted=false;
      this.loader = false;
      return;
    }
    // let regexp = new RegExp( /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(gmail|yahoo)\.[a-zA-Z](-?[a-zA-Z0-9])+$/);
    // if(regexp.test(this.signupForm.get('email').value)){
    //   this.submitted=false;
    //   this.loader = false;
    //   this.toastrService.showToast("danger", "SIGN UP Failed", "Please register using the Business/Offical Email Id ", "BOTTOM_RIGHT");
    //   return;
    // }
    if (!this.f.terms.value) {
      this.toastrService.showToast("danger", "SIGN UP Failed", "Please accept the terms and condition", "BOTTOM_RIGHT");
      this.submitted=false;
      this.loader = false;
      return;
    }
    let url = "auth/signup";
    let params = {
      ...this.signupForm.value
    }
    params.countryCode = '+91';
    this.loginService.postAPI(url, params).subscribe((res: any) => {

      switch (res.code) {
        case 200: {
          this.signVerify = true;
          this.toastrService.showToast("success", res.message, "", "BOTTOM_RIGHT");
          this.loader = false;
          this.submitted=false;
        } break;
        case 400:
        case 404: {
          this.dialogService.open(AlertMessageComponent, {
            context: {
              title: 'Error',
              message: res.message,
              status: "danger"
            },
          });
          this.submitted=false;
          this.loader = false;
        } break;
      }
    }, (err) => {
      console.log(err)
    })
  }

  openWindow(contentTemplate) {
    this.windowService.open(
      TermandconditionComponent,
      {
        title: 'TERMS OF SERVICE AGREEMENT',
        context: TermandconditionComponent.toString,
        hasBackdrop: false,
        closeOnEsc: false,
        buttons:{
          minimize: false,
          maximize: false,
          fullScreen: false,
        }
      },
    );
  }

  reloadPage(){
    window.location.reload()
  }

}