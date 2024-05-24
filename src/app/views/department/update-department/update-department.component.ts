import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup, FormControl } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from'@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-update-department',
  templateUrl: './update-department.component.html',
  styleUrls: ['./update-department.component.scss']
})
export class UpdateDepartmentComponent implements OnInit {
  BreadCrumbsTitle:any='Update department';
  id:any;
  page: string;
  tableSize: string;
  org_id: any;
  updateForm: FormGroup;

  constructor(
    private builder:FormBuilder,
     private api: ApiserviceService, 
     private route:ActivatedRoute,
     private router:Router,
     private location:Location,
     private common_service:CommonServiceService

     ) { 
    this.id =this.route.snapshot.paramMap.get('id')
    this.page = this.route.snapshot.paramMap.get('page')
    this.tableSize = this.route.snapshot.paramMap.get('tableSize')
    this.org_id = sessionStorage.getItem('org_id')
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initForm(){
    this.updateForm= this.builder.group({
      od_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      od_status:['',Validators.required],
      organization_id:this.org_id
    })
  }
  
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);

    this.initForm()
    this.edit();
  }
  get f(){
    return this.updateForm.controls;
  }
  edit(){
    let params = {
      page_number:this.page,
      data_per_page:this.tableSize,
      org_ref_id:this.org_id
    }
    if(this.org_id){
      this.api.getCurrentDepartmentDetails(this.id,params).subscribe((data:any)=>{
        this.updateForm.patchValue({
          od_name:data.result.data[0].od_name,
          od_status:data.result.data[0].od_status,
        })
      })
    }
   
  }
  update(){
  if(this.updateForm.invalid){
    this.updateForm.markAllAsTouched()
  }
  else{
  this.api.updateDepartmant(this.id,this.updateForm.value).subscribe(res =>{
    if(res){
      this.api.showSuccess('Department updated successfully!');
      this.updateForm.reset();
      this.router.navigate(['/department/list']);
    }
    else{
      this.api.showError('Error!')
    }
  },((error)=>{
    this.api.showError(error.error.error.message)
  }))
}
  }

}
