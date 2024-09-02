import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-update-organization',
  templateUrl: './update-organization.component.html',
  styleUrls: ['./update-organization.component.scss']
})
export class UpdateOrganizationComponent implements OnInit {
  BreadCrumbsTitle: any = 'Update organization';
  organizationForm: FormGroup;
  uploadFile: any;
  orgData = {}
  url: any;
  type = 'url';
  fileUrl: string | ArrayBuffer;
  leaveForm: any;
  id: any;
  base64String: string;
  base64WithPrefix: any;
  eyeState: boolean = false;
  eyeIcon = 'bi bi-eye-slash'
  passwordType = "password";
  country: any = [];
  state: any = [];
  city: any = [];
  adminList: any = [];
  fileDataUrl:string;
  status:boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  adminForm: FormGroup;
  adminFormArray: FormArray;
  isAdminForm = false;
  adminInitiated: boolean;
  constructor(private _fb: FormBuilder,
    private api: ApiserviceService, private route: ActivatedRoute,
    private router: Router, private location: Location, private common_service: CommonServiceService,
    private cdr: ChangeDetectorRef) {
    this.id = this.route.snapshot.paramMap.get('id')
    this.initializeAdminFormArray()
  }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    // this.id = sessionStorage.getItem('user_id')
    this.initform();
    this.getOrgDetails();
   
  }

 
  openAdminForm(){
    this.adminintForm();
    this.isAdminForm=!this.isAdminForm
    this.adminInitiated = !this.adminInitiated;
  }
  
  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  
  deleteAdmin(index: number) {
    this.adminFormArray.removeAt(index);
    this.adminList.splice(index, 1);
    this.adminList[index].isEditing = false;
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
      org_logo: []
    })

  }
  
  adminintForm(){
    this.adminForm = this._fb.group({
      admin_name: ['', [Validators.pattern(/^[A-Za-z][A-Za-z\s]*$/),Validators.required]],
      admin_email: ['', [Validators.required, Validators.email]],
      admin_phone_number: ['', [Validators.required, this.phoneNumberLengthValidator()]],
      admin_status: [true]
    })
    
  }

  getAdminFormGroup(index: number): FormGroup {
    return this.adminFormArray.at(index) as FormGroup;
  }
  
  initializeAdminFormArray() {
    this.adminFormArray = this._fb.array(
      this.adminList.map(admin => this.createAdminFormGroup(admin))
    );
  }
  
  isSaveButtonDisabled(): boolean {
    // Check if the organization form is invalid
    if (this.organizationForm.invalid) {
      return true;
    }
  
    // Check if the admin form is invalid
    if (this.adminForm.invalid || this.adminForm.valid) {
      return true;
    }
  
    // Check if any admin form group in the admin list is invalid
    for (let i = 0; i < this.adminList.length; i++) {
      const adminFormGroup = this.getAdminFormGroup(i);
      if (adminFormGroup && adminFormGroup.invalid) {
        return true;
      }
    }
  
    // If all validations pass, return false (button is enabled)
    return false;
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

  
   addAdmin() {
   if (this.adminForm.valid) {
    const data = {
      admin_name:this.adminForm?.value['admin_name'],
      admin_email:this.adminForm?.value['admin_email'],
      admin_phone_number:this.adminForm?.value['admin_phone_number'],
      admin_status:this.adminForm?.value
    }
    
    this.adminList.push(data);
    this.adminFormArray.push(this.createAdminFormGroup(data));
    this.a['admin_name'].reset();
    this.a['admin_email'].reset();
    this.a['admin_phone_number'].reset();
    this.adminForm.patchValue({
      admin_status: [true]
    })
  }else{
    this.adminForm.markAllAsTouched()
  }
  }
  phoneNumberLengthValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumber: string = control.value;

      // Check if the input is a valid number and has a length of 10
      if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
        return { 'phoneNumberLength': true };
      }

      return null;
    };
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
   getOrgDetails() {
    this.api.getData(`${environment.live_url}/${environment.organization}?id=${this.id}&page_number=1&data_per_page=10`).subscribe(async res => {
      if (res) {
        let responseData = []
        let currentOrg = []
        responseData = res['result']['data']
        currentOrg = responseData[responseData.length - 1]
        // this.fileDataUrl = currentOrg['org_logo_path']
        await this.getCountry();
        if(currentOrg['org_country'] === 'India'){
          await this.getState('')
          setTimeout(async () => {
            await this.getCity(currentOrg['org_state'])
          }, 1000);
        }
        if (currentOrg['org_logo_path']) {
        // console.log(this.url,'this.url')
        fetch(currentOrg['org_logo_path'])
          .then(response => response.blob())
          .then(blob => {
            const fileReader: any = new FileReader();
            fileReader.onloadend = () => {
              const base64String = fileReader.result.split(',')[1]; // Extract the base64 string without the data URL prefix
              this.fileDataUrl = 'data:image/png;base64,' + base64String; // Prepend 'data:image/png;base64,' to the base64 string
              // this.orgData['org_logo'] =  base64String; 
           
            };
            fileReader.readAsDataURL(blob);
          });


      }
        const adminData = res['result']['data'][0].admin_details
        // this.adminList = res['result']['data'][0].admin_details
        const transformedAdminDetails = adminData?.map(admin => ({
          id:admin.id,
          admin_name: admin.u_first_name,
          admin_email: admin.u_email,
          admin_phone_number: admin.u_phone_no,
          admin_status: admin.u_status === 'True' ? true : false || admin.u_status === 'Active' ? true : false
      }));
        this.adminList = transformedAdminDetails 
        // console.log(this.adminList)
        this.initializeAdminFormArray();
        this.organizationForm.patchValue({
          org_qr_uniq_id: currentOrg['org_qr_uniq_id'],
          org_name: currentOrg['org_name'],
          org_email: currentOrg['org_email'],
          org_address: currentOrg['org_address'],
          org_city: currentOrg['org_city'],
          org_state: currentOrg['org_state'],
          org_country: currentOrg['org_country'],
          org_postal_code: currentOrg['org_postal_code'],
          admin_status: currentOrg['org_status'],
          org_subscription_plan: currentOrg['org_subscription_plan'],
          org_logo_path: currentOrg['org_logo_path'],
          org_logo_base_url: currentOrg['org_logo_base_url'],
          // org_logo: currentOrg['org_logo_path']
        })
       
      
      }
    }, (error => {
      this.api.showError(error.error.error.message)
    }))
   
  }
  // toggleFormControlState(index: number, isEnabled: boolean): void {
  //   const admin = this.adminList[index];
    
  //   if(this.adminFormArray.invalid){
  //    this.adminFormArray.markAllAsTouched()
  //   }else{
  //     admin.isEditing = isEnabled; // Toggle the editing state
  //   }
    

    
  // }
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
  createAdminFormGroup(admin): FormGroup {
    return this._fb.group({
      admin_name: [admin.admin_name, [Validators.required, Validators.pattern(/^[A-Za-z\s]*$/)]],
      admin_email: [admin.admin_email, [Validators.required, Validators.email]],
      admin_phone_number: [admin.admin_phone_number, [Validators.required,this.phoneNumberLengthValidator()]],
      admin_status: [admin.admin_status],
    });
  }
  
  
  onFocus() {
    this.type = 'file';
    this.organizationForm.get('org_logo')?.reset();
  }
  getCountry() {
    let data = {
      data_request: "GIVE_ALL_COUNTRY"
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
    let data = {
      data_request: "GIVE_COUNTRY_RELATED_STATE",
    }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`, data).subscribe(async(res: any) => {
      if(res){
      //console.log(res,"RES")
      this.state = res.result.data.data
      }
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))
  
  }
  getCity(event) {
    if(event){
      
      const state_code = this.state?.find((state: any) => state.name === event)?.iso2;
      let data = {
        data_request: "GIVE_STATE_RELATED_CITY",
        state_code: state_code
      }
    
    
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`, data).subscribe((res: any) => {
      if(res){
        // console.log(res,"RES")
        this.city = res.result.data.data
      }
     
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))
  }
  }
  
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
  triggerFileInput() {
    this.fileInput?.nativeElement?.click();
  }
 
    
    organizationSubmit() {
      // Check if the admin form array is valid and has at least one admin
      const isAdminFormValid = this.adminList.length > 0 && this.adminFormArray.valid;
    // Check if the organization form is valid
    if (this.organizationForm.invalid || this.adminInitiated && this.adminForm?.invalid) {
      this.organizationForm.markAllAsTouched();
      this.adminForm.markAllAsTouched();
      this.api.showError("Please enter the mandatory fields!");
      return;
    }
      // If admin form is empty or invalid, show error
      if (!isAdminFormValid) {
        this.adminFormArray.markAllAsTouched();
        this.api.showError("Please upadte with valid admin details.");
        return;
      }
    
      // Check if the organization form is valid
      if (this.organizationForm.invalid) {
        this.organizationForm.markAllAsTouched();
        this.api.showError("Please enter the mandatory fields!");
        return;
      }
      // Check if the admin form is valid but no admins are added
      if (this.adminInitiated && this.adminForm?.valid) {
        this.api.showWarning("Please add the admin details before submitting the form");
        return;
      }
    
      // Both forms are valid, proceed with submission
      const data = {
        org_qr_uniq_id: this.f['org_qr_uniq_id'].value,
        org_name: this.f['org_name'].value,
        org_address: this.f['org_address'].value,
        org_email: this.f['org_email'].value,
        org_city: this.f['org_city'].value,
        org_state: this.f['org_state'].value,
        org_country: this.f['org_country'].value,
        org_postal_code: this.f['org_postal_code'].value,
        org_logo: this.fileDataUrl,
        admin_details: this.adminList // Use the admin list to submit the data
      };
    
      this.api.updateData(`${environment.live_url}/${environment.organization}/${this.id}`, data).subscribe(
        res => {
          if (res['result']) {
            this.api.showSuccess("Organization updated successfully!");
            // this.organizationForm.reset();
            this.adminForm.reset()
            this.fileDataUrl = null;
            this.adminList = []; // Clear the admin list after submission
            this.getOrgDetails(); // Refresh the organization details
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
 
  
}
