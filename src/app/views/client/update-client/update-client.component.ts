import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup} from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss']
})
export class UpdateClientComponent implements OnInit {
  BreadCrumbsTitle:any='Update client';
  id:any;
  updateForm:FormGroup

  allIndustry:any=[];
  industry:any;
  page: string;
  tableSize: string;
  orgId: any;
  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService, 
    private route:ActivatedRoute,
    private router:Router,
    private location:Location,private common_service:CommonServiceService
    ) { 
    this.id =this.route.snapshot.paramMap.get('id')
    this.page = this.route.snapshot.paramMap.get('page')
    this.tableSize = this.route.snapshot.paramMap.get('tableSize')
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initForm(){
    this.updateForm= this.builder.group({
      c_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      c_contact_person:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      c_contact_person_address:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      c_contact_person_email_id:['',[Validators.required,Validators.email]],
      c_type:['',[Validators.required]],
      c_contact_person_phone_no:['',[Validators.required ,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      org_ref_id:this.orgId
      // c_code:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      // c_satus:['',Validators.required],
      // toi_ref_id:['',[Validators.required]],
    })
  }
 
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('org_id')
    this.initForm()
    // this.getIndustry();
    this.edit();
  }
  get f(){
    return this.updateForm.controls;
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

    )
  }
  edit(){
 let params = {
      page_number:this.page,
      data_per_page:this.tableSize,
      org_ref_id:this.orgId
  }
    this.api.getCurrentClientDetails(this.id,params).subscribe((data:any)=>{
      this.updateForm.patchValue({
        c_name:data.result.data[0].c_name,
        c_contact_person:data.result.data[0].c_contact_person,
        c_contact_person_address:data.result.data[0].c_contact_person_address,
        c_type:data.result.data[0].c_type,
        c_contact_person_email_id:data.result.data[0].c_contact_person_email_id,
        c_contact_person_phone_no:data.result.data[0].c_contact_person_phone_no
        // toi_ref_id:data.result.data[0].toi_ref_id,
        // c_code:data.result.data[0].c_code,
      })
    })
    
  }
  update(){
    if(this.updateForm.invalid){
      this.updateForm.markAllAsTouched()
    }else{
      this.api.updateClient(this.id,this.updateForm.value).subscribe(
        response=>{
          if(response){
          this.api.showSuccess('Client updated successfully!!');
          // this.initForm()
          setTimeout(() => {
            this.router.navigate(['/client/list'])
          }, 1000);
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

  preventSpace(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  validateKeyPress(event: KeyboardEvent) {
    // Get the key code of the pressed key
    const keyCode = event.which || event.keyCode;

    // Allow only digits (0-9), backspace, and arrow keys
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 8 && keyCode !== 37 && keyCode !== 39) {
      event.preventDefault(); // Prevent the default action (i.e., entering the character)
    }
  }

}
