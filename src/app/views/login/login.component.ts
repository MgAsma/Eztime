import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiserviceService } from '../../service/apiservice.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  permission: any;
  showFieldset: boolean = false;
  constructor(private builder:FormBuilder, private api:ApiserviceService, private router:Router) { }
  time = new Date();
  message = '';
  error:boolean;
  eyeState: boolean = false;
  eyeIcon = 'bi bi-eye-slash-fill'
  passwordType = "password";
  minValue = 0.01;
  ngOnInit(): void {
  this.getWelomeMessage();
  this.loginForm = this.builder.group({
    username:['',[Validators.required, Validators.email]],
    password:['',Validators.required],
  })
  }
  
   
  get f(){
    return this.loginForm.controls;
  }
  getWelomeMessage():any{
    let hours = this.time.getHours();
  
    if (hours < 12) {
      return this.message ='Good Morning';
  }
  else if (hours >= 12 && hours < 15) {
      return this.message = 'Good Afternoon';
  }
  else if (hours >= 15 && hours < 19) {
      return this.message ='Good Evening';
  }
  else if (hours >= 18 && hours < 23) {
      return this.message ='Good Night';
  }
   
  }
  hide = true;

 
  login(){
   
    if(this.loginForm.invalid){
      this.api.showError('Invalid!')
      
      this.loginForm.markAllAsTouched()

    }
    else{
     
      this.api.loginDetails(this.loginForm.value).subscribe(response=>{
        let status = Number(200)
        console.log(response,"RESPONSE CHECK")
         if(response['result']['status'] === status){
           this.error= false;
           sessionStorage.setItem('token',response['result'].token),
           sessionStorage.setItem('user_id',response['result'].user_id)
           sessionStorage.setItem('center_id',response['result'].center_id)
           sessionStorage.setItem('manager_id',response['result'].manager_id)
           sessionStorage.setItem('user_role_id',response['result'].user_role_id)
           sessionStorage.setItem('user_role_name',response['result'].user_role_name.toUpperCase())
           sessionStorage.setItem('org_id',response['result'].organization_id)
           this.api.accessArr.push(response['result'].arragned_data)
           sessionStorage.setItem('permissionArr',JSON.stringify(response['result'].arragned_data))
           let permissionArr:any = []
           permissionArr =JSON.parse(sessionStorage.getItem( 'permissionArr'))
           let userName = response['result'].u_first_name 
           sessionStorage.setItem('user_name',userName )
         
           //  if(response['result'].user_role_name == 'ADMIN' ){
          //   this.router.navigate(['/role']);
          //  }
          //  else{
          //   this.router.navigate(['/dashboards']);
          //  }
          this.router.navigate(['/dashboards']);
           this.api.showSuccess('Login successfull!!'); 
         }
         else{
           //console.log(response)
           this.api.showError('Error!')
         }
        
       },((error:any)=>{
        this.api.showError(error.error.error.detail ? error.error.error.detail : error.error.error.message)
       })
       
     )
     }
    
  }
  

  showPassword(){
    this.eyeState = !this.eyeState 
    if(this.eyeState == true){
      this.eyeIcon = 'bi bi-eye-fill'
      this.passwordType = 'text'
    }
    else{
      this.eyeIcon = 'bi bi-eye-slash-fill'
      this.passwordType = 'password'
    }
    
  }
}
