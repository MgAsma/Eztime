import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';
import { ApiserviceService } from 'src/app/service/apiservice.service';
@Component({
  selector: 'app-forgot-change',
  templateUrl: './forgot-change.component.html',
  styleUrls: ['./forgot-change.component.scss']
})
export class ForgotChangeComponent implements OnInit {
  userId: any;
  changePassword: FormGroup;

  constructor(private builder:FormBuilder, private api:ApiserviceService, private router:Router) { }

  ngOnInit(): void {
    // this.userId =  JSON.parse(sessionStorage.getItem('user_id'))
    // this.changePassword = this.builder.group({
    //   username:['',[Validators.required]],
    //   password:['',[Validators.required]],
      
    // },{
    //   validators: this.passwordMatchValidator
    // })
    const userName = sessionStorage.getItem('email_id')
    this.changePassword = this.builder.group({
      username:[userName,[Validators.required]],
      password:['',[Validators.required]],
      old_password:['',[Validators.required]]
    },{
      validators: this.passwordMatchValidator
    })
  }
  
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('password');
    const confirmPassword = control.get('old_password');

    if (newPassword.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }

    return null;
  }

  

  get f(){
    return this.changePassword.controls;
  }
 



  sendChangePassword(){
    if(this.changePassword.invalid){
      this.api.showError('Invalid!')
      this.changePassword.markAllAsTouched()
      //console.log(this.changePassword.value)
    }
    else{
      this.api.forgotPassword(this.changePassword.value).subscribe(
        (response:any)=>{
          if(response){
            //console.log(response)
           
            this.router.navigate(['../login']);
            this.api.showSuccess("Password changed successfully !");
           }
          else{
            this.api.showError('Error !')
          }
         
        },(error =>{
          this.api.showError(error? error.error.error.message : 'Error !')
        })
        
      )
    }

  }
}
