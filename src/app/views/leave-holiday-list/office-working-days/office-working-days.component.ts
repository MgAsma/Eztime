import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-office-working-days',
  templateUrl: './office-working-days.component.html',
  styleUrls: ['./office-working-days.component.scss']
})
export class OfficeWorkingDaysComponent implements OnInit {
  officeWorkingDaysForm:FormGroup
 
 
  submitted: boolean = false;
  permissions: any = [];
  enable: boolean = false;
  isSelectDisabled = true;
  hours:any = {};
  mins:any ={};
  user_id: any;
  hoursTo:any = {}
  constructor(
    private _fb:FormBuilder,
    private api:ApiserviceService,
    private commonService:CommonServiceService,
    private location:Location,
    private common_service:CommonServiceService) { }
    goBack(event)
  {
      event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
    }
  ngOnInit(): void {
    this.initForm()
    this.getWorkingDays()
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    // const accessAction = JSON.parse(sessionStorage.getItem('permissionArr'));
    // if(accessAction.length){
    //   accessAction.forEach(res=>{
    //    // console.log(res,"APP___________________")
    //     if(res.module_name === 'LEAVE/HOLIDAY_LIST'){
    //       this.permissions = res.permissions['OFFICE_WORKING_DAYS']
    //       if (this.permissions.includes('CREATE')) {
    //         this.enable = true;
    //       }
    //        //console.log(this.enable,'Permission for OFFICE_WORKING_DAYS')
    //     }
    //   })
      
    // }
   
    this.hours={
      hour1:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour2:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour3:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour4:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour5:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour6:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour7:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
    }
    this.hoursTo={
      hour1:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour2:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour3:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour4:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour5:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour6:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      hour7:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
    }
  
   this.mins={
    mins1:['0','5','10','15','20','25','30','35','40','45','50','55'],
    mins2:['0','5','10','15','20','25','30','35','40','45','50','55'],
    mins3:['0','5','10','15','20','25','30','35','40','45','50','55'],
    mins4:['0','5','10','15','20','25','30','35','40','45','50','55'],
    mins5:['0','5','10','15','20','25','30','35','40','45','50','55'],
    mins6:['0','5','10','15','20','25','30','35','40','45','50','55'],
    mins7:['0','5','10','15','20','25','30','35','40','45','50','55'],
   }
   this.getUserControls()
  }
  getUserControls(){
   
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10`).subscribe((res:any)=>{
      if(res.status_code !== '401'){
        this.common_service.permission.next(res['data'][0]['permissions'])
        //console.log(this.common_service.permission,"PERMISSION")
      }
      else{
        this.api.showError("ERROR !")
      }
      //console.log(res,'resp from yet');
      
    }
  
    )
  
    this.common_service.permission.subscribe(res=>{
      const accessArr = res
      if(accessArr.length > 0){
        accessArr.forEach((element,i) => {
          if(element['OFFICE_WORKING_DAYS']){
            this.permissions = element['OFFICE_WORKING_DAYS']
            if (this.permissions.includes('CREATE')) {
              this.enable = true;
            }
             }
        });
        
      }
     
     
    //  console.log(this.accessConfig,"this.accessConfig")
    })
    }
  get f(){
    return this.officeWorkingDaysForm.controls
  }
  initForm(){
    this.officeWorkingDaysForm = this._fb.group({
      monFromHrs:['',Validators.required],
      monFromMins:['',Validators.required],
      monToHours:['',Validators.required],
      monToMins:['',Validators.required],
      monTotalhrs:['',Validators.required],

      tuesFromHrs:['',Validators.required],
      tuesFromMins:['',Validators.required],
      tuesToHours:['',Validators.required],
      tuesToMins:['',Validators.required],
      tuesTotalhrs:['',Validators.required],


      wedFromHrs:['',Validators.required],
      wedFromMins:['',Validators.required],
      wedToHours:['',Validators.required],
      wedToMins:['',Validators.required],
      wedTotalhrs:['',Validators.required],

      thursFromHrs:['',Validators.required],
      thursFromMins:['',Validators.required],
      thursToHours:['',Validators.required],
      thursToMins:['',Validators.required],
      thursTotalhrs:['',Validators.required],


      friFromHrs:['',Validators.required],
      friFromMins:['',Validators.required],
      friToHours:['',Validators.required],
      friToMins:['',Validators.required],
      friTotalhrs:['',Validators.required],

      satFromHrs:[''],
      satFromMins:[''],
      satToHours:[''],
      satToMins:[''],
      satTotalhrs:[''],

      sunFromHrs:[''],
      sunFromMins:[''],
      sunToHours:[''],
      sunToMins:[''],
      sunTotalhrs:[''],
      
    })
  }
  valueChanges(){
    // console.log(this.officeWorkingDaysForm,)
    // if(this.officeWorkingDaysForm['monFromHrs']){
    //   this.officeWorkingDaysForm.patchValue({
    //   monFromMins:'',
    //   monToHours:'',
    //   monToMins:'',
    //   monTotalhrs:'',
    //   })
    // }
    // else if(this.officeWorkingDaysForm['tuesFromHrs']){
    //   this.officeWorkingDaysForm.patchValue({
    //   tuesFromMins:'',
    //   tuesToHours:'',
    //   tuesToMins:'',
    //   tuesTotalhrs:''
    //   })
    // }
    // else if(this.officeWorkingDaysForm['wedFromHrs']){
    //   this.officeWorkingDaysForm.patchValue({
    //   wedFromMins:'',
    //   wedToHours:'',
    //   wedToMins:'',
    //   wedTotalhrs:''
    //   })
    // }
    // else if(this.officeWorkingDaysForm['thursFromHrs']){
    //   this.officeWorkingDaysForm.patchValue({
    //     thursFromMins:'',
    //     thursToHours:'',
    //     thursToMins:'',
    //     thursTotalhrs:'',
    //   })
    // }
    // else if(this.officeWorkingDaysForm['friFromHrs']){
    //   this.officeWorkingDaysForm.patchValue({
    //     friFromMins:'',
    //     friToHours:'',
    //     friToMins:'',
    //     friTotalhrs:'',
    //   })
    // }
    // else if(this.officeWorkingDaysForm['satFromHrs']){
    //   this.officeWorkingDaysForm.patchValue({
    //     satFromMins:'',
    //     satToHours:'',
    //     satToMins:'',
    //     satTotalhrs:'',
    //   })
    // }
    // else if(this.officeWorkingDaysForm['sunFromHrs']){
    //   this.officeWorkingDaysForm.patchValue({
    //   sunFromMins:'',
    //   sunToHours:'',
    //   sunToMins:'',
    //   sunTotalhrs:'',
    //   })
    // }
    // else{
    //  this.getWorkingDays() 
    // }
  }
  
  getWorkingDays(){
    const org_id  = JSON.parse(sessionStorage.getItem('org_id'))
    this.api.getDataWithHeaders(`${environment.live_url}/${environment.office_working_days}?organization_id=${org_id}`).subscribe((res:any)=>{
    //  console.log(res,'data.office_working_days_all.FRIDAY.from_hr')

      const officeWorkingDays = res.data.office_working_days_all;
      this.officeWorkingDaysForm.patchValue({
        monFromHrs: officeWorkingDays.MONDAY.from_hr,
        tuesFromHrs: officeWorkingDays.TUESDAY.from_hr,
        wedFromHrs: officeWorkingDays.WEDNESDAY.from_hr,
        thursFromHrs: officeWorkingDays.THURSDAY.from_hr,
        friFromHrs: officeWorkingDays.FRIDAY.from_hr,
        satFromHrs: officeWorkingDays.SATURDAY.from_hr,
        sunFromHrs: officeWorkingDays.SUNDAY.from_hr,
      
        monFromMins: officeWorkingDays.MONDAY.from_min,
        tuesFromMins: officeWorkingDays.TUESDAY.from_min,
        wedFromMins: officeWorkingDays.WEDNESDAY.from_min,
        thursFromMins: officeWorkingDays.THURSDAY.from_min,
        friFromMins: officeWorkingDays.FRIDAY.from_min,
        satFromMins: officeWorkingDays.SATURDAY.from_min,
        sunFromMins: officeWorkingDays.SUNDAY.from_min,
      
        monToHours: officeWorkingDays.MONDAY.to_hr,
        tuesToHours: officeWorkingDays.TUESDAY.to_hr,
        wedToHours: officeWorkingDays.WEDNESDAY.to_hr,
        thursToHours: officeWorkingDays.THURSDAY.to_hr,
        friToHours: officeWorkingDays.FRIDAY.to_hr,
        satToHours: officeWorkingDays.SATURDAY.to_hr,
        sunToHours: officeWorkingDays.SUNDAY.to_hr,
      
        monToMins: officeWorkingDays.MONDAY.to_min,
        wedToMins: officeWorkingDays.WEDNESDAY.to_min,
        thursToMins: officeWorkingDays.THURSDAY.to_min,
        friToMins: officeWorkingDays.FRIDAY.to_min,
        tuesToMins: officeWorkingDays.TUESDAY.to_min,
        satToMins: officeWorkingDays.SATURDAY.to_min,
        sunToMins: officeWorkingDays.SUNDAY.to_min,
      
        monTotalhrs: officeWorkingDays.MONDAY.total_hours,
        tuesTotalhrs: officeWorkingDays.TUESDAY.total_hours,
        wedTotalhrs: officeWorkingDays.WEDNESDAY.total_hours,
        thursTotalhrs: officeWorkingDays.THURSDAY.total_hours,
        friTotalhrs: officeWorkingDays.FRIDAY.total_hours,
        satTotalhrs: officeWorkingDays.SATURDAY.total_hours ? officeWorkingDays.SATURDAY.total_hours : '0:0',
        sunTotalhrs: officeWorkingDays.SUNDAY.total_hours ? officeWorkingDays.SATURDAY.total_hours : '0:0',
      });
    })
  }
  submit(){
    if(this.officeWorkingDaysForm.invalid){
      this.officeWorkingDaysForm.markAllAsTouched()
      this.api.showError('Invalid')
      this.submitted = true
    }
    else{
      // window.alert(this.officeWorkingDaysForm.value)
      //console.log(this.officeWorkingDaysForm.value)

      const inputObj = this.officeWorkingDaysForm.value;
      const user_id  = JSON.parse(sessionStorage.getItem('user_id'))
      const org_id  = JSON.parse(sessionStorage.getItem('org_id'))
      
      // Mapping the object 
      const outputObj:any = {
        "updated_by_id": user_id,
        "organization_id": org_id,
        "office_working_days_all": {
          "MONDAY": {
            "from_hr": parseInt(inputObj.monFromHrs),
            "from_min": parseInt(inputObj.monFromMins),
            "to_hr": parseInt(inputObj.monToHours),
            "to_min": parseInt(inputObj.monToMins),
            "total_hours":parseInt(inputObj.monTotalhrs)
          },
       
          "TUESDAY": {
            "from_hr": parseInt(inputObj.tuesFromHrs),
            "from_min": parseInt(inputObj.tuesFromMins),
            "to_hr": parseInt(inputObj.tuesToHours),
            "to_min": parseInt(inputObj.tuesToMins),
            "total_hours":parseInt(inputObj.tuesTotalhrs)
          },
          "WEDNESDAY": {
            "from_hr": parseInt(inputObj.wedFromHrs),
            "from_min": parseInt(inputObj.wedFromMins),
            "to_hr": parseInt(inputObj.wedToHours),
            "to_min": parseInt(inputObj.wedToMins),
            "total_hours":parseInt(inputObj.wedTotalhrs)
          },
          "THURSDAY": {
            "from_hr": parseInt(inputObj.thursFromHrs),
            "from_min": parseInt(inputObj.thursFromMins),
            "to_hr": parseInt(inputObj.thursToHours),
            "to_min": parseInt(inputObj.thursToMins),
            "total_hours":parseInt(inputObj.thursTotalhrs)
          },
          "FRIDAY": {
            "from_hr": parseInt(inputObj.friFromHrs),
            "from_min": parseInt(inputObj.friFromMins),
            "to_hr": parseInt(inputObj.friToHours),
            "to_min": parseInt(inputObj.friToMins),
            "total_hours":parseInt(inputObj.friTotalhrs)
          },
          "SATURDAY": {
            "from_hr": parseInt(inputObj.satFromHrs),
            "from_min": parseInt(inputObj.satFromMins),
            "to_hr": parseInt(inputObj.satToHours),
            "to_min": parseInt(inputObj.satToMins),
            "total_hours":parseInt(inputObj.satTotalhrs)
          },
          "SUNDAY": {
            "from_hr": parseInt(inputObj.sunFromHrs),
            "from_min": parseInt(inputObj.sunFromMins),
            "to_hr": parseInt(inputObj.sunToHours),
            "to_min": parseInt(inputObj.sunToMins),
            "total_hours":parseInt(inputObj.sunTotalhrs)
          }
        }
      };
       // Check if Saturday values are all `00` and create an empty object
        const isSaturdayEmpty = Object.values(outputObj.office_working_days_all.SATURDAY).every(value => value === 0);
        if (isSaturdayEmpty) {
          outputObj.office_working_days_all.SATURDAY = {};
        }
        const isSundayEmpty = Object.values(outputObj.office_working_days_all.SUNDAY).every(value => value === 0);
        if (isSundayEmpty) {
          outputObj.office_working_days_all.SUNDAY = {};
        }
      console.log(outputObj);
      this.api.postData(`${environment.live_url}/${environment.office_working_days}`,outputObj).subscribe(res =>{
        if(res){
          this.api.showSuccess(`Office working days updated successfully!!`)
          this.ngOnInit()
        }
      },(error =>{
        this.api.showError(error.error.error.message)
      }))
    }
  }
  onChanges(){

    // Subscribe to value changes of the other form controls
    this.officeWorkingDaysForm.valueChanges.subscribe((value) => {
    
        //Monday Total Hrs
        const monFromHrs = Number(value.monFromHrs);
        const monFromMins = Number(value.monFromMins);
        const monToHours = Number(value.monToHours);
        const monToMins = Number(value.monToMins);

        //Tuesday Total Hrs
        const tuesFromHrs = Number(value.tuesFromHrs);
        const tuesFromMins = Number(value.tuesFromMins);
        const tuesToHours = Number(value.tuesToHours);
        const tuesToMins = Number(value.tuesToMins);

        //Wednesday Total Hrs
        const wedFromHrs = Number(value.wedFromHrs);
        const wedFromMins = Number(value.wedFromMins);
        const wedToHours = Number(value.wedToHours);
        const wedToMins = Number(value.wedToMins);

        //Thursday Total Hrs
        const thursFromHrs = Number(value.thursFromHrs);
        const thursFromMins = Number(value.thursFromMins);
        const thursToHours = Number(value.thursToHours);
        const thursToMins = Number(value.thursToMins);

        //Friday Total Hrs
        const friFromHrs = Number(value.friFromHrs);
        const friFromMins = Number(value.friFromMins);
        const friToHours = Number(value.friToHours);
        const friToMins = Number(value.friToMins);

        //saturday Total Hrs
        const satFromHrs = Number(value.satFromHrs);
        const satFromMins = Number(value.satFromMins);
        const satToHours = Number(value.satToHours);
        const satToMins = Number(value.satToMins);

        //Sunday Total Hrs
        const sunFromHrs = Number(value.sunFromHrs);
        const sunFromMins = Number(value.sunFromMins);
        const sunToHours = Number(value.sunToHours);
        const sunToMins = Number(value.sunToMins);


        const calculateWorkingHours = (fromHrs, fromMins, toHrs, toMins) => {
          const totalMinutes = (toHrs * 60 + toMins) - (fromHrs * 60 + fromMins);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return hours + ":" + minutes;
        };
        // Perform the calculation
        
        const monTotalHrs = calculateWorkingHours(monFromHrs, monFromMins, monToHours, monToMins);
        const tuesTotalHrs = calculateWorkingHours(tuesFromHrs, tuesFromMins, tuesToHours, tuesToMins);
        const wedTotalHrs = calculateWorkingHours(wedFromHrs, wedFromMins, wedToHours, wedToMins);
        const thursTotalHrs = calculateWorkingHours(thursFromHrs, thursFromMins, thursToHours, thursToMins);
        const friTotalHrs = calculateWorkingHours(friFromHrs, friFromMins, friToHours, friToMins);
        const satTotalHrs = calculateWorkingHours(satFromHrs, satFromMins, satToHours, satToMins);
        const sunTotalHrs = calculateWorkingHours(sunFromHrs, sunFromMins, sunToHours, sunToMins);


      if (this.officeWorkingDaysForm.value.monTotalhrs !== monTotalHrs) {
        // Update the value of Totalhrs form control
        this.officeWorkingDaysForm.patchValue({ 
          monTotalhrs:monTotalHrs 
        });
      }
      else if(this.officeWorkingDaysForm.value.tuesTotalhrs !== tuesTotalHrs){
        this.officeWorkingDaysForm.patchValue({  
          tuesTotalhrs:tuesTotalHrs
        });
      }
      else if(this.officeWorkingDaysForm.value.wedTotalhrs !== wedTotalHrs){
        this.officeWorkingDaysForm.patchValue({  
          wedTotalhrs:wedTotalHrs
        });
      }
      else if(this.officeWorkingDaysForm.value.thursTotalhrs !== thursTotalHrs){
        this.officeWorkingDaysForm.patchValue({  
          thursTotalhrs:thursTotalHrs
        });
        
      } 
      else if(this.officeWorkingDaysForm.value.friTotalhrs !== friTotalHrs){
        this.officeWorkingDaysForm.patchValue({  
          friTotalhrs:friTotalHrs
        });
        
      }   
      else if(this.officeWorkingDaysForm.value.satTotalhrs !== satTotalHrs){
        this.officeWorkingDaysForm.patchValue({  
          satTotalhrs:satTotalHrs
        });
        
      } 
        else if(this.officeWorkingDaysForm.value.sunTotalhrs !== sunTotalHrs){
          this.officeWorkingDaysForm.patchValue({  
            sunTotalhrs:sunTotalHrs
          });
          
        }    
        });
        }
    

}
