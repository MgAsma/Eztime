import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ApiserviceService } from 'src/app/service/apiservice.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  userId
  changePassword:FormGroup;
  eyeIcon = 'bi bi-eye-slash'
  passwordType = "password";
  eyeState: boolean = false;
  constructor(
    private builder:FormBuilder, 
    private api:ApiserviceService, 
    private router:Router,
    private location:Location
    ) { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('user_id')
    this.changePassword = this.builder.group({
      old_password:['',[Validators.required]],
      new_password:['',[Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}$/)]],
      user_id:[this.userId,[Validators.required]]
    })
  }


  get f(){
    return this.changePassword.controls;
  }
 
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }


  sendChangePassword(){
    if(this.changePassword.invalid){
      this.api.showError('Invalid!')
      this.changePassword.markAllAsTouched()
      //console.log(this.changePassword.value)
    }
    else{
      if(this.changePassword.value.old_password === this.changePassword.value.new_password){
        this.api.showError('Old password and new password both should not be same')
      }
      else{
        this.api.addChangePassword(this.changePassword.value).subscribe(
          (response:any)=>{
            if(response){
              //console.log(response)
             
              this.router.navigate(['../login']);
              this.api.showSuccess("Password changed successfully!");
             }
            else{
              this.api.showError('Error !')
            }
           
          },((error:any) =>{
            this.api.showError(error? error.error.error.message : 'Error !')
          })
          
        )
      }
     
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
