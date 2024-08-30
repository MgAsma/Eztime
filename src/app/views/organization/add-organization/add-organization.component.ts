import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-add-organization',
  templateUrl: './add-organization.component.html',
  styleUrls: ['./add-organization.component.scss']
})
export class AddOrganizationComponent implements OnInit {
  BreadCrumbsTitle: any = 'Create Organization';
  BreadCrumbsSubTitle:any = 'Organization'
  photoUrl: string | null = null;
  @ViewChild('fileInput') fileInput: ElementRef;
  organizationForm: FormGroup;
  uploadFile: any;
  url: any;
  type = 'url';
  fileUrl: string | ArrayBuffer;
  leaveForm: any;
  id: any;
  base64String: string;
  eyeState: boolean = false;
  eyeIcon = 'bi bi-eye-slash'
  passwordType = "password";
  state: any = [];
  city: any = [];
  country: any = [];
  adminForm: FormGroup;
  dataSource = new MatTableDataSource();
  status:boolean = false;
  adminList: any = [];
  
  constructor(private _fb: FormBuilder, private api: ApiserviceService, private location: Location, private common_service: CommonServiceService) { }

  fileDataUrl: string | ArrayBuffer | null = null; // Make sure this is declared in your component

  uploadImageFile(event: any) {
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        // Handle invalid file type
        console.error('Invalid file type. Only .jpg, .jpeg, and .png files are allowed.');
        this.fileDataUrl = null; // Clear any previously selected image
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fileDataUrl = e.target.result;
        if(reader.result){
          this.organizationForm.patchValue({ org_logo: this.fileDataUrl })
        }
       
      };
      reader.readAsDataURL(selectedFile);
    }
  }
  
  // triggerFileInput() {
  //   const fileInput = document.querySelector('#fileInput') as HTMLElement;
  //   fileInput.click();
  // }
  
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.common_service.setSubTitle(this.BreadCrumbsSubTitle)
    this.id = sessionStorage.getItem('user_id')
    this.initform();
    this.adminintForm();
    this.getCountry()
   
  }
  adminintForm(){
    this.adminForm = this._fb.group({
      admin_name: ['', [Validators.pattern(/^[A-Za-z][A-Za-z\s]*$/),Validators.required]],
      admin_email: ['', [Validators.required, Validators.email]],
      admin_phone_number: ['', [Validators.required, this.phoneNumberLengthValidator]],
      admin_status: [true],
    })
  }
  addAdmin() {
   if (this.adminForm.valid) {
    const data = {
      admin_name:this.adminForm?.value['admin_name'],
      admin_email:this.adminForm?.value['admin_email'],
      admin_phone_number:this.adminForm?.value['admin_phone_number'],
      admin_status:this.adminForm?.value['admin_status'] ? 'Active' : 'Inactive'
    }
    this.adminList.push(data);
    
    this.a['admin_name'].reset();
    this.a['admin_email'].reset();
    this.a['admin_phone_number'].reset();
    this.adminForm.patchValue({
      admin_status: [true]
    })
  }else{
    
    
    this.organizationForm.markAllAsTouched()
  }
  }
  triggerFileInput() {
    this.fileInput?.nativeElement?.click();
  }
  async clearImage() {
  await this.triggerFileInput();
    // this.fileDataUrl = null;
    // this.f['org_logo'].reset();
  }
  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  initform() {
    this.organizationForm = this._fb.group({
      org_qr_uniq_id: ['22121'],
      org_name: ['', [Validators.pattern(/^[A-Za-z][A-Za-z\s]*$/), Validators.required]],
      org_address: ['', [Validators.pattern(/^\S.*$/)]],
      org_email: ['', [Validators.required, Validators.email]],
      org_phone: [''],
      org_mobile: [''],
      org_fax: [''],
      org_website: [''],
      org_city: ['', [Validators.required]],
      org_state: ['', [Validators.required]],
      org_country: ['', [Validators.required]],
      org_postal_code: ['',[Validators.pattern('^\\d{6}$')]],
      org_profile_updated_status: [''],
      org_default_currency_type: [''],    
      org_subscription_plan: [''],
      org_logo_path: [''],
      org_logo_base_url: [''],
      page: [''],
      org_logo: ['', [Validators.required, this.fileFormatValidator]],
    })

  }
  deleteAdmin(index: number) {
    this.adminList.splice(index, 1);
  }
  phoneNumberLengthValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const phoneNumber = control.value;
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      return { 'phoneNumberLength': true };
    } else {
      return null;
    }
  }

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
  

  onFocus() {
    this.type = 'file'
    this.f['org_logo'].markAsDirty()
    this.f['org_logo'].markAsTouched()
  }
  // uploadImageFile(event: any) {
  //   this.uploadFile = event.target.files[0];
  //   if (event.target.files && event.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0])
  //     reader.onload = (event: any) => {
  //       this.url = event.target.result;
  //       this.fileUrl = reader.result
  //       if(reader.result){
  //         this.organizationForm.patchValue({ org_logo: this.fileUrl })
  //       }
       
  //     }
  //   }
  // }
  getCountry() {
    let data = {
      "data_request": "GIVE_ALL_COUNTRY",
    }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`, data).subscribe((res: any) => {
      // console.log(res,"RES")
      this.country = res.result.data.data
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))
  }
  onFocusCountry() {
    this.organizationForm.patchValue({
      org_state: '',
      org_city: ''
    })
  }

  getState(event) {
    if(event){
    let data = {
      data_request: "GIVE_COUNTRY_RELATED_STATE",
    }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`, data).subscribe((res: any) => {
      if(res){
      this.state = res.result.data.data
      this.fileDataUrl = null;
      // this.getCity(event);
      }
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))
  }
  }
  getCity(event) {
    
    const state_code = this.state.find((state: any) => state.name === event)?.iso2;
 
   
    let data = {
      data_request: "GIVE_STATE_RELATED_CITY",
      state_code: state_code
    }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`, data).subscribe((res: any) => {
      //  console.log(res,"RES")
      this.city = res.result.data.data
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))

  }
  organizationSubmit() {
    if(this.adminForm.valid && !this.adminList.length){
     this.addAdmin()
    }
    if (this.organizationForm.valid && this.adminForm.invalid && this.adminList.length) {
      this.a['admin_name'].reset();
      this.a['admin_email'].reset();
      this.a['admin_phone_number'].reset();
      this.a['admin_status'].reset();
      const data = {
        org_qr_uniq_id: this.f['org_qr_uniq_id'].value,
        org_name: this.f['org_name'].value,
        org_address: this.f['org_address'].value,
        org_email: this.f['org_email'].value,
        org_city: this.f['org_city'].value,
        org_state: this.f['org_state'].value,
        org_country: this.f['org_country'].value,
        org_postal_code: this.f['org_postal_code'].value,
        org_logo: this.f['org_logo'].value,
        admin_details: this.adminList
      };
  
      console.log(data, "DATA");
  
      this.api.postData(`${environment.live_url}/${environment.organization}`, data).subscribe(
        res => {
          if (res['result'].status) {
            this.api.showSuccess("Organization admin created successfully!");
            this.organizationForm.reset();
            this.fileDataUrl = null;
            this.adminList = []; // Clear the admin list after submission
          } 
        },
        error => {
          this.api.showError(error.error.error.message);
        }
      );
    }
    // If no admins are added and the form is invalid, show an error
   else{
      this.organizationForm.markAllAsTouched();
      if(this.adminForm.invalid && !this.adminList.length){
        this.adminForm.markAllAsTouched()
      }
      //this.adminForm.markAllAsTouched()
      this.api.showError("Please enter the mandatory fields!");
    } 
    
    
  }
  
  get f() {
    return this.organizationForm.controls;
  }
  get a(){
    return this.adminForm.controls;
  }
  setBgColor(data?): any {

    if (data.value) {
      //console.log(data.value)
      return 'back-color'
    }
    else {
      return ''
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
}
