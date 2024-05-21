import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiserviceService } from '../../service/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';

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
  organizationlistData:any=[];
  adminlistData:any=[];
  userslistData:any=[];
  rolesListData:any=[];
  departmentsListData:any=[];
  industriesListData:any=[];
  pagination:any;
  constructor(private builder:FormBuilder, private api:ApiserviceService,
    private location :Location,
    private route: ActivatedRoute,
    private common_service : CommonServiceService) {
    
  }

  ngOnInit(): void {
     const isloggedIn = sessionStorage.getItem('token');
      if(isloggedIn){
        this.org_id = sessionStorage.getItem('org_id')
        this.getCountDetails(isloggedIn);
      }
    this.user_role_name = sessionStorage.getItem('user_role_name')  
    this.getUserControls();
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
      this.enable = true;
      this.getRecentAddedOrganizationList();
      this.getRecentAddeduserslistData();
      this.getRecentAddedAdminlistData();
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
            this.permissionRoles = element['ROLES'];
            this.getRecentAddedRolesListData();
          }if(element['DEPARTMENT']){
            this.permissionsDepartment = element['DEPARTMENT'];
            this.getRecentAddedDepartmentListData();
          }if(element['INDUSTRY/SECTOR']){
            this.permissionsIndustry = element['INDUSTRY/SECTOR'];
            this.getRecentAddedindustriesListData();
          }
          
        });
      }  
    })
    }

// organization list
getRecentAddedOrganizationList(){
  let params:any='page_number=1&data_per_page=5&pagination=TRUE'
  this.api.getData(`${environment.live_url}/${environment.organization}?${params}`).subscribe(res=>{
    if(res){
     this.organizationlistData = res['result']['data']
    }
  },(error =>{
    this.api.showError(error.error.error.message)
  }))
}

// Admin List
getRecentAddedAdminlistData(){
  let params:any = {
    page_number:1,
    data_per_page:5,
    pagination:'TRUE',
    organization_id:this.org_id,
    search_key:'ADMIN',
    ignore_super_admin:'TRUE'
   }
 this.api.getSuperAdminPeoplePage(params).subscribe((data:any)=>{
    this.adminlistData = data.result.data;
  },((error)=>{
    this.api.showError(error.error.error.message)
  })
  )
}
// users list
getRecentAddeduserslistData(){
  let params:any = {
    page_number:1,
    data_per_page:5,
    pagination:'TRUE',
    organization_id:this.org_id,
   }
  this.api.getPeopleDetailsPage(params).subscribe((data:any)=>{
    this.userslistData = data.result.data;
  },((error)=>{
    this.api.showError(error.error.error.message)
  })
  )
}
// Roles list
getRecentAddedRolesListData(){
  let params:any = {
    page_number:1,
    data_per_page:5,
    organization_id:this.org_id,
    pagination:'TRUE'
   }
  this.api.getUserAccess(params).subscribe((data:any)=>{
    
    if(data){
      this.rolesListData = data.result.data
      }
  },((error)=>{
    this.api.showError(error.error.error.message)
  })

  )
}

// Department list
getRecentAddedDepartmentListData(){
  let params:any = {
    page_number:1,
    data_per_page:5,
    org_ref_id:this.org_id,
    pagination:'TRUE'
   }
  this.api.getDepartmentDetailsPage(params).subscribe((res:any) =>{
    if(res){
      this.departmentsListData= res.result.data;
    }
    else{
      this.api.showError('Error!')
    }

  },((error)=>{
    this.api.showError(error.error.error.message)
  }))
}
// industries list
getRecentAddedindustriesListData(){
  let params:any = {
    page_number:1,
    data_per_page:5,
    org_ref_id:this.org_id,
    pagination:'TRUE'
   }
  this.api.getIndustryDetailsPage(params).subscribe((data:any)=>{
    this.industriesListData= data.result.data;
    },error=>{
      this.api.showError(error.error.error.message)
      
    }

  )
}
}
