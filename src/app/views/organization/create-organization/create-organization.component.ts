import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss']
})
export class CreateOrganizationComponent implements OnInit {
  organizationForm:FormGroup;
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
  constructor( private _fb:FormBuilder,private api:ApiserviceService,private location:Location) { }

  ngOnInit(): void {
    this.id = sessionStorage.getItem('user_id')
    this.initform();
    this.getCountry()
    //this.getOrgDetails();
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initform(){
    this.organizationForm = this._fb.group({
      // user_ref_id:this.id,
      org_qr_uniq_id:['22121'],
      org_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      conctact_person_designation:['',[Validators.pattern(/^\S.*$/),Validators.required]],
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
 
  onFocus(){
    this.type = 'file'
    this.f['org_logo'].markAsDirty()
    this.f['org_logo'].markAsTouched()
  }
  uploadImageFile(event:any){
    this.uploadFile=  event.target.files[0];
    if(event.target.files && event.target.files[0]){
      const reader =new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event:any)=>{
        this.url = event.target.result;
        this.fileUrl= reader.result
        this.organizationForm.patchValue({org_logo:this.fileUrl})
      }
    }
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
     // console.log(res,"RES")
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
    //  console.log(res,"RES")
      this.city = res.result.data.data
    },((error)=>{
      this.api.showError(error.error.error.message)
    }))
  
  }
  organizationSubmit(){
    if(this.organizationForm.invalid){
      this.organizationForm.markAllAsTouched()
     this.api.showError("Error !")
    }
    else{
      let orgData = {}
      orgData = this.organizationForm.value
      //console.log(this.organizationForm.value,"VALUE")
      if(this.type == 'url'){
        fetch(this.url)
        .then(response => response.blob())
        .then(blob => {
         // Create a FileReader to read the blob as a base64 string
         const reader = new FileReader();
         reader.readAsDataURL(blob);
         reader.onloadend = () => {
           // Extract the base64 string from the result
           const base64WithPrefix = reader.result?.toString();
           ////console.log(base64WithPrefix);
           this.organizationForm.patchValue({
            org_logo_path:this.url
           })
           this.base64String = base64WithPrefix
           //console.log(this.organizationForm.value.org_logo_path,"jhjjhkjk")
           orgData['org_logo_path'] = this.base64String
           //console.log(this.base64String,"BASE");
         };
       });
       
     }
     this.api.postData(`${environment.live_url}/${environment.organization}`,orgData).subscribe(res =>{
    // this.api.updateOrganisationDetails(4,orgData).subscribe(res=>{
      if(res['result'].status){
        this.api.showSuccess("Organization added successfully!!")
        this.organizationForm.reset()
        // this.getOrgDetails();
      }
      else{
        this.api.showError("Error !")
      }
    },(error =>{
      this.api.showError(error.error.error.message)
    }))
  }
  }
  get f(){
    return this.organizationForm.controls;
  }
 
  setBgColor(data?):any{
   
    if(data.value){
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
