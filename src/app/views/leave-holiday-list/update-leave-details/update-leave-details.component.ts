import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder,FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-update-leave-details',
  templateUrl: './update-leave-details.component.html',
  styleUrls: ['./update-leave-details.component.scss']
})
export class UpdateLeaveDetailsComponent implements OnInit {
  id:any;
  isShown: boolean = false; // hidden by default
  allCenter: any;
  updateForm: FormGroup;
  
  params = {
    pagination:"FALSE"
  }
  isMonthShown: boolean = false; // hidden by default
  isYearShown: boolean = true; // seen by default
  // toggleMonthShow() {
  //   this.isMonthShown = !this.isMonthShown;
  // }
  

  constructor(private builder:FormBuilder, private api: ApiserviceService, private route:ActivatedRoute,
    private router:Router, private location:Location) { 
    this.id =this.route.snapshot.paramMap.get('id')
    
  }

  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
 
  ngOnInit(): void {
    this.initForm();
    this.edit();
    this.getCenter()
  }
  initForm(){
    this.updateForm= this.builder.group({
      leave_title:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      gracefull_days:['',[Validators.required]],
      description:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      max_encashments:['',],
      yearly_leaves:[''],
      monthly_leaves:[''],
      carry_forward_per:['',[Validators.required]],
      leave_applicable_for:['',[Validators.required]],
      encashment:[false],
      accrude_monthly:[false]  
    })
    
  }
 
  toggleMonthShow() {
    this.isMonthShown = this.updateForm.get('accrude_monthly')?.value;
    const monthlyLeavesControl = this.updateForm.get('monthly_leaves');
    const yearlyLeavesControl = this.updateForm.get('yearly_leaves');

    if (this.isMonthShown === true) {
      this.isMonthShown = true 
      this.updateForm.patchValue({
        monthly_leaves:''
      }) 
      monthlyLeavesControl?.setValidators(Validators.required);
      yearlyLeavesControl?.clearValidators();
    } else {
      this.isMonthShown = false
      this.updateForm.patchValue({
        yearly_leaves:''
      }) 
      yearlyLeavesControl?.setValidators(Validators.required);
      monthlyLeavesControl?.clearValidators();
    }

    // Update the controls' validation status
    monthlyLeavesControl?.updateValueAndValidity();
    yearlyLeavesControl?.updateValueAndValidity();
  }
  
  toggleShow(event) {
    const maxEncashmentsControl = this.updateForm.get('max_encashments');
    if (event.target.checked === true) {
      this.updateForm.patchValue({encashment:true})
      if(this.updateForm.get('max_encashments').value === ''){
        this.api.showError('Please enter maximum encashment')
        maxEncashmentsControl?.setValidators([Validators.required]);
      }
      maxEncashmentsControl?.setValidators([Validators.required]);
    } else {
      if(event.target.checked === false){
        this.updateForm.patchValue({
          max_encashments:'',
          encashment:false
        })
        maxEncashmentsControl?.clearValidators();
      }
    
    }

    // Update the control's validation status
    maxEncashmentsControl?.updateValueAndValidity();
  }
  get f(){
    return this.updateForm.controls;
  }
  
  edit(){
    this.api.getCurrentLeaveTypeDetails(this.id).subscribe((data:any)=>{
      //console.log(data,"LEAVE TYPE DETAILS")
      const filteredLeaves = data.result.data.filter(f=>{
        return +f.id === +this.id
      })
      this.updateForm.patchValue({leave_title:filteredLeaves[0].accrude_monthly})
      this.updateForm.patchValue({leave_title:filteredLeaves[0].leave_title})
      this.updateForm.patchValue({gracefull_days:filteredLeaves[0].gracefull_days})
      this.updateForm.patchValue({description:filteredLeaves[0].description})
      this.updateForm.patchValue({max_encashments:filteredLeaves[0].max_encashments})
      this.updateForm.patchValue({yearly_leaves:filteredLeaves[0].yearly_leaves})
      this.updateForm.patchValue({monthly_leaves:filteredLeaves[0].monthly_leaves})
      this.updateForm.patchValue({carry_forward_per:filteredLeaves[0].carry_forward_per})
      this.updateForm.patchValue({leave_applicable_for:filteredLeaves[0].leave_applicable_for_id})
    //  this.updateForm.patchValue({encashment:filteredLeaves[0].encashment})
      this.updateForm.patchValue({accrude_monthly:filteredLeaves[0].accrude_monthly})
    })
  }
  toggleMonthUpdate() {
   
    this.isMonthShown = this.updateForm.get('accrude_monthly')?.value;
    const monthlyLeavesControl:any = this.updateForm.get('monthly_leaves');
    const yearlyLeavesControl:any = this.updateForm.get('yearly_leaves');

    if (this.isMonthShown === true) { 
      // if(monthlyLeavesControl === ''){
      //   this.api.showError('Please enter monthly leaves')
      // }
      
      monthlyLeavesControl?.setValidators(Validators.required);
      yearlyLeavesControl?.clearValidators();
    } else {
      // if(yearlyLeavesControl === ''){
      //   this.api.showError('Please enter yearly leaves')
      // }
      yearlyLeavesControl?.setValidators(Validators.required);
      monthlyLeavesControl?.clearValidators();
    }

    // Update the controls' validation status
    monthlyLeavesControl?.updateValueAndValidity();
    yearlyLeavesControl?.updateValueAndValidity();
  }
  toggleAdd() {
    console.log(this.updateForm.get('encashment').value,"VALUE------------------")
    const maxEncashmentsControl = this.updateForm.get('max_encashments');
    if (this.updateForm.get('encashment').value === true) {
      if(this.updateForm.get('max_encashments').value === ''){
        this.api.showError('Please enter maximum encashment')
        maxEncashmentsControl?.setValidators([Validators.min(1),Validators.required]);
      }
      maxEncashmentsControl?.setValidators([Validators.required]);
    } else {
      if(this.updateForm.get('encashment').value  === false){
        this.updateForm.patchValue({
          max_encashments:''
        })
        maxEncashmentsControl?.clearValidators();
      }
    
    }

    // Update the control's validation status
    maxEncashmentsControl?.updateValueAndValidity();
  }
 
  update(){
    if(this.updateForm.invalid){ 
      this.toggleMonthUpdate()
      this.toggleAdd()
      this.updateForm.markAllAsTouched();
    }
    else{
      const accrudeMonthly = this.updateForm.get('accrude_monthly').value;
      const monthlyLeaves = this.updateForm.get('monthly_leaves').value;
      const yearlyLeaves = this.updateForm.get('yearly_leaves').value;
       if (accrudeMonthly === true) {
         if(monthlyLeaves === null || monthlyLeaves === ''){
          this.updateForm.patchValue({
            monthly_leaves:''
          }) 
           this.api.showError('Please enter monthly leaves')
           monthlyLeaves.setValidators(Validators.required);
           yearlyLeaves.clearValidators();
           monthlyLeaves.updateValueAndValidity();
         }
         else{
          if(monthlyLeaves !== null){
            this.updateForm.patchValue({
              yearly_leaves:''
            })

            let data = {
              leave_title:this.updateForm.value.leave_title,
              gracefull_days:Number(this.updateForm.value.gracefull_days),
              description:this.updateForm.value.description,
              max_encashments:Number(this.updateForm.value.max_encashments),
              yearly_leaves:'',
              monthly_leaves:Number(this.updateForm.value.monthly_leaves),
              carry_forward_per:Number(this.updateForm.value.carry_forward_per),
              leave_applicable_for:Number(this.updateForm.value.leave_applicable_for),
              encashment:this.updateForm.value.encashment,
              accrude_monthly:this.updateForm.value.accrude_monthly 
            }
           console.log(data,'MONTHLY')
            
           this.api.updateLeaveTypeCategory(this.id,data).subscribe(
             (response: any) => {
               if (response) {
                 this.initForm();
                 this.getCenter();
                 this.isMonthShown = false;
                 this.api.showSuccess('Leave details updated successfully!');
                 this.router.navigate(['/leave/leaveMaster'])
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
       }
      }
       else{
         if(accrudeMonthly === false){
         if(yearlyLeaves !== null){
           this.isMonthShown = false
           let data = {
            leave_title:this.updateForm.value.leave_title,
            gracefull_days:Number(this.updateForm.value.gracefull_days),
            description:this.updateForm.value.description,
            max_encashments:Number(this.updateForm.value.max_encashments),
            yearly_leaves:Number(this.updateForm.value.yearly_leaves),
            monthly_leaves:'',
            carry_forward_per:Number(this.updateForm.value.carry_forward_per),
            leave_applicable_for:Number(this.updateForm.value.leave_applicable_for),
            encashment:this.updateForm.value.encashment,
            accrude_monthly:this.updateForm.value.accrude_monthly 
          }
          // console.log(data,'YEARLY')
           this.api.updateLeaveTypeCategory(this.id,data).subscribe(
             (response: any) => {
               if (response) {
                 this.initForm();
                 this.getCenter();
                 this.isMonthShown = false;
                 this.api.showSuccess('Leave details updated successfully!');
                 this.router.navigate(['/leave/leaveMaster'])
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
          if( yearlyLeaves === null){
            this.updateForm.patchValue({
              yearly_leaves:''
            })
             this.api.showError('Please enter yearly leaves')
            
             this.isMonthShown = true
             this.updateForm.markAllAsTouched()
             yearlyLeaves?.setValidators(Validators.required);
             monthlyLeaves?.clearValidators();
             yearlyLeaves.updateValueAndValidity();
           }
  
          
          }
     
       }
       else{
         this.updateForm.patchValue({
           monthly_leaves:''
         })
       }
     
       }
     }
       
  }
  getCenter(){
    this.api.getCenterDetails(this.params).subscribe((data:any)=>{
      if(data.result.data){
        this.allCenter = data.result.data;
        // //console.log(data,"CENTER ID")
        }
    })
  }
  // convertToZero(event: any): void {
    
  //   const inputValue = Number(event.target.value);
  //     if (inputValue <0) {
  //      event.target.value = 0;
  //      this.updateForm.patchValue({
  //       type:0
  //      })
  //     }
     
  // }
}
