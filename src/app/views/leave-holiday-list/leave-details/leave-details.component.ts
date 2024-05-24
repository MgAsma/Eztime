import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-leave-details',
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.scss']
})
export class LeaveDetailsComponent implements OnInit {
  BreadCrumbsTitle:any='Add master leave details';
  isShown: boolean = false; // hidden by default
  allCenter: any;
  params = {
    pagination:"FALSE"
  }
 
  isMonthShown: boolean=false ; // hidden by default
  isYearShown: boolean = true; // seen by default
  // toggleMonthShow(event:any) {
  //   // //console.log(event.target.checked,'lll')
  //   this.isMonthShown=event.target.checked

  // }
  leaveTypeForm! : FormGroup
  user_id: string;
  orgId: any;

  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private location:Location,
    private common_service:CommonServiceService
    ) { }

  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  } 
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('org_id')
    this.initForm()
    this.getCenter()
    this.isMonthShown =false
  }
 
  initForm(){
    this.leaveTypeForm= this.builder.group({
      leave_applicable_for:['',[Validators.required]],
      encashment:[false],
      accrude_monthly:[false],
      leave_title:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      description:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      gracefull_days:['',[Validators.required]],
      max_encashments:[''],
      yearly_leaves:[''],
      monthly_leaves:[''],
      carry_forward_per:['',[Validators.required]],
      organization_id:this.orgId
      
    })
  }
  toggleMonthShow(event) {
    const monthlyLeavesControl = this.leaveTypeForm.get('monthly_leaves');
    const yearlyLeavesControl = this.leaveTypeForm.get('yearly_leaves');
    this.isMonthShown = this.leaveTypeForm.get('accrude_monthly').value 
   // console.log(this.isMonthShown,'this.isMonthShown')
    if (this.isMonthShown === true) {
      this.leaveTypeForm.patchValue({
        yearly_leaves:''
      }) 
      this.api.showError('Please enter yearly leaves')
      yearlyLeavesControl?.setValidators([Validators.required]);
      monthlyLeavesControl?.clearValidators();
     
    } else {
      this.leaveTypeForm.patchValue({
        monthly_leaves:''
      }) 
      this.api.showError('Please enter monthly leaves')
      monthlyLeavesControl?.setValidators([Validators.required]);
      yearlyLeavesControl?.clearValidators();
    }

    // Update the controls' validation status
    monthlyLeavesControl?.updateValueAndValidity();
    yearlyLeavesControl?.updateValueAndValidity();
  }
  toggleShow(event) {
    const maxEncashmentsControl = this.leaveTypeForm.get('max_encashments');
    if (event.target.checked === true) {
      if(this.leaveTypeForm.get('max_encashments').value === ''){
        this.api.showError('Please enter maximum encashment')
        maxEncashmentsControl?.setValidators([Validators.required]);
      }
      maxEncashmentsControl?.setValidators([Validators.required]);
    } else {
      if(this.leaveTypeForm.get('encashment').value  === false){
        this.leaveTypeForm.patchValue({
          max_encashments:''
        })
        maxEncashmentsControl?.clearValidators();
      }
    
    }

    // Update the control's validation status
    maxEncashmentsControl?.updateValueAndValidity();
  }
  get f(){
    return this.leaveTypeForm.controls;
  }
  getCenter(){
    this.api.getCenterDetails(this.params,this.orgId).subscribe((data:any)=>{
      if(data.result.data){
        this.allCenter = data.result.data;
        }
    })
  }
  toggleAdd() {
    const maxEncashmentsControl = this.leaveTypeForm.get('max_encashments');
    if (this.leaveTypeForm.get('encashment').value === true) {
      if(this.leaveTypeForm.get('max_encashments').value === ''){
        this.api.showError('Please enter maximum encashment')
        maxEncashmentsControl?.setValidators([Validators.required]);
      }
      maxEncashmentsControl?.setValidators([Validators.required]);
    } else {
      if(this.leaveTypeForm.get('encashment').value  === false){
        this.leaveTypeForm.patchValue({
          max_encashments:''
        })
        maxEncashmentsControl?.clearValidators();
      }
    
    }

    // Update the control's validation status
    maxEncashmentsControl?.updateValueAndValidity();
  }
  toggleMonthAdd() {
    const monthlyLeavesControl = this.leaveTypeForm.get('monthly_leaves');
    this.isMonthShown = this.leaveTypeForm.get('accrude_monthly').value 
    const yearlyLeavesControl:any = this.leaveTypeForm.get('yearly_leaves');
   
   // console.log(this.isMonthShown,'this.isMonthShown')
    if (this.isMonthShown === false) {
      if(this.leaveTypeForm.get('yearly_leaves').value === ''){
        this.leaveTypeForm.patchValue({
          yearly_leaves:''
        }) 
        yearlyLeavesControl?.setValidators(Validators.required);
      }
      yearlyLeavesControl?.updateValueAndValidity();
    }
    
  }
  addLeaveType(){
    if(this.leaveTypeForm.invalid){
      console.log(this.leaveTypeForm.value)
      this.toggleMonthAdd()
      this.toggleAdd()
      this.leaveTypeForm.markAllAsTouched()
    }
    else{
       const accrudeMonthly = this.leaveTypeForm.get('accrude_monthly').value;
       const monthlyLeaves = this.leaveTypeForm.get('monthly_leaves').value;
       const yearlyLeaves = this.leaveTypeForm.get('yearly_leaves').value;
        if (accrudeMonthly === true) {
          if(monthlyLeaves === ''){
            this.api.showError('Please enter monthly leaves')
            monthlyLeaves.setValidators([Validators.required]);
            yearlyLeaves.clearValidators();
            monthlyLeaves.updateValueAndValidity();
          }
          else{
           if(yearlyLeaves === ''){
            this.api.addLeaveTypeDetails(this.leaveTypeForm.value).subscribe(
              (response: any) => {
                if (response) {
                  this.initForm();
                  this.getCenter();
                  this.isMonthShown = false;
                  this.api.showSuccess('Leave details added successfully!');
                } else {
                  if (response['error'].message)
                    this.api.showError(response['error'].message);
                }
              },
              (error) => {
                this.api.showError(error.error.error.message);
              }
            );
           }
           else{
            this.leaveTypeForm.patchValue({
              yearly_leaves:''
            })
           }
            
          }
        }
        else{
          if(accrudeMonthly === false){
          if(yearlyLeaves !== ''){
            this.isMonthShown = false
            this.api.addLeaveTypeDetails(this.leaveTypeForm.value).subscribe(
              (response: any) => {
                if (response) {
                  this.initForm();
                  this.getCenter();
                  this.isMonthShown = false;
                  this.api.showSuccess('Leave details added successfully!');
                } else {
                  if (response['error'].message)
                    this.api.showError(response['error'].message);
                }
              },
              (error) => {
                this.api.showError(error.error.error.message);
              }
            );
          }else{
            this.api.showError('Please enter yearly leaves')
            this.leaveTypeForm.patchValue({
              yearly_leaves:''
            })
            this.isMonthShown = true
            this.leaveTypeForm.markAllAsTouched()
          }

         
        }
        else{
          this.leaveTypeForm.patchValue({
            monthly_leaves:''
          })
        }
      
        }
      }
        
      }
   
}

  
