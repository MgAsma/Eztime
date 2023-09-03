import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../../../service/apiservice.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private builder:FormBuilder, private api:ApiserviceService, private router:Router) { }

  ngOnInit(): void {
  }
  forgotForm = this.builder.group({
    username:['',[Validators.required, Validators.email]],
 
  })

  get f(){
    return this.forgotForm.controls;
  }
 



  forgot(){
    if(this.forgotForm.invalid){
      this.forgotForm.markAllAsTouched()
      this.api.showError('Invalid!')
    }
    else{
      this.api.ForgotPasswordDetails(this.forgotForm.value).subscribe(
        (response:any)=>{
          if(response){
          //  //console.log(response.result.details,response)
            sessionStorage.setItem('email_id',this.forgotForm.value.username)
            this.router.navigate(['/otp']);
           }
          else{
            //console.log('error message')
            this.api.showError(response.error.message)
            this.api.showError('ERROR !')
          }
         
        },(error  =>{
          //console.log(error,"MESSAGE")
          this.api.showError(error.error.error.message)
        })
        
        
      )
    }

  }

}
