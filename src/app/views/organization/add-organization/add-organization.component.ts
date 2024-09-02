import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, FormArray } from '@angular/forms';
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
  isAdminForm = false;
  adminInitiated: boolean = false;
  adminFormArray: FormArray;
  constructor(private _fb: FormBuilder, private api: ApiserviceService, private location: Location, private common_service: CommonServiceService) {
    this.initializeAdminFormArray();
   }

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
  
 
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.common_service.setSubTitle(this.BreadCrumbsSubTitle)
    this.id = sessionStorage.getItem('user_id')
    this.initform();
    this.getCountry()
   
  }
  createAdminFormGroup(admin): FormGroup {
    return this._fb.group({
      admin_name: [admin.admin_name, [Validators.required, Validators.pattern(/^[A-Za-z\s]*$/)]],
      admin_email: [admin.admin_email, [Validators.required, Validators.email]],
      admin_phone_number: [admin.admin_phone_number, [Validators.required,this.phoneNumberLengthValidator]],
      admin_status: [admin.admin_status],
    });
  }
  initializeAdminFormArray() {
    this.adminFormArray = this._fb.array(
      this.adminList.map(admin => this.createAdminFormGroup(admin))
    );
  }
  
  getAdminFormGroup(index: number): FormGroup {
    return this.adminFormArray.at(index) as FormGroup;
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
   if (this.adminForm.invalid) {
    this.adminForm.markAllAsTouched()
    this.organizationForm.markAllAsTouched()
    this.api.showWarning("Please enter the mandatory fields")
  }else{
    const data = {
      admin_name:this.adminForm?.value['admin_name'],
      admin_email:this.adminForm?.value['admin_email'],
      admin_phone_number:this.adminForm?.value['admin_phone_number'],
      admin_status:this.adminForm?.value['admin_status'] 
    }
    this.adminList.push(data);
    this.adminFormArray.push(this.createAdminFormGroup(data));
    this.a['admin_name'].reset();
    this.a['admin_email'].reset();
    this.a['admin_phone_number'].reset();
    this.adminForm.patchValue({
      admin_status: [true]
    })
    this.isAdminForm = !this.isAdminForm;
  }
  }
  originalAdminData: any[] = [];

  toggleFormControlState(index: number, isEditing: boolean): void {
    const adminFormGroup = this.getAdminFormGroup(index);
    if (isEditing) {
      // Store the initial values before editing
      this.originalAdminData[index] = adminFormGroup.value;
      this.adminList[index].isEditing = true;
    } else {
      // Revert to the original values when cancelling
      adminFormGroup.setValue(this.originalAdminData[index]);
      this.adminList[index].isEditing = false;
    }
  }
 
  saveAdmin(index: number) {
    const adminForm = this.getAdminFormGroup(index);
    
    if (adminForm.invalid) {
        // Mark all controls as touched to trigger validation messages
        this.adminFormArray.markAllAsTouched()
        adminForm.markAllAsTouched();
        // this.api.showError('Invalid admin form')
      
        }else{
          // If the form is valid, update the admin details
          this.adminList[index] = {
            ...this.adminList[index],
            admin_name: adminForm.value.admin_name,
            admin_email: adminForm.value.admin_email,
            admin_phone_number: adminForm.value.admin_phone_number,
            admin_status: adminForm.value.admin_status 
          };

          // Show the success message
          // this.api.showSuccess("Admin details updated successfully!");
          this.adminList[index].isEditing = false;
        
    }
}
  openAdminForm(){
    this.adminintForm();
    this.isAdminForm=!this.isAdminForm
    this.adminInitiated = !this.adminInitiated;
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
    // Check if the organization form is invalid
    if (this.organizationForm.invalid || this.adminInitiated && this.adminForm?.invalid) {
      this.organizationForm.markAllAsTouched();
      this.adminForm.markAllAsTouched();
      this.api.showError("Please enter the mandatory fields!");
      return;
    }
    // If admin form is invalid and no admins are added, show an error
    if (this.adminInitiated && this.adminForm?.invalid) {
      this.adminForm.markAllAsTouched();
      this.api.showError("Please enter the mandatory fields!");
      return;
    }
    // Check if the admin form is valid but no admins are added
    if (this.adminInitiated && this.adminForm?.valid) {
      this.api.showWarning("Please add the admin details before submitting the form");
      return;
    }
  
    // Prepare data for submission
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
  
    // If everything is valid, submit the form
    this.api.postData(`${environment.live_url}/${environment.organization}`, data).subscribe(
      res => {
        if (res['result'].status) {
          this.api.showSuccess("Organization admin created successfully!");
          this.organizationForm.reset();
          // this.adminInitiated ?  this.isAdminForm = !this.isAdminForm : this.isAdminForm;
          this.adminInitiated = !this.adminInitiated;
          this.fileDataUrl = null;
          this.adminList = []; // Clear the admin list after submission
        }
      },
      error => {
        this.api.showError(error.error.error.message);
      }
    );
  
  
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
