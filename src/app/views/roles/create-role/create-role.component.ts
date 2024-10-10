import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {
  roleForm : FormGroup 
  BreadCrumbsTitle:any='Create Designation';

  allRole:any=[];
  role:any;
  orgId: any;
  status = [
    { value: 'active', viewValue: 'Active' },
    { value: 'inactive', viewValue: 'Inactive' },
  ];
  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private location:Location,private common_service : CommonServiceService,
    private router: Router
    ) { }

  ngOnInit(): void {  
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId=sessionStorage.getItem('organization_id')
 this.initForm();
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initForm(){
   
    this.roleForm= this.builder.group({
      designation_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      description:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      organization:this.orgId
      // priority:['',Validators.required],
      // role_status:['',Validators.required],
      // module_name:[''],
      // permissions:{}
    })
  }
  
  get f(){
    return this.roleForm.controls;
  }
 
  addRole(){
    if(this.roleForm.invalid){
      this.api.showError('Invalid!')
      this.roleForm.markAllAsTouched();
    }
    else{
      // let data = {
      //   designation_name:this.roleForm.value.designation_name,
      //   // priority:this.roleForm.value.priority,
      //   role_status:this.roleForm.value.role_status,
      //   description:this.roleForm.value.description,
      //   module_name:['ROLES'],
      //   organization_id:this.orgId,
      //   permissions:[
      //     {
      //     "ROLES": [],
      //     "ROLES_ACCESSIBILITY": []
      //    }
      // ]
      // }
      this.api.postDesignationList(this.roleForm.value).subscribe((res:any) =>{
          if(res){
            this.api.showSuccess(res.message);
            this.roleForm.reset();
            this.initForm();
          }
          else{
            this.api.showError('Error')
          }
      },((error:any) =>{
          this.api.showError(error.error.error.message)
      }))
    }
  }

  BackToRolesList(){
    this.router.navigate(['./role/list'])
  }
}
