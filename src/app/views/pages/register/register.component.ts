import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']

})
export class RegisterComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  isEditable = false;
  registrationForm: FormGroup;
  submitted = false;

  allTags: any = [];

  reportingManagerId: any = [];
  departmentId: any = [];

  params = {
    pagination: "FALSE"
  }
  allPrefix: any = [];
  allCenter: any = [];
  allRole: any = [];
  allCostCenter: any = [];
  uploadFile: any;
  url: any;
  fileUrl: string | ArrayBuffer;
  peopleForm: any;
  eyeState: boolean = false;
  eyeIcon = 'bi bi-eye-slash'
  passwordType = "password"
  orgId: any;
  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private api: ApiserviceService,
    private router: Router) { }

  ngOnInit() {
    this.orgId = JSON.parse(sessionStorage.getItem('org_id'))
    // this.getPrefix()
    // this.getTag()
    this.getCostCenter()
    this.getReportingManager()
    this.getDepartment()
    this.getCenter()
    this.getUserRole()
    this.initStepper()
  }

  get uFirstNameControl(): FormControl {
    return this.firstFormGroup.get('u_first_name') as FormControl;
  }

  initStepper() {
    // let passwordRegex = 
    this.firstFormGroup = this.formBuilder.group({
      u_first_name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/), Validators.maxLength(20)]],
      u_last_name: ['', [Validators.required, , Validators.pattern(/^[a-zA-Z]+$/), Validators.minLength(1), Validators.maxLength(20)]],
      u_gender: ['', Validators.required],
      u_marital_status: ['', Validators.required],
      u_phone_no: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
    });
    this.secondFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}$/)]],
      org_code: ['', [Validators.required]],
      u_designation: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      u_date_of_joining: ['', Validators.required],

    });
    this.thirdFormGroup = this.formBuilder.group({
      center_id: ['', Validators.required],
      user_reporting_manager_ref_id: [''],
      profile_base64: ['', [Validators.required, this.fileFormatValidator]],
      // prefix_suffix_id: ['', Validators.required],
      department_id: ['', Validators.required],
      role_id: [1],

    })
    this.fourthFormGroup = this.formBuilder.group({
      user_role_id: ['', Validators.required],
      cost_center_id: ['', Validators.required],
      // tags: ['', Validators.required],
      user_status: ['', Validators.required],
      // organization_id:['',Validators.required]
    })
  }
  // onFocusProfileImg(){
  //   this.thirdFormGroup.get('profile_base64')?.reset();
  // }
  fileFormatValidator(control: AbstractControl): ValidationErrors | null {
    const allowedFormats = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
    const file = control.value;
    if (file) {
      const fileExtension = file.substr(file.lastIndexOf('.')).toLowerCase();
      if (!allowedFormats.includes(fileExtension)) {
        return { accept: true };
      }
    }
    return null;
  }
  uploadImageFile(event: any) {
    this.uploadFile = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.fileUrl = reader.result
        this.thirdFormGroup.patchValue({ profile_base64: this.fileUrl })
      }
    }
  }
  checkValidation(event) {
    if (event == 'step1') {
      this.firstFormGroup.markAllAsTouched()
    }
    else if (event == 'step2') {
      this.secondFormGroup.markAllAsTouched()
    }
    else if (event == 'step3') {
      this.thirdFormGroup.markAllAsTouched()
    }
    else if (event == 'step4') {
      this.fourthFormGroup.markAllAsTouched()
    }
  }
  showPassword() {
    this.eyeState = !this.eyeState
    if (this.eyeState == true) {
      this.eyeIcon = 'bi bi-eye'
      this.passwordType = 'text'
    }
    else {
      this.eyeIcon = 'bi bi-eye-slash'
      this.passwordType = 'password'
    }

  }

  onSubmit() {

    let data = {
      u_first_name: this.firstFormGroup.value.u_first_name,
      u_last_name: this.firstFormGroup.value.u_last_name,
      u_gender: this.firstFormGroup.value.u_gender,
      u_marital_status: this.firstFormGroup.value.u_marital_status,
      u_phone_no: this.firstFormGroup.value.u_phone_no,
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

  getUserRole() {
    this.api.getUserAccess(`page_number=1&data_per_page=2&pagination=FALSE&organization_id=${this.orgId}`).subscribe((data: any) => {
      if (data.result.data) {
        const role = data.result.data
        const filteredRole = role.filter(role => role.role_status !== 'Inactive')
        this.allRole = filteredRole;
      }

    }, (error: any) => {
      this.api.showError(error.error.error.message)
      //console.log(error,"ERROR")
    }
    )
  }
  getDepartment() {
    this.api.getDepartmentDetails(this.params, this.orgId).subscribe((data: any) => {
      //console.log(data.result.data,"DATA")
      if (data) {
        const department = data.result.data
        const filteredDepartment = department.filter(depart => !depart.od_status.includes('Inactive'))
        this.departmentId = filteredDepartment;
      }
    }, (error: any) => {
      this.api.showError(error.error.error.message)
      //console.log(error,"ERROR")
    }
    )
  }
  getReportingManager() {
    this.api.getData(`${environment.live_url}/${environment.profile_custom_user}?filter=MANAGER&page_number=1&data_per_page=2&pagination=FALSE&organization_id=${this.orgId}`).subscribe((data: any) => {
      if (data.result.data) {
        const reportingManager = data.result.data
        const filteredRepotingManager = reportingManager.filter(manager => !manager.u_status?.includes('Inactive'))
        this.reportingManagerId = filteredRepotingManager;
      }

    }, (error: any) => {
      this.api.showError(error.error.error.message)
      //console.log(error,"ERROR")
    }

    )
  }
  getTag() {
    this.api.getTagDetails(this.params, this.orgId).subscribe((data: any) => {
      if (data.result.data) {
        const tags = data.result.data
        const filteredTags = tags.filter(tags => !tags.tage_status.includes('Inactive'))
        this.allTags = filteredTags;
      }
    }, (error: any) => {
      this.api.showError(error.error.error.message)
      //console.log(error,"ERROR")
    }
    )
  }
  getPrefix() {
    this.api.getPrefixSuffixDetails(this.params, this.orgId).subscribe((data: any) => {
      if (data.result.data) {
        this.allPrefix = data.result.data;
      }
    }, (error: any) => {
      this.api.showError(error.error.error.message)
      //console.log(error,"ERROR")
    }

    )
  }
  getCostCenter() {
    this.api.getCostCenterDetails(this.params).subscribe((data: any) => {
      //console.log(data.result.data,"COST")
      if (data.result.data) {
        const costCenter = data.result.data
        const filterdCostCenter = costCenter.filter(cc => !cc.occ_status?.includes('Inactive'))
        this.allCostCenter = filterdCostCenter;
      }
    }, (error: any) => {
      this.api.showError(error.error.error.message)
      //console.log(error,"ERROR")
    }
    )
  }
  getCenter() {
    this.api.getCenterDetails(this.params, this.orgId).subscribe((data: any) => {
      if (data.result.data) {
        const center = data.result.data;
        const filteredCenter = center.filter(center => !center.center_status?.includes('Inactive'))
        this.allCenter = filteredCenter;
        console.log(this.allCenter, "CENTER ID")
      }
    }, (error: any) => {
      this.api.showError(error.error.error.message)
      //console.log(error,"ERROR")
    })
  }
  goBackPreviousPage() {
    this.location.back();
  }
}


