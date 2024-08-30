import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  add:boolean = false;
  country: any = [];
  state: any = [];
  city: any = [];
  adminList: any =[];
  fileDataUrl: null;
  status:boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  adminForm: FormGroup;
  adminFormArray: FormArray;
  constructor(private _fb: FormBuilder,
    private api: ApiserviceService, private route: ActivatedRoute,
    private router: Router, private location: Location, private common_service: CommonServiceService) {
    this.id = this.route.snapshot.paramMap.get('id')
    this.initializeAdminFormArray()
  }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);

    // this.id = sessionStorage.getItem('user_id')
    this.initform();
    this.adminintForm();
    this.getOrgDetails();
    
  }
  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  
  deleteAdmin(index: number) {
    this.adminFormArray.removeAt(index);
    this.adminList.splice(index, 1);
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
  
  adminintForm(){
    this.adminForm = this._fb.group({
      u_first_name: ['', [Validators.pattern(/^[A-Za-z][A-Za-z\s]*$/),Validators.required]],
      u_email: ['', [Validators.required, Validators.email]],
      u_phone_no: ['', [Validators.required, this.phoneNumberLengthValidator()]],
      u_status: [true]
    })
    
  }
  getAdminFormGroup(index: number): FormGroup {
    return this.adminFormArray.at(index) as FormGroup;
  }
  saveAdmin(index: number) {
    const adminForm = this.getAdminFormGroup(index);
  
    if (adminForm) {
      // Mark all controls as touched to trigger validation messages
      adminForm.markAllAsTouched();
  
      // Check if the form is invalid and if so, return early
      if (adminForm.invalid) {
        adminForm.markAllAsTouched();
        console.log("Form is invalid");
        return;
      }else{
        this.adminList[index] = {
          ...this.adminList[index],
          u_first_name: adminForm.value.u_first_name,
          u_email: adminForm.value.u_email,
          u_phone_no: adminForm.value.u_phone_no,
          u_status: adminForm.value.u_status
        };
        alert(JSON.stringify(this.adminList[index]));
        console.log(this.adminList[index]);
      }
  
      // Proceed with saving the form values if valid
     
   
      // Optionally save the updated data to the server here
    }
  }
  
  
  addAdmin() {
   if (this.adminForm.valid) {
    const data = {
      u_first_name:this.adminForm?.value['u_first_name'],
      u_email:this.adminForm?.value['u_email'],
      u_phone_no:this.adminForm?.value['u_phone_no'],
      u_status:this.adminForm?.value['u_status'] ? 'Active' : 'Inactive'
    }
    this.adminList.push(data);
    
    this.a['u_first_name'].reset();
    this.a['u_email'].reset();
    this.a['u_phone_no'].reset();
    this.adminForm.patchValue({
      u_status: [true]
    })
  }else{
    this.organizationForm.markAllAsTouched()
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
        this.fileDataUrl = currentOrg['org_logo_path']
        await this.getCountry();
        if(currentOrg['org_country'] === 'India'){
          await this.getState('')
          setTimeout(async () => {
            await this.getCity(currentOrg['org_state'])
          }, 1000);
        }
        
        
        this.adminList = res['result']['data'][0].admin_details
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
          u_status: currentOrg['org_status'],
          org_subscription_plan: currentOrg['org_subscription_plan'],
          org_logo_path: currentOrg['org_logo_path'],
          org_logo_base_url: currentOrg['org_logo_base_url'],
          org_logo: currentOrg['org_logo_path']
        })
       
      
      }
    }, (error => {
      this.api.showError(error.error.error.message)
    }))
    
      
    
   
  }
  initializeAdminFormArray() {
    this.adminFormArray = this._fb.array(
      this.adminList.map(admin => this.createAdminFormGroup(admin))
    );
  }
  
  createAdminFormGroup(admin): FormGroup {
    return this._fb.group({
      u_first_name: [admin.u_first_name, [Validators.required, Validators.pattern(/^[A-Za-z\s]*$/)]],
      u_email: [admin.u_email, [Validators.required, Validators.email]],
      u_phone_no: [admin.u_phone_no, [Validators.required,this.phoneNumberLengthValidator()]],
      u_status: [admin.u_status],
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
  // uploadImageFile(event: any) {
  //   this.uploadFile = event.target.files[0];
  //   if (event.target.files && event.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(event.target.files[0])
  //     reader.onload = (event: any) => {
  //       this.url = event.target.result;
  //       this.fileUrl = reader.result
  //       // this.organizationForm.patchValue({org_logo:this.fileUrl})
  //       //console.log(this.fileUrl)
  //       this.orgData = this.organizationForm.value
  //       this.orgData['org_logo'] = this.fileUrl
  //     }
  //     // console.log(this.orgData,"FILE URL")
  //   }
  // }
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
    if (this.organizationForm.invalid) {
      this.organizationForm.markAllAsTouched();
      if(this.adminForm.invalid && !this.adminList.length){
        this.adminForm.markAllAsTouched()
      }
     
      this.api.showError("Please enter the mandatory fields !")
    }
    else {

      this.orgData = this.organizationForm.value
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
      //console.log(this.orgData,'this.orgData')
      if (this.type == 'url') {
        // console.log(this.url,'this.url')
        fetch(this.url)
          .then(response => response.blob())
          .then(blob => {
            const fileReader: any = new FileReader();
            fileReader.onloadend = () => {
              const base64String = fileReader.result.split(',')[1]; // Extract the base64 string without the data URL prefix
              this.orgData['org_logo'] = 'data:image/png;base64,' + base64String; // Prepend 'data:image/png;base64,' to the base64 string
              // this.orgData['org_logo'] =  base64String; 
             
              this.api.updateData(`${environment.live_url}/${environment.organization}/${this.id}`, data).subscribe(
                res => {
                  if (res['result'].status) {
                    this.api.showSuccess("Organization updated successfully!!")
                    this.router.navigate(['organization/orgList'])
                    // this.getOrgDetails();
                  } else {
                    this.api.showError("Error!")
                  }
                },
                ((error) => {
                  this.api.showError(error.error.error.message)
                })
              );
            };
            fileReader.readAsDataURL(blob);
          });


      }
     

      else {
        this.api.updateData(`${environment.live_url}/${environment.organization}/${this.id}`, data).subscribe(res => {
          if (res['result'].status) {
            this.api.showSuccess("Organization updated successfully !!")
            this.router.navigate(['organization/orgList'])
            this.getOrgDetails();
          }
          else {
            this.api.showError("Error !")
          }
        }, (error => {
          this.api.showError(error.error.error.message)
        }))
      }


    }
  }
  get f() {
    return this.organizationForm.controls;
  }
  get a(){
    return this.adminForm.controls;
  }
 
  
}
