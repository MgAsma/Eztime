import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiserviceService } from '../../service/apiservice.service';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  permission: any;
  showFieldset: boolean = false;
  constructor(private builder: FormBuilder, private api: ApiserviceService, private router: Router) { }
  time = new Date();
  message = '';
  error: boolean;
  eyeState: boolean = false;
  eyeIcon = 'visibility_off'
  passwordType = "password";
  minValue = 0.01;
  ngOnInit(): void {
    this.getWelomeMessage();
    sessionStorage.clear();
    this.loginForm = this.builder.group({
      // username: ['', [Validators.required, Validators.email]],
      // password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }


  get f() {
    return this.loginForm.controls;
  }
  getWelomeMessage(): any {
    let hours = this.time.getHours();

    if (hours < 12) {
      return this.message = 'Good Morning';
    }
    else if (hours >= 12 && hours < 15) {
      return this.message = 'Good Afternoon';
    }
    else if (hours >= 15 && hours < 19) {
      return this.message = 'Good Evening';
    }
    else if (hours >= 18 && hours < 23) {
      return this.message = 'Good Night';
    }

  }
  hide = true;


  login() {

    if (this.loginForm.invalid) {
      this.api.showError('Please enter the mandatory fields')

      this.loginForm.markAllAsTouched()

    }
    else {

      this.api.loginDetails(this.loginForm.value).subscribe(response => {
        let status = Number(200)
      //  console.log(response, "RESPONSE CHECK")
        const token = response['token'];
        const decoded:any = jwtDecode(token);
      //  console.log(decoded,'decoded');
      sessionStorage.setItem('token', response['token']),
      sessionStorage.setItem('logged_count', response['logged_in_time']);
        sessionStorage.setItem('user_id',decoded.user_id )
        this.api.userAccess(decoded.user_id).subscribe(
          (data:any)=>{
           console.log('user access',data)
            sessionStorage.setItem('user_role_name', data.user_role);
            // sessionStorage.setItem('permissionArr', JSON.stringify(data.access_list));
            sessionStorage.setItem('organization_id', data.organization_id);
            sessionStorage.setItem('designation', data.designation);
              let permissionArr: any = []
              permissionArr = JSON.parse(sessionStorage.getItem('permissionArr'));
              if(data.access_list.length!=0){
                this.router.navigate([data.access_list[0].url || data.access_list[0].children[0].url]);
              } else{
                this.router.navigate(['profile'])
              }
              this.api.showSuccess('Login successful!');
          },
          (error:any)=>{
           // console.log('error',error)
          }
        )

      }, (error: any) => {
        console.log('error',error)
        this.api.showError(error.error.message || 'Something went wrong please again later');
      }

      )
    }

  }


  showPassword() {
    this.eyeState = !this.eyeState
    if (this.eyeState == true) {
      this.eyeIcon = 'visibility'
      this.passwordType = 'text'
    }
    else {
      this.eyeIcon = 'visibility_off'
      this.passwordType = 'password'
    }

  }

  preventSpace(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }

  }
  signUp(){
    this.router.navigate(['./register'])
  }
  
}
