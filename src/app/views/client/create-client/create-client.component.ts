import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
  BreadCrumbsTitle:any='Create client';
  clientForm! : FormGroup

  allClient:any=[];
  client:any;

  allIndustry:any=[];
  industry:any;
  orgId: any;

  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private router:Router,
    private location:Location,private common_service:CommonServiceService
    ) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('org_id')
    this.getIndustry();
    this.initForm();
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initForm(){
    this.clientForm= this.builder.group({
      c_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      c_contact_person:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      c_code:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      c_address:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      // c_satus:['',Validators.required],
      toi_ref_id:['',[Validators.required]],
      c_type:['',[Validators.required]],
      c_contact_person_email_id:['',[Validators.required,Validators.email]],
      c_contact_person_phone_no:['',[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      org_ref_id:this.orgId
    })
  }
  get f(){
    return this.clientForm.controls;
  }
  getIndustry(){
    let params = {
      pagination:"FALSE",
      org_ref_id:this.orgId
    }
    this.api.getIndustryDetails(params).subscribe((data:any)=>{
      this.allIndustry= data.result.data;
    },(error =>{
      this.api.showError(error.error.error.message)
    })
      //console.log(error);
      
   

    )
  }
  addClient(){
    if(this.clientForm.invalid){
      this.api.showError('Invalid!');
      this.clientForm.markAllAsTouched();
    }
    else{
      this.api.addClientDetails(this.clientForm.value).subscribe(response=>{
        if(response){
          this.api.showSuccess('Client added successfully!!');
          this.clientForm.reset()
          this.initForm()
        }
        else{
          this.api.showError('Error!')
        } 
        },(error =>{
          this.api.showError(error.error.error.message)
        })
      )
    }
  }

}
