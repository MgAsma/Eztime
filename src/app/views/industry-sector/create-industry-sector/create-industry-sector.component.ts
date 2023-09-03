import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-create-industry-sector',
  templateUrl: './create-industry-sector.component.html',
  styleUrls: ['./create-industry-sector.component.scss']
})
export class CreateIndustrySectorComponent implements OnInit {

  industryForm! : FormGroup

  allIndustry:any=[];
  industry:any;

  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private location:Location
    ) { }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  ngOnInit(): void {
    this.initForm()
  }
 initForm(){
    this.industryForm= this.builder.group({
      toi_title:['',[Validators.required,Validators.pattern(/^\S.*$/)]],
      toi_description:['',[Validators.required,Validators.pattern(/^\S.*$/)]],
      toi_status:['',[Validators.required]],
    })
  }
  get f(){
    return this.industryForm.controls;
  }
 
  addIndustry(){
    if(this.industryForm.invalid){
      this.api.showError('Invalid!');
      this.industryForm.markAllAsTouched();
    }
    else{
      this.api.addIndustryDetails(this.industryForm.value).subscribe(response=>{
        if(response){
          this.api.showSuccess('Industry added successfully!!');
          this.industryForm.reset();
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
