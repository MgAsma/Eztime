import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';
import { MatStepper } from '@angular/material/stepper';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']

})
export class RegisterComponent {
  @ViewChild('stepper') stepper!: MatStepper;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  isEditable = false;
  registrationForm: FormGroup;
  submitted = false;


  params = {
    pagination: "FALSE"
  }
  orgId: any;
  country:any = [];
  state: any = [];
  city:any = [];
  apiUrl = 'https://api.postalpincode.in/pincode';

  sendOtpButtonOfOrg: boolean = true;
  orngEmailVerified: boolean = false;

  sendOtpButtonOfAdmin: boolean = true;
  adminEmailVerified: boolean = false;

  orgSendCodeButton: boolean = false;
  adminSendCodeButton:boolean = false;
  
  orgResendOtp:boolean = false;
  disableOrgResendBtn = false;

  adminResendOtp:boolean = false;
  disableAdminResendBtn:boolean = false;

  countDownOrg: number;
  countDownAdmin:number;
  timer: any;
  showSuccessMessage:boolean = false
  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private api: ApiserviceService,
    private http: HttpClient,
    private router: Router) { }

  ngOnInit() {
    this.orgId = JSON.parse(sessionStorage.getItem('org_id'))
    this.getCountry();
    this.initStepper();
  }

  get uFirstNameControl(): FormControl {
    return this.firstFormGroup.get('organization_name') as FormControl;
  }

  initStepper() {
    // let passwordRegex = 
    this.firstFormGroup = this.formBuilder.group({
      organization_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/), Validators.maxLength(50)]],
      organization_email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      organization_otp: ['', Validators.required],
      org_email_verified: [''],
      admin_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/), Validators.maxLength(50)]],
      admin_email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      admin_otp: ['', [Validators.required]],
      admin_email_verified: [''],
    });
    this.secondFormGroup = this.formBuilder.group({
      country: ['', Validators.required],
      postal_code:['', Validators.required],
      city:['', Validators.required],
      state: ['', [Validators.required]],
      address: ['', [Validators.required,Validators.maxLength(50)]],
    });
    this.thirdFormGroup = this.formBuilder.group({})
  }
  // onFocusProfileImg(){
  //   this.thirdFormGroup.get('profile_base64')?.reset();
  // }
 
  
  checkValidation(event) {
    if (event == 'step1') {
      this.firstFromValidtion();
    }
    else if (event == 'step2') {
      this.createOrganization();
    }

  }


  onSubmit() {

    let data = {
      organization_name: this.firstFormGroup.value.organization_name,
      organization_email: this.firstFormGroup.value.organization_email,
      admin_name: this.firstFormGroup.value.admin_name,
      admin_email: this.firstFormGroup.value.admin_email,
      admin_otp: this.firstFormGroup.value.admin_otp,
      email: this.secondFormGroup.value.email,
      password: this.secondFormGroup.value.password,
      org_code: this.secondFormGroup.value.org_code,
      u_designation: this.secondFormGroup.value.u_designation,
      u_date_of_joining: this.secondFormGroup.value.u_date_of_joining,
      center_id: this.thirdFormGroup.value.center_id,
      user_reporting_manager_ref_id: this.thirdFormGroup.value.user_reporting_manager_ref_id,
      profile_base64: this.thirdFormGroup.value.profile_base64,
      // prefix_suffix_id: this.thirdFormGroup.value.prefix_suffix_id,
      department_id: this.thirdFormGroup.value.department_id,
      role_id: this.thirdFormGroup.value.role_id,
      user_role_id: Number(this.fourthFormGroup.value.user_role_id),
      cost_center_id: this.fourthFormGroup.value.cost_center_id,
      // tags: [Number(this.fourthFormGroup.value.tags)],
      organization_id: this.orgId,
      user_status: this.fourthFormGroup.value.user_status
    }
    // stop here if form is invalid
    if (this.fourthFormGroup.invalid) {
      this.fourthFormGroup.markAllAsTouched()
      //console.log(this.fourthFormGroup.value,"FOURTH FORM")
      // if (this.fourthFormGroup.value.tags == null) {
      //   this.submitted = true
      // }
      this.api.showError('Invalid!')
    }
    else {
      this.api.register(data).subscribe((res: any) => {
        if (res) {
          if (res['result']) {
            this.api.showSuccess('People added successfully!!')
            setTimeout(() => {
              location.reload()
            }, 500);
            sessionStorage.setItem('centerId', res['result'].center_id)
          }
          else {
            if (res) {
              this.api.showError(res.error)
              //console.log(res,"ERROR") 
            }
          }
        }
      }, (error: any) => {
        this.api.showError(error.error.error.message)
        //console.log(error,"ERROR")
      })
    }


  }

  getCountry() {
    this.api.getData(`${environment.live_url}/${environment.country}/`).subscribe((res: any) => {
      this.country = res
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))
  }

  
  getState(event) {
    if(event){
  
    this.api.getData(`${environment.live_url}/${environment.state}/?country_id=${this.secondFormGroup.value.country}`).subscribe((res: any) => {
      if(res){
      this.state = res;
      // this.getCity(event);
      }
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))
  }
  }
  getCity(event) {
    this.api.getData(`${environment.live_url}/${environment.city}/?state_id=${this.secondFormGroup.value.state}`).subscribe((res: any) => {
      this.city = res
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))

  }

  goBackPreviousPage() {
    this.router.navigate(['./login'])
  }


  preventSpace(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }
  validateKeyPress(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode;
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 37 && keyCode !== 39) {
      event.preventDefault();
    }
  }

  emailcheck(event: any) {
    if (this.firstFormGroup.value.organization_email == this.firstFormGroup.value.admin_email) {
      this.api.showWarning('Admin email must be unique')
    }
  }
  requestOtp(email: any, data: any) {
    // console.log(email, data)
    const emailControl = this.firstFormGroup.get(data);
    if (emailControl && emailControl.valid) {
      // console.log('valid');
      this.requestOtpMail(email, data)
    } else {
      // console.log('invalid');
    }
  }

  requestOtpMail(email: any, data: any) {
    let temp = {
      [data]: email
    }
    if (this.firstFormGroup.value.organization_email == this.firstFormGroup.value.admin_email) {
      this.api.showWarning('Admin email must be unique')
    } else {
      if(data==='organization_email'){
        this.orgSendCodeButton = true;
      } else{
        this.adminSendCodeButton = true;
      }
      this.api.emailVerificationForSelfRegistration(temp).subscribe(
        (res: any) => {
          this.api.showSuccess(res.message);
          if (data === 'organization_email') {
            this.sendOtpButtonOfOrg = false;
            this.orgSendCodeButton = false;
            this.startCoutner(data);
          } else {
            this.sendOtpButtonOfAdmin = false
            this.adminSendCodeButton = false;
            this.startCoutner(data);
          }
        },
        (error: any) => {
          this.api.showError(error.error.message)
        }
      )
    }
  }

  verifyOtp(otp: any, data: any) {
    const otpControl = this.firstFormGroup.get(data);
    if (otpControl && otpControl.valid) {
      // console.log('valid');
      this.verifyOtpMail(otp, data)
    } else {
      // console.log('invalid');
    }
  }
  verifyOtpMail(email: any, data: any) {
    let temp = {
      [data]: email
    }
    this.api.otp(temp).subscribe(
      (res: any) => {
        this.api.showSuccess(res.message);
     if(res){
     this.api.showSuccess(res.message)
        if (data === 'organization_otp') {
          this.sendOtpButtonOfOrg = true;
          this.orngEmailVerified = true;
          this.firstFormGroup.patchValue({ org_email_verified: 'verified'});
        } else {
          this.sendOtpButtonOfAdmin = true;
          this.adminEmailVerified = true;
          this.firstFormGroup.patchValue({ admin_email_verified: 'verified'});
        }
      }
      },
      (error: any) => {
        this.api.showError(error.error.message)
      }
    )
  }

  firstFromValidtion() {
    console.log(this.firstFormGroup.value)
    if (this.firstFormGroup.invalid) {
      this.firstFormGroup.markAllAsTouched()
      if (this.firstFormGroup.value.organization_otp == '' || this.firstFormGroup.value.admin_otp == '') {
        this.api.showWarning('OTP Verification is pending')
      }
    } else if (this.firstFormGroup.value.organization_email == this.firstFormGroup.value.admin_email) {
      this.api.showWarning('Admin email must be unique')
    } else if (this.firstFormGroup.value.org_email_verified=='') {
      this.api.showWarning('Organization email verification is pending')
    } else if(this.firstFormGroup.value.admin_email_verified==''){
      this.api.showWarning('Admin email verification is pending')
    }
     else {
      console.log(this.firstFormGroup.value)
      this.stepper.next();
    }
  }
  getCountryStateCity(event:any){
    // if(event.target.value.length==6){
    // this.http.get(`${this.apiUrl}/${event.target.value}`).subscribe(
    //   (res:any)=>{
    //     console.log(res)
    //   }
    // );
    // }
  }

  resendOtpButton(email:any,data:any){
    let temp = {
      [data]: email
    }
    if(data==='organization_email'){
      this.disableOrgResendBtn = true;
      this.resendOptAPICall(temp,data);
    } else{
      this.disableAdminResendBtn = true;
      this.resendOptAPICall(temp,data);
    }
  }

  resendOptAPICall(data:any,text:any){
    this.api.emailVerificationForSelfRegistration(data).subscribe(
      (res:any)=>{
        this.api.showSuccess(res.message);
        this.startCoutner(text);
      },
      (error:any)=>{
        this.api.showError(error.error.message)
      }

    )
  }



  startCoutner(data:any){
    if(data==='organization_email'){
      this.disableOrgResendBtn = false;
      this.orgResendOtp = false;
      this.countDownOrg = 59;
      this.timer = setInterval(() => {
        if (this.countDownOrg > 0) {
          this.countDownOrg--;
        } else {
          clearInterval(this.timer);
          this.orgResendOtp = true;
        }
      }, 1000);
    } else {
      this.disableAdminResendBtn = false;
      this.adminResendOtp = false;
      this.countDownAdmin = 59;
      this.timer = setInterval(() => {
        if (this.countDownAdmin > 0) {
          this.countDownAdmin--;
        } else {
          clearInterval(this.timer);
          this.adminResendOtp = true;
        }
      }, 1000);
    }
  }


  createOrganization(){
    if(this.secondFormGroup.invalid){
      this.secondFormGroup.markAllAsTouched();
    }
    else{
      const data = {
        organization_name: this.firstFormGroup.value['organization_name'],
        email: this.firstFormGroup.value['organization_email'],
        admin_details: [{'admin_name':this.firstFormGroup.value['admin_name'],'admin_email_id':this.firstFormGroup.value['admin_email'],'is_active':true}],
        address: this.secondFormGroup.value['address'],
        city: this.secondFormGroup.value['city'],
        state: this.secondFormGroup.value['state'],
        country: this.secondFormGroup.value['country'],
        postal_code: this.secondFormGroup.value['postal_code'],
        // organization_image: null
      };
      console.log(data)
      this.api.postData(`${environment.live_url}/${environment.organization}/`, data).subscribe(
        res => {
          if (res) {
                this.showSuccessMessage = true
          }
        },
        error => {
          this.api.showError(error.error.message);
        }
      )
    }
  }

  
}


