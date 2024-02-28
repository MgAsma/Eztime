import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup, FormControl } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-update-role',
  templateUrl:'./update-role.component.html',
  styleUrls: ['./update-role.component.scss']
})
export class UpdateRoleComponent implements OnInit {
  id:any;
  updateForm: FormGroup;
  page: string;
  tableSize: string;
  org_id: any;
  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService, 
    private route:ActivatedRoute,
    private router:Router,
    private location:Location) { 
    this.id =this.route.snapshot.paramMap.get('id')
    this.page = this.route.snapshot.paramMap.get('page')
    this.tableSize = this.route.snapshot.paramMap.get('tableSize')
  }
  initForm(){
    this.updateForm= this.builder.group({
      user_role_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      description:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      priority:['',Validators.required],
      role_status:['',Validators.required],
      module_name:[],
      permissions:[],
      update:'ROLE',
      organization_id:this.org_id
    })
  }
 
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  ngOnInit(): void {
    this.org_id = sessionStorage.getItem('org_id')
   this.edit();
   this.initForm();
  }
  get f(){
    return this.updateForm.controls;
  }
  edit(){
    
    this.api.getUserAccess(`module=ROLES&menu=ROLES&method=VIEW&page_number=1&data_per_page=10&pagination=FALSE&id=${this.id}&organization_id=${this.org_id}`).subscribe((res:any)=>{
     // console.log(res,"RESPONSE")
     
      this.updateForm.patchValue({
        user_role_name:res.data[0].user_role_name,
        description:res.data[0].description,
        priority:res.data[0].priority,
        role_status:res.data[0].role_status,
        module_name:res.data[0].module_name,
        permissions:res.data[0].permissions,
      })
   })
  }
 
  update(){
    if(this.updateForm.invalid){
      this.updateForm.markAllAsTouched()
    }
    else{
      this.api.userAccessConfig(this.id,this.updateForm.value).subscribe(response=>{
        if(response){
          this.api.showSuccess('Role updated successfully!');
          this.updateForm.reset()
          this.router.navigate(['/role/list'])
        }
        else{
          this.api.showError('Error!')
        }
       },((error)=>{
        this.api.showError(error.error.error.message)
       })
    )
    }
  
  }
}
