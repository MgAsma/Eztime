import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiserviceService } from '../../service/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  // selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls:['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  role:any;
  department:any;
  industry:any;
  user_id: any;
  user_role_name: string;
  organization: any;
  admin: any;
  userCount: any;
  enable: boolean = false;
  constructor(private builder:FormBuilder, private api:ApiserviceService,
    private location :Location,
    private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
   
      const isloggedIn = sessionStorage.getItem('token')
      if(isloggedIn){
        this.getCountDetails(isloggedIn);
      }
    
    this.user_role_name = sessionStorage.getItem('user_role_name')  
  }
  getCountDetails(isloggedIn){
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    let id ={
      user_id:this.user_id
    }
    this.api.getCount(id,isloggedIn).subscribe((data:any)=>{
      if(data.result){
      
      this.role = data.result.no_of_roles;
      this.department = data.result.no_of_department;
      this.industry = data.result.no_of_industries;
      this.organization = data.result.no_of_organization;
      this.admin = data.result.no_of_admin;
      this.userCount = data.result.no_of_users
      this.enable = true
      }
      
    }
    ,((error:any) =>{
      this.api.showError(error?.error.error.message)
    })
    )
  }
 
}
