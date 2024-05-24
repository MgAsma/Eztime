import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';
import { CommonServiceService } from 'src/app/service/common-service.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  BreadCrumbsTitle:any='Update profile';

  profileForm:FormGroup;
  uploadFile: any;
  url: any;
  fileUrl: string | ArrayBuffer;
  user_id: any;
  date='text'
  profileimg='text'
  country: any = [];
  state: any = [];
  city: any = [];
  org_id: string;

  constructor( 
    private _fb:FormBuilder,
    private api:ApiserviceService,
    private datePipe:DatePipe,
    private location:Location,
    private common_service : CommonServiceService
    ) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.user_id = sessionStorage.getItem('user_id')
    this.org_id = sessionStorage.getItem('org_id')
    this.initform()
    this.getProfiledata()
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initform(){
    this.profileForm = this._fb.group({
      first_name:['',[Validators.pattern(/^[a-zA-Z]+$/),Validators.required]],
      last_name:['',[Validators.pattern(/^[a-zA-Z]+$/),Validators.required]],
      address:['',Validators.pattern(/^\S.*$/)],
      designation:['',[Validators.required,Validators.pattern(/^\S.*$/)]],
      email_id:['',[Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d+$/),this.phoneNumberLengthValidator()]],
      dob:['',[Validators.required]],
      tags:[''],
      country:['',Validators.required],
      state:['',Validators.required],
      city:['',Validators.required],
      user_address_details:[''],
      postal_code:[''],
      user_profile_photo:['',[Validators.required,this.fileFormatValidator]]
    })
  }
 phoneNumberLengthValidator(){
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumber: string = control.value;
      if (phoneNumber && phoneNumber.length !== 10) {
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
  get f(){
    return this.profileForm.controls;
  }
  getCountry(){
    let data = {
      "data_request":"GIVE_ALL_COUNTRY"
    }
    
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`,data).subscribe((res:any) =>{
     // console.log(res,"RES")
      if(res.result.data.data){
        this.country = res.result.data.data
      }
    },((error)=>{
      this.api.showError(error.error.error.message)
    }))
  }
  onFocusCountry(){
    this.profileForm.patchValue({
      state:'',
      city:''
    })
  }
  getState(event){
   
    let data = {
      "data_request":"GIVE_COUNTRY_RELATED_STATE",
      "country_name":event
    }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`,data).subscribe((res:any) =>{
    //  console.log(res,"RES")
      this.state = res.result.data.data
     
    },((error)=>{
      this.api.showError(error.error.error.message)
    }))
  }
  getCity(event){
    let data ={
       data_request:"GIVE_STATE_RELATED_CITY",
       state_name:event
   }
    this.api.postData(`${environment.live_url}/${environment.country_state_city}`,data).subscribe((res:any) =>{
      //console.log(res,"RES")
      this.city = res.result.data.data
    },((error)=>{
      this.api.showError(error.error.error.message)
    }))
  
   
    
   
  }
  
  getProfiledata(){
    this.api.getData(`${environment.live_url}/${environment.profile_custom_user}?id=${this.user_id}&page_number=1&data_per_page=10&pagination=TRUE&organization_id=${this.org_id}`).subscribe((res:any)=>{
   // console.log(res,'PROFILE GET API RESPONSE')
      if(res.result.data){
        let data = res.result.data
          this.getCountry()
         this.getState(data[0].u_country)
         this.getCity(data[0].u_state)
       // console.log(data[0].u_city,"CITY")
        this.profileForm.patchValue({
          first_name:data[0].u_first_name,
          last_name:data[0].u_last_name,
          designation:data[0].u_designation,
          email_id:data[0].u_email,
          phone_number:data[0].u_phone_no,
          dob:data[0].u_dob,
          tags:data[0].tags,
          country:data[0].u_country,
          state:data[0].u_state,
          city:data[0].u_city,
          address:data[0].u_address,
          // user_address_details:data[0].,
          postal_code:data[0].u_postal_code,
          user_profile_photo:data[0].u_profile_path
        })
        
      }
    },(error=>{
      this.api.showError(error.error.error.message)
    }))
  }
  uploadImageFile(event:any){
    this.uploadFile=  event.target.files[0];
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event:any)=>{
        this.url = event.target.result;
        this.fileUrl= reader.result
        //this.profileForm.patchValue({user_profile_photo:this.fileUrl})
       // console.log(this.fileUrl)

      }
    }
  }
  onFocusDate(){
    this.date='date';
    this.profileForm.patchValue({
      dob:''
    })
  }
  onFocusPhoto(){
    this.profileimg='file';
    this.profileForm.patchValue({
      user_profile_photo:''
    })
  }
  updateProfile(){
    // this.profileForm.patchValue({
    //   dob:this.datePipe.transform(this.profileForm.value.dob,"dd/MM/yyyy")
    // })

    if(this.profileForm.invalid){
      this.api.showError("Error !");
      this.profileForm.markAllAsTouched()
    }
    else{
      let profileData:any ={}
      profileData = this.profileForm.value
     // console.log(profileData.dob,'DOB____________')
      this.date === 'text' ? profileData.dob :this.datePipe.transform(profileData.dob,'dd/MM/yyyy')
      let data ={
      first_name:profileData.first_name,
      last_name:profileData.last_name,
      designation:profileData.designation,
      email_id:profileData.email_id,
      phone_no:profileData.phone_number ,
      dob:profileData.dob,
      tags:profileData.tags,
      country:profileData.country,
      state:profileData.state,
      city:profileData.city,
      address:profileData.address,
      // user_address_details:profileData.user_address_details,
      postal_code:profileData.postal_code,
      user_profile_photo:this.fileUrl

      }
      //console.log(data,"DATA---------------------")
      this.api.updateProfileDetails(this.user_id,data).subscribe(res =>{
        if(res){
          this.api.showSuccess("Profile updated successfully !");
          this.date = 'text'
        }
        },(error=>{
          this.api.showError(error.error.error.message)
        }))
    }

  }
  validationChecks(){
    if(this.f['phone_number'].hasError('pattern')){
      this.f['phone_number'].markAsTouched()
    }
  }
 
}
