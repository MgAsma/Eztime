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
  BreadCrumbsTitle: any = 'Create organization';
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
    this.id = sessionStorage.getItem('user_id')
    this.initform();
    this.getCountry()
   
  }
  
  addAdmin() {
   if (this.organizationForm?.value['admin_name'] && this.organizationForm?.value['admin_email'] && this.organizationForm?.value['admin_phone_number'] ) {
    const data = {
      admin_name:this.organizationForm?.value['admin_name'],
      admin_email:this.organizationForm?.value['admin_email'],
      admin_phone_number:this.organizationForm?.value['admin_phone_number'],
      admin_status:this.organizationForm?.value['admin_status']
    }
    this.adminList.push(data);
    
    this.f['admin_name'].reset();
    this.f['admin_email'].reset();
    this.f['admin_phone_number'].reset();
    this.f['admin_status'].reset();
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
      // user_ref_id:this.id,
      org_qr_uniq_id: ['22121'],
      org_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      //conctact_person_designation: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      admin_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      org_address: ['', [Validators.pattern(/^\S.*$/)]],
      org_email: ['', [Validators.required, Validators.email]],
      org_phone: [''],
      org_mobile: [''],
      org_fax: [''],
      org_website: [''],
      org_city: ['', [Validators.required]],
      org_state: ['', [Validators.required]],
      org_country: ['', [Validators.required]],
      org_postal_code: [''],
      org_profile_updated_status: [''],
      org_default_currency_type: [''],
      admin_status: [true, [Validators.required]],
      org_subscription_plan: [''],
      org_logo_path: [''],
      org_logo_base_url: [''],
      page: [''],
      admin_email: ['', [Validators.required, Validators.email]],
     // conctact_person_password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}$/)]],
      admin_phone_number: ['', [Validators.required, this.phoneNumberLengthValidator]],
      org_logo: ['', [Validators.required, this.fileFormatValidator]],
      // number_of_users_in_organization:['',[Validators.required]]
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
      "data_request": "GIVE_ALL_COUNTRY"
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
      "data_request": "GIVE_COUNTRY_RELATED_STATE",
      "country_name": event
    }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`, data).subscribe((res: any) => {
      // console.log(res,"RES")
      this.state = res.result.data.data
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))
  }
  getCity(event) {
    let data = {
      "data_request": "GIVE_STATE_RELATED_CITY",
      "state_name": event
    }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`, data).subscribe((res: any) => {
      //  console.log(res,"RES")
      this.city = res.result.data.data
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))

  }
  organizationSubmit() {
    if (this.organizationForm.invalid) {
      this.organizationForm.markAllAsTouched()
      this.api.showError("Please enter the mandatory fields !")
    }
    else {
      let orgData = {}
      orgData = this.organizationForm.value
      //console.log(this.organizationForm.value,"VALUE")
      // if (this.type == 'url') {
      //   fetch(this.url)
      //     .then(response => response.blob())
      //     .then(blob => {
      //       // Create a FileReader to read the blob as a base64 string
      //       const reader = new FileReader();
      //       reader.readAsDataURL(blob);
      //       reader.onloadend = () => {
      //         // Extract the base64 string from the result
      //         const base64WithPrefix = reader.result?.toString();
      //         ////console.log(base64WithPrefix);
      //         this.organizationForm.patchValue({
      //           org_logo_path: this.url
      //         })
      //         this.base64String = base64WithPrefix
      //         //console.log(this.organizationForm.value.org_logo_path,"jhjjhkjk")
      //         orgData['org_logo_path'] = this.base64String
      //         //console.log(this.base64String,"BASE");
      //       };
      //     });

      // }

      const data = {
        org_qr_uniq_id: this.f['org_qr_uniq_id'].value,
        org_name: this.f['org_name'].value,
        org_address: this.f['org_address'].value,
        org_email: this.f['org_email'].value,
        org_city: this.f['org_city'].value,
        org_state: this.f['org_state'].value,
        org_country: this.f['org_country'].value,
        org_postal_code: this.f['org_postal_code'].value,
        org_logo:this.f['org_logo'].value,
        admin_details:this.adminList
      }
      console.log(data,"DATA")
      this.api.postData(`${environment.live_url}/${environment.organization}`, data).subscribe(res => {
        // this.api.updateOrganisationDetails(4,orgData).subscribe(res=>{
        if (res['result'].status) {
          this.api.showSuccess("Organization added successfully!!")
          this.organizationForm.reset()
          // this.getOrgDetails();
        }
        else {
          this.api.showError("Error !")
        }
      }, (error => {
        this.api.showError(error.error.error.message)
      }))
    }
  }
  get f() {
    return this.organizationForm.controls;
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
