import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  constructor(private _fb: FormBuilder,
    private api: ApiserviceService, private route: ActivatedRoute,
    private router: Router, private location: Location, private common_service: CommonServiceService,
    private cdr: ChangeDetectorRef,
    private modalService:NgbModal) {
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
    
  }
  
  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  
   deleteAdmin(adminId,index: number) {
    
    this.adminFormArray.removeAt(index);
    this.adminList.splice(index, 1);
    const data = {
      admin_details: this.adminList // Use the admin list to submit the data
    };
    if(adminId){
      this.api.delete(`${environment.live_url}/${environment.organization}/${this.id}?admin_id=${adminId}`, ).subscribe(
        res => {
          if (res['result']) {
            this.api.showSuccess("Admin deleted successfully!");
            // this.organizationForm.reset();
            this.adminForm.reset();
            this.isAdminForm = true;
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
   
  
  }
  initform() {
    this.organizationForm = this._fb.group({
      organization_name: ['', [Validators.pattern(/^[A-Za-z][A-Za-z\s]*$/), Validators.required]],
      address: ['', [Validators.pattern(/^\S.*$/)]],
      email: ['', [Validators.required, Validators.email]],
     
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['', [Validators.required]],
      postal_code: ['',[Validators.pattern('^\\d{6}$')]],
      organization_image: []
    })

  }
  
  adminintForm(){
    this.adminForm = this._fb.group({
      admin_name: ['', [Validators.pattern(/^[A-Za-z][A-Za-z\s]*$/),Validators.required]],
      admin_email_id: ['', [Validators.required, Validators.email,this.emailMatchValidator()]],
      admin_phone_number: ['', [Validators.required, this.phoneNumberLengthValidator()]],
      is_active: [true],
      isEditing:false,
      id:[]
    })
    
  }
//"admin_details": [
            // {
            //     "id":25,
            //     "admin_name": "aparna ek",
            //     "admin_email_id_id": "aparna@ekfrazo.in",
            //     "admin_phone_number": 9988899871,
            //     "is_active": false
            // },
  getAdminFormGroup(index: number): FormGroup {
    return this.adminFormArray.at(index) as FormGroup;
  }
  
  initializeAdminFormArray() {
    this.adminFormArray = this._fb.array(
      this.adminList.map(admin => this.createAdminFormGroup(admin,this.adminFormArray))
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
    
    if (this.adminFormArray.invalid) {
        // Mark all controls as touched to trigger validation messages
        this.adminFormArray.markAllAsTouched()
        adminForm.markAllAsTouched();
        // this.api.showError('Invalid admin form')
      
        }else{
          // If the form is valid, update the admin details
          const data = {
            admin_details: []  // Initialize adminList as an empty array or assign it directly
          };
          
          this.adminList[index] = {
            ...this.adminList[index],
            admin_name: adminForm.value.admin_name,
            admin_email_id: adminForm.value.admin_email_id,
            admin_phone_number: adminForm.value.admin_phone_number,
            is_active: adminForm.value.is_active == true ? 'Active' : 'Inactive',
            isEditing: adminForm.value.isEditing,
            id: adminForm.value.id
          };
          
          // Add the updated adminList to the data object
          data.admin_details = [...this.adminList]; 
        
        
          this.adminList[index].isEditing = false;
      this.api.updateData(`${environment.live_url}/${environment.organization}/${this.id}`,data).subscribe(
        res => {
          if (res['result']) {
            this.api.showSuccess("Admin details updated successfully!");
            // this.organizationForm.reset();
            this.adminForm.reset();
            this.isAdminForm=false;
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
}

  
   addAdmin() {
   if (this.adminForm.valid) {
    
    const  data = {
      admin_name:this.adminForm?.value['admin_name'],
      admin_email_id:this.adminForm?.value['admin_email_id'],
      admin_phone_number:this.adminForm?.value['admin_phone_number'],
      is_active:this.adminForm?.value['is_active'] == true ? 'Active' : 'Inactive'
    }
    
    alert(this.adminForm?.value['is_active'])
    this.adminList.push(data);
    // this.adminFormArray.insert(0,this.createAdminFormGroup(data));

    this.adminFormArray.push(this.createAdminFormGroup(data,this.adminFormArray));

   
    let newadmin = []
    newadmin.push(data)
    const addAdmin = {
      admin_details: newadmin
    };
    this.api.updateData(`${environment.live_url}/${environment.organization}/${this.id}`,addAdmin).subscribe(
      res => {
        if (res['result']) {
          this.api.showSuccess("Admin details updated successfully!");
          // this.organizationForm.reset();
          this.adminForm.reset();
          this.isAdminForm=false;
          this.fileDataUrl = null;
          this.adminList = []; // Clear the admin list after submission
          this.getOrgDetails(); // Refresh the organization details
        }
      },
      error => {
        this.api.showError(error.error.error.message);
      }
    );
    
    this.a['admin_name'].reset();
    this.a['admin_email_id'].reset();
    this.a['admin_phone_number'].reset();
    this.adminForm.patchValue({
      is_active: [true]
    })
    this.isAdminForm = !this.isAdminForm;


  }else{
    this.adminForm.markAllAsTouched()
  }
  }
  emailMatchValidator(): ValidatorFn {
    return (adminEmailControl: AbstractControl): { [key: string]: any } | null => {
      if (!adminEmailControl.value || !this.organizationForm.get('email').value) {
        return null;
      }
      return adminEmailControl.value === this.organizationForm.get('email').value
        ? { 'emailMatch': true }
        : null;
    };
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
        // this.fileDataUrl = currentOrg['organization_image_path']
        await this.getCountry();
        if(currentOrg['country'] === 'India'){
          await this.getState('')
          setTimeout(async () => {
            await this.getCity(currentOrg['state'])
          }, 1000);
        }
        if (currentOrg['organization_image_path']) {
        // console.log(this.url,'this.url')
        fetch(currentOrg['organization_image_path'])
          .then(response => response.blob())
          .then(blob => {
            const fileReader: any = new FileReader();
            fileReader.onloadend = () => {
              const base64String = fileReader.result.split(',')[1]; // Extract the base64 string without the data URL prefix
              this.fileDataUrl = 'data:image/png;base64,' + base64String; // Prepend 'data:image/png;base64,' to the base64 string
              // this.orgData['organization_image'] =  base64String; 
           
            };
            fileReader.readAsDataURL(blob);
          });


      }
        const adminData = res['result']['data'][0].admin_details
        // this.adminList = res['result']['data'][0].admin_details
        console.log(adminData)
        const transformedAdminDetails = adminData?.map(admin => ({
          id:admin.id,
          admin_name: admin.u_first_name,
          admin_email_id: admin.u_email,
          admin_phone_number: admin.u_phone_no,
          is_active: admin.u_status === 'ACTIVE' ? true : false ,
          isEditing:false
        }));
        this.adminList = transformedAdminDetails 
        // console.log(this.adminList)
        this.initializeAdminFormArray();
        this.organizationForm.patchValue({
          org_qr_uniq_id: currentOrg['org_qr_uniq_id'],
          organization_name: currentOrg['organization_name'],
          email: currentOrg['email'],
          address: currentOrg['address'],
          city: currentOrg['city'],
          state: currentOrg['state'],
          country: currentOrg['country'],
          postal_code: currentOrg['postal_code'],
          is_active: currentOrg['org_status'],
          org_subscription_plan: currentOrg['org_subscription_plan'],
          organization_image_path: currentOrg['organization_image_path'],
          organization_image_base_url: currentOrg['organization_image_base_url'],
          // organization_image: currentOrg['organization_image_path']
        })
       
      
      }
    }, (error => {
      this.api.showError(error.error.error.message)
    }))
   
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
  createAdminFormGroup(admin,formArray?:FormArray): FormGroup {
    return this._fb.group({
      admin_name: [admin.admin_name, [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z\s]*$/)]],
      admin_email_id: [admin.admin_email_id, [Validators.required, Validators.email,this.emailMatchValidator(),this.duplicateEmailArrayValidator(formArray)]],
      admin_phone_number: [admin.admin_phone_number, [Validators.required,this.phoneNumberLengthValidator]],
      is_active: [admin.is_active],
    });
  }
  

 
  duplicateEmailArrayValidator(formArray: FormArray): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentEmail = control.value;
      // this.adminFormArray?.push(this.adminList)
     
      // Get all email values from the formArray, excluding the current control
      const emailExists = this.adminFormArray?.controls?.some(
        (group: AbstractControl) =>
          group !== control?.parent && // Exclude the current control being validated
          group.get('admin_email_id')?.value === currentEmail
      );
      
      // Return the validation error only if the email is a duplicate
      return emailExists ? { duplicateArrEmail: true } : null;
    };
  }
  

  
  // Custom validator to check for duplicate admin emails
duplicateEmailValidator(adminList: any[]): ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const emailExists = adminList.some(admin => admin.admin_email_id === control.value);
    return emailExists ? { duplicateEmail: true } : null;
  };
}

  onFocus() {
    this.type = 'file';
    this.organizationForm.get('organization_image')?.reset();
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
      state: '',
      city: ''
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
          this.organizationForm.patchValue({ organization_image: this.fileDataUrl })
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
    if (this.organizationForm.invalid ) {
      this.organizationForm.markAllAsTouched();
      this.api.showError("Please enter the mandatory fields!");
      return;
    }
    
      const data = {
        organization_name: this.f['organization_name'].value,
        address: this.f['address'].value,
        email: this.f['email'].value,
        city: this.f['city'].value,
        state: this.f['state'].value,
        country: this.f['country'].value,
        postal_code: this.f['postal_code'].value,
        organization_image: this.fileDataUrl,
      };

      // {
      //   "organization_name": "ekfrazo",
      //   "email": "ek@gmail.com",
      //   "country": "",
      //   "state": "",
      //   "city": "",
      //   "postal_code": 99765,
      //   // "address": "1234 Acc Street,Banglore",
      //   "admin_details": [
            // {
            //     "id":25,
            //     "admin_name": "aparna ek",
            //     "admin_email_id_id": "aparna@ekfrazo.in",
            //     "admin_phone_number": 9988899871,
            //     "is_active": false
            // },
      //  ]
      //}
     
      this.api.updateData(`${environment.live_url}/${environment.organization}/${this.id}`, data).subscribe(
        res => {
          if (res['result']) {
            this.api.showSuccess("Organization updated successfully!");
            // this.organizationForm.reset();
            this.adminForm.reset();
            this.isAdminForm=false;
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
 
 async open(adminId,index) {
  
  try {
    const modalRef = await this.modalService.open(GenericDeleteComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true
    });
    
    modalRef.componentInstance.status.subscribe(resp => {
      if (resp === 'ok') {
        this.deleteAdmin(adminId,index);
        modalRef.dismiss();
      } else {
        modalRef.dismiss();
      }
    });
  } catch (error) {
    console.error('Error opening modal:', error);
  }
  
  }

}
