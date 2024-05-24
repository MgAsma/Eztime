import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  BreadCrumbsTitle:any='Update organization';
  organizationForm:FormGroup;
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
  state: any =[];
  city: any = [];
  constructor( private _fb:FormBuilder,
    private api:ApiserviceService,private route:ActivatedRoute,
    private router:Router,private location:Location,private common_service:CommonServiceService) {
    this.id =this.route.snapshot.paramMap.get('id')
   }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);

    // this.id = sessionStorage.getItem('user_id')
    this.initform();
    this.getOrgDetails();
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initform(){
    this.organizationForm = this._fb.group({
      org_qr_uniq_id:['22121'],
      org_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      conctact_person_designation:['',[Validators.required,Validators.pattern(/^\S.*$/)]],
      conctact_person_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      org_address:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      org_email:['',[Validators.required,Validators.email]],
      org_phone:[''],
      org_mobile:[''],
      org_fax:[''],
      org_website:[''],
      org_city:['',[Validators.required]],
      org_state:['',[Validators.required]],
      org_country:['',[Validators.required]],
      org_postal_code:['',[Validators.required]],
      org_profile_updated_status:[''],
      org_default_currency_type:[''],
      org_status:['',[Validators.required]],
      org_subscription_plan:[''],
      org_logo_path:[''],
      org_logo_base_url:[''],
      page:[''],
      conctact_person_email:['',[Validators.required,Validators.email]],
      conctact_person_password:['',[Validators.required]],
      conctact_person_phone_number:['',[Validators.required,this.phoneNumberLengthValidator()]],
      org_logo:['',[Validators.required, this.fileFormatValidator]],
      // number_of_users_in_organization:['',[Validators.required]]
    })
   
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
  getOrgDetails(){
    this.api.getData(`${environment.live_url}/${environment.organization}?id=${this.id}&page_number=1&data_per_page=10`).subscribe(res=>{
      if(res){
       let responseData =[]
       let currentOrg = []
       responseData = res['result']['data']
       currentOrg = responseData[responseData.length-1]
       this.url = currentOrg['org_logo_path']
      // console.log(currentOrg,"currentOrg RESPONNSE")
       this.organizationForm.patchValue({
        // user_ref_id:currentOrg['user_ref_id'],
        org_qr_uniq_id:currentOrg['org_qr_uniq_id'],
        org_name:currentOrg['org_name'],
        org_email:currentOrg['org_email'],
        org_phone:currentOrg['org_phone'],
        org_mobile:currentOrg['org_mobile'],
        org_fax:currentOrg['org_fax'],
        org_website:currentOrg['org_website'],
        org_address:currentOrg['org_address'],
        org_city:currentOrg['org_city'],
        org_state:currentOrg['org_state'],
        org_country:currentOrg['org_country'],
        org_postal_code:currentOrg['org_postal_code'],
        org_profile_updated_status:currentOrg['org_profile_updated_status'],
        org_default_currency_type:currentOrg['org_default_currency_type'],
        org_status:currentOrg['org_status'],
        org_subscription_plan:currentOrg['org_subscription_plan'],
        org_logo_path:currentOrg['org_logo_path'],
        org_logo_base_url:currentOrg['org_logo_base_url'],
        //org_logo_base_url:[],
        page:currentOrg['page'],
        conctact_person_designation:currentOrg['conctact_person_designation'],
        conctact_person_name:currentOrg['conctact_person_name'],
        conctact_person_password:currentOrg['conctact_person_password'],
        conctact_person_email:currentOrg['conctact_person_email'],
        number_of_users_in_organization:currentOrg['number_of_users_in_organization'],
        conctact_person_phone_number:currentOrg['conctact_person_phone_number'],
        org_logo:currentOrg['org_logo_path']
       })
       this.getCountry()
       this.getState(currentOrg['org_country'])
       this.getCity(currentOrg['org_state'])
      }
    },(error =>{
      this.api.showError(error.error.error.message)
    }))
  }
  onFocus(){
    this.type = 'file'
    this.organizationForm.patchValue({
      org_logo:''
    })
    this.f['org_logo'].markAsDirty()
    this.f['org_logo'].markAsTouched()
    
  }
  getCountry(){
    let data = {
      "data_request":"GIVE_ALL_COUNTRY"
    }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`,data).subscribe((res:any) =>{
     // console.log(res,"RES")
      this.country = res.result.data.data
    },((error)=>{
      this.api.showError(error.error.error.message)
    }))
  }
  onFocusCountry(){
    this.organizationForm.patchValue({
      org_state:'',
      org_city:''
    })
  }
  getState(event){
    let data = {
      "data_request":"GIVE_COUNTRY_RELATED_STATE",
      "country_name":event
    }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`,data).subscribe((res:any) =>{
      //console.log(res,"RES")
      this.state = res.result.data.data
    },((error)=>{
      this.api.showError(error.error.error.message)
    }))
  }
  getCity(event){
    let data ={
      "data_request":"GIVE_STATE_RELATED_CITY",
      "state_name":event
   }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`,data).subscribe((res:any) =>{
     // console.log(res,"RES")
      this.city = res.result.data.data
    },((error)=>{
      this.api.showError(error.error.error.message)
    }))
  
  }
  uploadImageFile(event:any){
    this.uploadFile =  event.target.files[0];
    if(event.target.files && event.target.files[0]){
      const reader =new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event:any)=>{
        this.url = event.target.result;
        this.fileUrl = reader.result
       // this.organizationForm.patchValue({org_logo:this.fileUrl})
        //console.log(this.fileUrl)
        this.orgData = this.organizationForm.value
        this.orgData['org_logo'] = this.fileUrl
      }
     // console.log(this.orgData,"FILE URL")
    }
  }
  organizationSubmit(){
    if(this.organizationForm.invalid){
      this.organizationForm.markAllAsTouched()
     this.api.showError("Error !")
    }
    else{
      
    this.orgData = this.organizationForm.value
    //console.log(this.orgData,'this.orgData')
    if (this.type == 'url' ) {
      // console.log(this.url,'this.url')
        fetch(this.url)
        .then(response => response.blob())
        .then(blob => {
          const fileReader:any = new FileReader();
          fileReader.onloadend = () => {
            const base64String = fileReader.result.split(',')[1]; // Extract the base64 string without the data URL prefix
            this.orgData['org_logo'] = 'data:image/png;base64,' + base64String; // Prepend 'data:image/png;base64,' to the base64 string
            // this.orgData['org_logo'] =  base64String; 
            this.api.updateData(`${environment.live_url}/${environment.organization}/${this.id}`, this.orgData).subscribe(
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
    // if (this.type == 'url') {
    //   fetch(this.url, { method: 'GET' } as RequestInit)
    //     .then(response => response.blob())
    //     .then(blob => {
    //       // Create a FileReader to read the blob as a base64 string
    //       const reader = new FileReader();
    //       reader.readAsDataURL(blob);
    //       reader.onloadend = () => {
    //         // Extract the base64 string from the result
    //         const base64WithPrefix = reader.result?.toString();
    //         this.orgData['org_logo'] = base64WithPrefix;
    //         //console.log(base64WithPrefix);
    
    //         this.api.updateData(`${environment.live_url}/${environment.organization}/${this.id}`, this.orgData).subscribe(
    //           res => {
    //             if (res['result'].status) {
    //               this.api.showSuccess("Organization Updated Successfully!")
    //               this.router.navigate(['organization/orgList'])
    //               this.getOrgDetails();
    //             } else {
    //               this.api.showError("Error!")
    //             }
    //           },
    //           (error) => {
    //             this.api.showError(error.error.error.message)
    //           }
    //         );
    //       };
    //     });
    // }
    
    else{
      this.api.updateData(`${environment.live_url}/${environment.organization}/${this.id}`,this.orgData).subscribe(res=>{
        if(res['result'].status){
          this.api.showSuccess("Organization updated successfully !!")
          this.router.navigate(['organization/orgList'])
          this.getOrgDetails();
        }
        else{
          this.api.showError("Error !")
        }
      },(error =>{
        this.api.showError(error.error.error.message)
      }))
    }
   
   
  }
  }
  get f(){
    return this.organizationForm.controls;
  }
 
  setBgColor(data?):any{
   
    if(data.value || data.value === 0){
      //console.log(data.value)
      return 'back-color'
     }
     else{
       return ''
     }
  }
  showPassword(){
    this.eyeState = !this.eyeState 
    if(this.eyeState == true){
      this.eyeIcon = 'bi bi-eye'
      this.passwordType = 'text'
    }
    else{
      this.eyeIcon = 'bi bi-eye-slash'
      this.passwordType = 'password'
    }
    
  }
}
