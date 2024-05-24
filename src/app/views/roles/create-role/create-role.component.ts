import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {
  roleForm : FormGroup 
  BreadCrumbsTitle:any='Create role';

  allRole:any=[];
  role:any;
  orgId: any;

  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private location:Location,private common_service : CommonServiceService
    ) { }

  ngOnInit(): void {  
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId=sessionStorage.getItem('org_id')
 this.initForm();
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initForm(){
   
    this.roleForm= this.builder.group({
      user_role_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      priority:['',Validators.required],
      role_status:['',Validators.required],
      description:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      module_name:[''],
      permissions:{}
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
      let data = {
        user_role_name:this.roleForm.value.user_role_name,
        priority:this.roleForm.value.priority,
        role_status:this.roleForm.value.role_status,
        description:this.roleForm.value.description,
        module_name:['ROLES'],
        organization_id:this.orgId,
        permissions:[
          {
          "ROLES": [],
          "ROLES_ACCESSIBILITY": []
         }
      ]
      }
      this.api.addRoles(data,this.orgId).subscribe(res =>{
          if(res){
            this.api.showSuccess('Role added successfully!');
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
}
