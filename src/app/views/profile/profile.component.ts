import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  BreadCrumbsTitle: any = 'Update profile';
  media_url = environment.new_media_url
  profileForm: FormGroup;
  uploadFile: any;
  url: any;
  fileUrl: string | ArrayBuffer;
  user_id: any;
  date = 'text'
  profileimg = 'text'
  country: any = [];
  state: any = [];
  city: any = [];
  org_id: string;
  fileDataUrl: any = null;
  tempStoreProfileImage: any = null;
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(
    private _fb: FormBuilder,
    private api: ApiserviceService,
    private datePipe: DatePipe,
    private location: Location,
    private common_service: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.user_id = sessionStorage.getItem('user_id')
    // this.org_id = sessionStorage.getItem('org_id')
    this.getCountry();
    this.initform()
    this.getProfiledata()
  }
  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  initform() {
    this.profileForm = this._fb.group({
      first_name: ['', [Validators.pattern(/^[a-zA-Z]+$/), Validators.required]],
      last_name: ['', [Validators.pattern(/^[a-zA-Z]+$/), Validators.required]],
      address: ['', Validators.pattern(/^\S.*$/)],
      designation: ['', [Validators.required, Validators.pattern(/^\S.*$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
      date_of_birth: ['', [Validators.required]],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      role: [''],
      postal_code: [''],
      profile_image: ['',]
    })
  }
  phoneNumberLengthValidator() {
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
  get f() {
    return this.profileForm.controls;
  }
  

  getCountry() {
    this.api.getData(`${environment.live_url}/${environment.country}/`).subscribe((res: any) => {
      // console.log(res,'country')
      this.country = res
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))
  }

  onFocusCountry() {
    this.profileForm.patchValue({
      state: '',
      city: ''
    })
  }
  
  getState(event) {
    console.log(event,'country id')
    if(event){
      this.api.getData(`${environment.live_url}/${environment.state}/?country_id=${event}`).subscribe((res: any) => {
        if(res){
        this.state = res
        // this.getCity(event);
        }
      }, ((error) => {
        this.api.showError(error.error.error.message)
      }))
    }

  }

  
  getCity(event) {
    this.api.getData(`${environment.live_url}/${environment.city}/?state_id=${event}`).subscribe((res: any) => {
      this.city = res
    }, ((error) => {
      this.api.showError(error.error.error.message)
    }))
    // if (event) {

    //   const state_code = this.state?.find((state: any) => state.name === event)?.iso2;
    //   let data = {
    //     data_request: "GIVE_STATE_RELATED_CITY",
    //     state_code: state_code
    //   }
    //   this.api.postData(`${environment.live_url}/${environment.country_state_city}`, data).subscribe((res: any) => {
    //     if (res) {
    //       this.city = res.result.data.data
    //     }

    //   }, ((error) => {
    //     this.api.showError(error.error.error.message)
    //   }))
    // }
  }

  profileDataForSidebar: any = {
    profile_pic: '',
    name: '',
    last_name:''
  }

  getProfiledata() {
    this.api.getProfileDetails(this.user_id).subscribe(
      async (res:any)=>{
        console.log('new profile data',res)
        if (res) {
          let data = res
          if(data.country){
            await this.getState(data.country)
            await this.getCity(data.state)
          }
          let currentProfileDetails = []
          currentProfileDetails = res
          if(currentProfileDetails['profile_image']){
            this.fileDataUrl = this.media_url+currentProfileDetails['profile_image'];
            this.tempStoreProfileImage = this.media_url+currentProfileDetails['profile_image'];
          }
          this.profileDataForSidebar.profile_pic = this.fileDataUrl;
          this.profileDataForSidebar.name = res.first_name;
          this.profileDataForSidebar.last_name = res.last_name; 
          this.common_service.setProfilePhoto(this.profileDataForSidebar)
          this.profileForm.patchValue({
            first_name: data.first_name,
            last_name: data.last_name,
            designation: data.designation,
            email: data.email,
            phone_number: data.phone_number,
            date_of_birth: data.date_of_birth,
            country: data.country,
            state: data.state,
            city: data.city,
            address: data.address,
            postal_code: data.postal_code,
            role:data.role
          })
          console.log(this.profileForm.controls)
        }
      }
    )
    // this.api.getData(`${environment.live_url}/${environment.profile_custom_user}?id=${this.user_id}&page_number=1&data_per_page=10&pagination=TRUE&organization_id=${this.org_id}`).subscribe(async (res: any) => {
    //   console.log(res, 'PROFILE GET API RESPONSE', this.profileimg)
    //   if (res.result.data) {
    //     let data = res.result.data
    //     this.profileDataForSidebar.profile_pic = res.result.data[0]['u_profile_photo'];
    //     this.profileDataForSidebar.name = res.result.data[0].u_first_name;
    //     this.common_service.setProfilePhoto(this.profileDataForSidebar)
    //     let responseData = []
    //     let currentProfileDetails = []
    //     responseData = res['result']['data']
    //     currentProfileDetails = responseData[responseData.length - 1]
    //     this.fileDataUrl = currentProfileDetails['u_profile_photo'];
    //     this.tempStoreProfileImage = currentProfileDetails['u_profile_photo'];
    //     console.log(this.fileDataUrl)
    //     await this.getCountry();
    //     await this.getState('')
    //     setTimeout(async () => {
    //       await this.getCity(currentProfileDetails['u_state'])
    //     }, 1000);
    //     this.profileForm.patchValue({
    //       first_name: data[0].u_first_name,
    //       last_name: data[0].u_last_name,
    //       designation: data[0].u_designation,
    //       email_id: data[0].u_email,
    //       phone_number: data[0].u_phone_no,
    //       dob: data[0].u_dob,
    //       tags: data[0].tags,
    //       country: data[0].u_country,
    //       state: data[0].u_state,
    //       city: data[0].u_city,
    //       address: data[0].u_address,
    //       postal_code: data[0].u_postal_code,
    //     })
    //     console.log(this.profileForm.controls)
    //   }
    // }, (error => {
    //   this.api.showError(error.error.error.message)
    // }))
  }

  onFocusDate() {
    this.date = 'date';
    this.profileForm.patchValue({
      dob: ''
    })
  }
  onFocusPhoto() {
    this.profileimg = 'file';
    this.profileForm.get('profile_image')?.reset();
  }

  updateProfile() {
    console.log(this.profileForm.controls, this.fileDataUrl)
    if (this.profileForm.invalid) {
      this.api.showError("Invalid!");
      this.profileForm.markAllAsTouched()
    }
    else {
      let profileData: any = {}
      profileData = this.profileForm.value
      console.log(this.imageUploaded,'this.imageUploaded')
      //  this.profileForm.patchValue({profile_image:this.fileDataUrl});
      this.date === 'text' ? profileData.date_of_birth : this.datePipe.transform(profileData.date_of_birth, 'dd/MM/yyyy')
      let data = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        designation: profileData.designation,
        email: profileData.email,
        phone_number: profileData.phone_number,
        date_of_birth: profileData.date_of_birth,
        country: profileData.country,
        state: profileData.state,
        city: profileData.city,
        address: profileData.address,
        role:profileData.role,
        postal_code: profileData.postal_code,
        // profile_image: this.fileDataUrl
      }
      if (this.imageUploaded) {
        data['profile_image'] = this.fileDataUrl;
      }
      console.log(data, "DATA---------------------")
      this.api.updateUserProfileDetails(this.user_id, data).subscribe(res => {
        if (res) {
          this.api.showSuccess("Profile details updated successfully !");
          this.date = 'text';
          this.ngOnInit();
        }
      }, (error => {
        this.api.showError(error.error.error.message)
      }))
    }

  }
  validationChecks() {
    if (this.f['phone_number'].hasError('pattern')) {
      this.f['phone_number'].markAsTouched()
    }
  }

  triggerFileInput(text:any) {
    console.log(text)
    if(text=='Upload'){
      this.profileimg = 'file'
      this.fileInput?.nativeElement?.click();
      console.log('this.profileimg', this.profileimg)
    } 
    else{
      this.fileDataUrl = null;
      this.imageUploaded = true;
    }
  }

  imageUploaded:boolean = false;
  uploadProflieImageFile(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        this.imageUploaded= false;
        // Handle invalid file type
        console.error('Invalid file type. Only .jpg, .jpeg, and .png files are allowed.');
        this.api.showError('Invalid file type, only .jpg, .jpeg, and .png files are allowed.')
        this.fileDataUrl = this.tempStoreProfileImage; // Clear any previously selected image
        return;
      } else{
        this.imageUploaded= true;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fileDataUrl = e.target.result;
          console.log(this.profileForm.value)
        };
        reader.readAsDataURL(selectedFile);
      }

    } else{
      this.imageUploaded= false;
    }
  }

  validateKeyPress(event: KeyboardEvent) {
    // Get the key code of the pressed key
    const keyCode = event.which || event.keyCode;

    // Allow only digits (0-9), backspace, and arrow keys
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 37 && keyCode !== 39) {
      event.preventDefault(); // Prevent the default action (i.e., entering the character)
    }
  }
}
