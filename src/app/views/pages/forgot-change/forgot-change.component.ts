import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';
import { ApiserviceService } from 'src/app/service/apiservice.service';
@Component({
  selector: 'app-forgot-change',
  templateUrl: './forgot-change.component.html',
  styleUrls: ['./forgot-change.component.scss']
})
export class ForgotChangeComponent implements OnInit {

  constructor(private builder:FormBuilder, private api:ApiserviceService, private router:Router) { }

  ngOnInit(): void {
  }
  changePassword = this.builder.group({
    old_password:['',[Validators.required]],
    new_password:['',[Validators.required]],
    user_id:['',[Validators.required]]
     
  },{
    validators: this.passwordMatchValidator
  })
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('new_password');
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
      this.api.addChangePassword(this.changePassword.value).subscribe(
        (response:any)=>{
          if(response){
            //console.log(response)
           
            this.router.navigate(['../login']);
            this.api.showSuccess("Password Changed Successfully !");
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
