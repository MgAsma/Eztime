import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {

  clientForm! : FormGroup

  allClient:any=[];
  client:any;

  allIndustry:any=[];
  industry:any;

  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private router:Router,
    private location:Location
    ) { }

  ngOnInit(): void {
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
     
    })
  }
  get f(){
    return this.clientForm.controls;
  }
  getIndustry(){
    let params = {
      pagination:"FALSE"
    }
    this.api.getIndustryDetails(params).subscribe((data:any)=>{
      this.allIndustry= data.result.data;
    },error=>{
      //console.log(error);
      
    }

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
        }
      )
    }
  }

}
