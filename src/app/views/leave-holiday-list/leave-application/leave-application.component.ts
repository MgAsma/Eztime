import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder,FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';

import * as dayjs from 'dayjs';

import { environment } from 'src/environments/environment';
import { LocaleConfig } from 'ngx-daterangepicker-material';


@Component({
  selector: 'app-leave-application',
  templateUrl: './leave-application.component.html',
  styleUrls: ['./leave-application.component.scss']
})
export class LeaveApplicationComponent implements OnInit {
  
  leaveForm! : FormGroup

  allLeave:any=[];
  leave:any;
  uploadFile: any;
  url: any;
  fileUrl: string | ArrayBuffer;
  user_id;
  balanceLeave: any;
  workingDays: number;
  min=new Date().toISOString().split("T")[0];
  ccSetting: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  allPeopleGroup: any;
  peopleId: any;
  leaveType: any = [];
  invalidDate: boolean = false;
  
  disableTextbox: boolean = true;
  disableTextbox2: boolean = true;

  
  
  leaveDetails: any = [];
  reservedDates: any = [];
  noLeaves: boolean = false;
  minDate: any;
  maxDate: any;
  
  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private datepipe:DatePipe,
    private location:Location,
    ) { }
     d = dayjs();

    selected: any;
    locale: LocaleConfig |any = {
      applyLabel: 'Appliquer',
      customRangeLabel: ' - ',
      //daysOfWeek: this.d.day(),
     // monthNames: d.monthsShort(),
      // firstDay: d.localeData().firstDayOfWeek(),
    }
  
   
  
    myFilter = (d: Date | null): boolean => {
      // Disable weekends
      const day = (d || new Date()).getDay();
      return day !== 0 && day !== 6 ;
    }
    
    goBack(event)
  {
      event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
    }

  ngOnInit(): void { 
   this.user_id = JSON.parse(sessionStorage.getItem('user_id'));
   this.getPeopleGroup();
   this.getLeaveType();
   this.initForm();
   this.enableDatepicker()
   
 
   this.getAllleaveData(); 
  
  }
  
  getAllleaveData(){
    let params = {
      pagination:"FALSE"
    }
    let user_id = sessionStorage.getItem('user_id')
    this.api.getData(`${environment.live_url}/${environment.users_leave_details}?user_id=${user_id}&method=VIEW&menu=MY_LEAVES&module=LEAVE/HOLIDAY_LIST&page_number=1&data_per_page=2&pagination=${params.pagination}`).subscribe(
      (res:any)=>{
        if(res.result.data){
          this.leaveDetails = res.result.data
        this.leaveDetails.forEach(element => {
          // this.reservedDates.push({
          //   fromDate: this.datepipe.transform(element.leaveApplication_from_date * 1000, 'yyyy-MM-dd'),
          //   toDate: this.datepipe.transform(element.leaveApplication_to_date * 1000, 'yyyy-MM-dd')
          // });
          this.reservedDates.push(this.datepipe.transform(element.leaveApplication_from_date * 1000, 'yyyy-MM-dd'))
        });
        }
       

      //console.log(this.reservedDates,"FROMDATE")
    },
    err=>{
     this.api.showError(err.error.error.message)
    }
    )
  }
  enableDatepicker() {
    // Assuming you have a reference to your ngx-datepicker, let's call it 'myDatepicker'
    // You can use this.reservedDates to disable specific dates
    // console.log(this.myDatepicker,"CONSOLE")
  }
  toggleDisable(event) {
    if(event == "from_date"){
      this.disableTextbox2 = false;
      this.leaveForm.patchValue({
        leaveApplication_to_date :['']
      })
      //this.invalidDate = false;
     
    }
    else{
      this.disableTextbox2 = true;
      if(event == "leave_type_id"){
        this.disableTextbox = false;
        this.leaveForm.patchValue({
          leaveApplication_from_date:'',
          leaveApplication_to_date:'',
          from1_session:'',    
          to1_session:'',
          balance:'',    
          days:'',
      })
        // this.disableTextbox2 = true;
      }
    }
   
   
  }
  getLeaveType(){
    this.api.getLeaveTypeDetails().subscribe((data:any)=>{
      this.leaveType= data.result.data;
    },error=>{
      this.api.showError(error.error.error.message);
      
    }

    )
  }
  endDateValidator():any {
    const yearStartDate = new Date(this.leaveForm.get('leaveApplication_from_date').value).getTime() / (1000 * 60);
    const yearEndDate = new Date(this.leaveForm.get('leaveApplication_to_date').value).getTime() / (1000 * 60);
    if(yearStartDate > yearEndDate ){
      this.invalidDate = true;
      //console.log(yearStartDate > yearEndDate,'true')
    }
    else{
      this.invalidDate = false;
    }
    this.leaveForm.patchValue({
      to1_session:'', 
      balance:'',    
      days:''
    })
  }
 
  // getMinDate(): string {
  //   const appliedFromDates = this.reservedDates.map(appliedDate => appliedDate.fromDate);
  //   const minDate:any = new Date(Math.min(...appliedFromDates.filter(date => date != null)));
  //   //const minDate = appliedFromDates
  //   //console.log(minDate)
  //   return minDate;
  // }
  
  // getMaxDate(): string {
  //   const appliedToDates = this.reservedDates.map(appliedDate => appliedDate.toDate);
  //   const maxDate:any = new Date(Math.max(...appliedToDates.filter(date => date != null)));
  //   //console.log(maxDate)
  //   return maxDate;
  // }
  // Example: Initialize minDate and maxDate based on the backend response
  


  initForm(){
    this.leaveForm = this.builder.group({
      reason:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      contact_details:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      leave_application_file_attachment:['',this.fileFormatValidator],
      cc_to:['',Validators.required],
      leaveApplication_from_date:['',[Validators.required]],
      leaveApplication_to_date:['',[Validators.required]],         
      leave_type_id:['',[Validators.required]],    
      from1_session:['',[Validators.required]],    
      to1_session:['',[Validators.required]],    
      balance:['',[Validators.required]],    
      days:['',[Validators.required]],   
    })
   
    
  }
  fileFormatValidator(control: AbstractControl): ValidationErrors | null {
    const allowedFormats = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
    const file = control.value;
    if (file) {
      const fileExtension = file.substr(file.lastIndexOf('.')).toLowerCase();
      if (!allowedFormats.includes(fileExtension)) {
        return { accept: true };
      }
    }
    return null;
  }
  
  get f(){
    return this.leaveForm.controls;
  }
  uploadImageFile(event:any){
    this.uploadFile=  event.target.files[0];
    if(event.target.files && event.target.files[0]){
      const reader =new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event:any)=>{
        this.url = event.target.result;
        this.fileUrl= reader.result
        this.leaveForm.patchValue({leave_application_file_attachment:this.fileUrl})
      ///  console.log(this.fileUrl,"FILEURL")

      }
    }
  }
  
  getappliedLeave(){
  let holidayParams={
    date:'01/01/2023',
    country:'IN',
    state:'KA'
  }
  this.api.getHolidayList(holidayParams).subscribe(res=>{
  const holidays = res;
  //console.log(holidays,"yutre")
  const startDate = new Date(this.leaveForm.value.leaveApplication_from_date);
  const endDate = new Date(this.leaveForm.value.leaveApplication_to_date);
  
 this.workingDays = this.getWorkingDays(startDate, endDate, holidays);

  if (this.workingDays === 1) { 
    const selectedFrom = this.leaveForm.value.from1_session;
    const selectedTo   = this.leaveForm.value.to1_session
   // //console.log(selectedFrom,selectedTo)
    this.workingDays = selectedFrom === selectedTo ? 0.5: 1 ;
   }
   else{
    const selectedFrom = this.leaveForm.value.from1_session;
    const selectedTo   = this.leaveForm.value.to1_session
   // //console.log(selectedFrom,selectedTo)
    if(selectedFrom === selectedTo){
      this.workingDays = (this.workingDays - 0.5)
    }

   }
  //console.log(`Number of working days: ${this.workingDays}`);
  this.leaveForm.patchValue({
    days:this.workingDays
   })
   //console.log(this.leaveForm.value.days,"DAYS")
   this.getBalance(this.workingDays)
  })

  
  }
 
getBalance(workingdays){
  let data={
    "leave_title": this.leaveForm.value.leave_type_id,
    "description": this.leaveForm.value.reason,
    "accrude_monthly":false,
    "monthly_leaves": "",
    "yearly_leaves": 20,
    "carry_forward_per": "",
    "gracefull_days": 2,
    "encashment":false,
    "max_encashments": "",
    "leave_applicable_for": 1
}

let params={
  user_id:this.user_id,
  days:workingdays,
  leave_type_id:this.leaveForm.value.leave_type_id
}
// //console.log(this.leaveForm.value.days,"workingdays")
this.api.getLeaveBalance(params,data).subscribe(res=>{
  this.balanceLeave = res['result'].balance_days
  //console.log(this.balanceLeave,"BALACE")
  this.noLeaves = false
  this.leaveForm.patchValue({balance:this.balanceLeave ? this.balanceLeave :0})
},(error:any)=>{
  this.noLeaves = true
  this.api.showError(error.error.error.message)
})
 
}
  
   getWorkingDays(startDate: Date, endDate: Date, holidays): number {
    let workingDays = 0;
    let totalDays = 0;
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0 || d.getDay() === 6) {
        continue;
      }
      const dateString = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
      if (dateString in holidays) {
        continue;
      }
    
      workingDays++;
      totalDays++;
    }
    
    return workingDays;
  }

  
  
  onPeopleSelect(event: any) {
    this.peopleId.push(event.id)
    
  }
  onPeopleSelectAll(event: any) {
    event.forEach((element : any)  => {
      this.peopleId.push(element.id)
    });
    //console.log(this.peopleId)
  }
  getPeopleGroup(){
    this.ccSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'opg_group_name',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    
    this.api.getPeopleGroupDetails().subscribe((data:any)=>{
      if(data){
        this.allPeopleGroup = data.result.data;
      }
      else{
        //console.log('Error');
      }
      
    }

    )
  }
  addLeave(){
    if(this.leaveForm.invalid){
      this.api.showError('Invalid');
      this.leaveForm.markAllAsTouched()
    }
    else{
      let  startDate = this.leaveForm.value.leaveApplication_from_date
      let  endDate   = this.leaveForm.value.leaveApplication_to_date
      const selectedCCTo = this.leaveForm.value.cc_to.map(f=> f.id)
      console.log(selectedCCTo)
      if(this.noLeaves == false){
       let data = {
      module:"LEAVE/HOLIDAY_LIST",
      menu:"LEAVE_APPLICATION",
      method:"CREATE",
      reason:this.leaveForm.value.reason,
      contact_details:this.leaveForm.value.contact_details,
      leave_application_file_attachment:this.leaveForm.value.leave_application_file_attachment,
      cc_to:selectedCCTo,
      leaveApplication_from_date:this.datepipe.transform(startDate,'dd/MM/yyyy'),
      leaveApplication_to_date:this.datepipe.transform(endDate,'dd/MM/yyyy'),         
      leave_type_id:Number(this.leaveForm.value.leave_type_id),    
      from_session:this.leaveForm.value.from1_session,    
      to_session:this.leaveForm.value.to1_session,    
      balance:String(this.leaveForm.value.balance),    
      days:this.leaveForm.value.days,
      user_id:this.user_id,   
      }
       
        this.api.addLeaveDetails(data).subscribe(
          response=>{
            if(response){
              this.api.showSuccess('Leave added successfully!!');
              this.leaveForm.reset()
              this.leaveForm.patchValue({
                leaveApplication_from_date:'',
                leaveApplication_to_date:'',
                from1_session:'',
                to1_session:'',
                balance:'',
                days:'',
                reason:'',
                contact_details:'',
                leave_application_file_attachment:'',
                cc_to:'',
              })
              
              // this.ngOnInit()
             } 
            else{
              this.api.showError('Error')
            }
          },error=>{
            this.api.showError(error.error.error.message)
          }
          
        )
      }
      else{
        this.api.showWarning('leaves are not available')
      }
     
    }
  }

}
