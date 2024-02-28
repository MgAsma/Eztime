import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from'@angular/common';
@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent implements OnInit {

  departmentForm! : FormGroup

  allDepartment:any=[];
  department:any;
  org_id: string;

  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private location:Location
    
    ) { }

  ngOnInit(): void {
  this.org_id = sessionStorage.getItem('org_id')
  this.initForm()
  }
  goBack(event){
  event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  }
  initForm(){
    this.departmentForm= this.builder.group({
      od_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      od_status:['',Validators.required],
      organization_id:this.org_id
    })
  }
  get f(){
    return this.departmentForm.controls;
  }
 
  addDepartment(){
    if(this.departmentForm.invalid){
      this.api.showError('Invalid!')
      this.departmentForm.markAllAsTouched();
    }
    else{
      this.api.addDepartmentDetails(this.departmentForm.value).subscribe(res=>{
        if(res){
          this.api.showSuccess('Department added successfully!');
          this.departmentForm.reset();
          this.initForm();
        }
        else{
          this.api.showError('Error!')
        }
      },(error:any)=>{
        this.api.showError(error.error.error.message ? error.error.error.message : error.error.error.detail)
      })
    }
  }

}
