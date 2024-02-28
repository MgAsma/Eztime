import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiserviceService } from '../../service/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';

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
  permissionRoles: any = [];
  permissionsDepartment: any = [];
  permissionsIndustry: any;
  org_id:any;
  constructor(private builder:FormBuilder, private api:ApiserviceService,
    private location :Location,
    private route: ActivatedRoute,
    private common_service : CommonServiceService) {
    
  }

  ngOnInit(): void {
     const isloggedIn = sessionStorage.getItem('token')
      if(isloggedIn){
        this.org_id = sessionStorage.getItem('org_id')
        this.getCountDetails(isloggedIn);
      }
    
    this.user_role_name = sessionStorage.getItem('user_role_name')  
     
    this.getUserControls()
  }
  getCountDetails(isloggedIn){
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    let id ={
      user_id:this.user_id,
      organization_id:this.org_id
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
  getUserControls(){
    this.user_id = sessionStorage.getItem('user_id')
    this.org_id = sessionStorage.getItem('org_id')
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10&organization_id=${this.org_id}&pagination=TRUE`).subscribe((res:any)=>{
      if(res.status_code !== '401'){
        this.common_service.permission.next(res['data'][0]['permissions'])
        //console.log(this.common_service.permission,"PERMISSION")
      }
      else{
        this.api.showError("ERROR !")
      }
      //console.log(res,'resp from yet');
      
    }
  
    )
  
    this.common_service.permission.subscribe(res=>{
      const accessArr = res
      if(accessArr.length > 0){
        accessArr.forEach((element,i) => {
          if(element['ROLES']){
            this.permissionRoles = element['ROLES']
          }if(element['DEPARTMENT']){
            this.permissionsDepartment = element['DEPARTMENT']
          }if(element['INDUSTRY/SECTOR']){
            this.permissionsIndustry = element['INDUSTRY/SECTOR']
          }
          
        });
      }
      
    })
   
    }
  
}
