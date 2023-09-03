import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-deadline-crossed',
  templateUrl: './deadline-crossed.component.html',
  styleUrls: ['./deadline-crossed.component.scss']
})
export class DeadlineCrossedComponent implements OnInit {
  @ViewChild('tabset') tabset: TabsetComponent;
  monthForm: FormGroup;
  selectedTab:any;
  formattedDate: any;
  page: any = 1;
  user_id: any;
  allDetails:any=[]
  accessConfig: any = [];
  c_params:any={};
  totalCount: any;
  monthNames = 
  ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  submited: boolean;
  orgId: string;
  changes: boolean = false;
  constructor(
    private fb:FormBuilder,
    private api:ApiserviceService,
    private common_service:CommonServiceService,
    private location:Location) { }

  ngOnInit(): void {
    this.initForm()
    this.user_id = sessionStorage.getItem('user_id')
    this.orgId = sessionStorage.getItem('org_id')
    let params={
      module:"TIMESHEET",
      menu:"DEAD_LINE_CROSSED",
      method:"VIEW",
      organization_id:this.orgId,
      // approved_state:'YET_TO_APPROVED',
      user_id:this.user_id,
      page_number:this.page,
      data_per_page:10,
      // timesheets_from_date:this.formattedDate,
      pagination:'TRUE'
    }
    this.getByStatus(params)
   this.getUserControls()
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initForm(){
    this.monthForm = this.fb.group({
      fromMonth:['',Validators.required],
    })
  }
  get f(){
    return  this.monthForm.controls;
  }
  onChanges(){
    this.changes = true
  }
  getUserControls(){
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10`).subscribe((res:any)=>{
      if(res.status_code !== '401'){
        this.common_service.permission.next(res['data'][0]['permissions'])
      }
      else{
        this.api.showError("ERROR !")
      }
    }
  
    )
  
  
    this.common_service.permission.subscribe(res=>{
      const accessArr = res
      if(accessArr.length > 0){
        accessArr.forEach((element) => {
          if(element['DEAD_LINE_CROSSED']){
            this.accessConfig = element['DEAD_LINE_CROSSED']
            
          }
          
        });
      }
     
   })
    }
    getByStatus(params){
      this.api.getData(`${environment.live_url}/${environment.time_sheets_deadline_crossed}?user_id=${params.user_id}&organization_id=${params.organization_id}&module=${params.module}&menu=${params.menu}&method=${params.method}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=${params.pagination}`).subscribe(res=>{
        this.allDetails = res['result']['data']
        this.totalCount = res['result'].pagination.number_of_pages
      })
    }


    getAllTimeSheet(params){ 
      this.api.getData(`${environment.live_url}/${environment.time_sheets_deadline_crossed}?user_id=${params.user_id}&organization_id=${params.organization_id}&module=${params.module}&menu=${params.menu}&method=${params.method}&timesheets_from_date=${params.timesheets_from_date}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=${params.pagination}`).subscribe(res=>{
        this.allDetails = res['result']['data']
        this.totalCount = res['result'].pagination.number_of_pages
      })
      
    }
   
    
  submit(){
    if(this.monthForm.invalid){
      this.monthForm.markAllAsTouched()
      this.api.showWarning('Please select month')
    }
    else{
      this.submited = true;
      this.handleMonthSelection(this.monthForm.value['fromMonth'])
      let c_params={
        module:"TIMESHEET",
        menu:"DEAD_LINE_CROSSED",
        method:"VIEW",
        organization_id:this.orgId,
        // approved_state:'YET_TO_APPROVED',
        user_id:this.user_id,
        page_number:this.page,
        data_per_page:10,
        timesheets_from_date:this.formattedDate,
        pagination:'TRUE'
       }
       this.getAllTimeSheet(c_params)
      this.tabset.tabs[0].active = true;  
    }
    }
    buttonClick(event){
      this.handleMonthSelection(this.monthForm.value['fromMonth'])
      if(event){
        if(this.changes){
          let c_params={
            module:"TIMESHEET",
            menu:"DEAD_LINE_CROSSED",
            method:"VIEW",
            // approved_state:this.selectedTab,
            user_id:this.user_id,
            organization_id:this.orgId,
            page_number:event,
            data_per_page:10,
            timesheets_from_date:this.formattedDate,
            pagination:'TRUE'
           }
             this.getAllTimeSheet(c_params)
        }
        else{
          let c_params={
            module:"TIMESHEET",
            menu:"DEAD_LINE_CROSSED",
            method:"VIEW",
            // approved_state:this.selectedTab,
            user_id:this.user_id,
            organization_id:this.orgId,
            page_number:event,
            data_per_page:10,
            pagination:'TRUE'
           }
             this.getByStatus(c_params)
        }
       
      }
    }
  
handleMonthSelection(selectedMonth) {
  //console.log(selectedMonth,"MONTHNAME");
  const currentYear = new Date().getFullYear();
  const monthIndex = new Date(Date.parse(selectedMonth + ' 1, ' + currentYear)).getMonth() + 1;
  const formattedMonth = ('0' + monthIndex).slice(-2); // Add leading zero if needed
  this.formattedDate = '01/' + formattedMonth +"/"+ currentYear;
 // console.log(this.formattedDate)
}
  
  updateStatus(uuuiuu){}
  tabState(data){
    //console.log(data,"REEE")
    if(data.heading == 'Approved timesheets'){
      this.selectedTab = 'APPROVED'
    }
    else if(data.heading == 'Yet to be approved' ){
      this.selectedTab = 'YET_TO_APPROVED' 
    }
    else if(data.heading == 'Declined timesheets'){
      this.selectedTab = 'DECLINED'
    }
    else if(data.heading == 'Time Sheets'){
      this.selectedTab = 'TIMESHEET'
    }
    else{
      this.selectedTab = 'YET_TO_APPROVED' 
    }
    this.handleMonthSelection(this.monthForm.value['fromMonth'])
    let c_params={
      module:"TIMESHEET",
      menu:"DEAD_LINE_CROSSED",
      method:"VIEW",
      // approved_state:this.selectedTab,
      user_id:this.user_id,
      organization_id:this.orgId,
      page_number:this.page,
      data_per_page:10,
      timesheets_from_date:this.formattedDate,
      pagination:'TRUE'
     }
      if(this.monthForm.invalid){
        this.monthForm.markAllAsTouched()
        this.api.showWarning('Please select month')
      }
      else{
        this.getAllTimeSheet(c_params)
      }
   

   }
}


