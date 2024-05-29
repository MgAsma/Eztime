import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { TimesheetService } from 'src/app/service/timesheet.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-month-timesheet',
  templateUrl: './month-timesheet.component.html',
  styleUrls: ['./month-timesheet.component.scss']
})
export class MonthTimesheetComponent implements OnInit {
  monthForm:FormGroup;
  BreadCrumbsTitle:any='Month timesheets';
  page: any =1;
  selectedTab:any = 'YET_TO_APPROVED';
  allDetails: any = [];
  submited: boolean = false;
  openDropdown: boolean = false;
  allListDataids: any = [];
  totalCount: any;
  user_id: string;
  accessConfig: any = [];
  exebtn: boolean = false;
  acceptOption: boolean = false;
  rejectOption: boolean = false;
  c_params: {};
  @ViewChild('tabset') tabset: TabsetComponent;
  @ViewChild('tabsets') tabsets: TabsetComponent;

  monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
  formattedDate: any;
  changes: boolean = false;
  orgId: any;
  constructor(
    private fb:FormBuilder,
    private api:ApiserviceService,
    private location:Location,
    private _timesheet:TimesheetService,private cdref: ChangeDetectorRef,
    private common_service:CommonServiceService) { }
    goBack(event)
  {
      event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
    }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.initForm()
    this.user_id = sessionStorage.getItem('user_id')
    this.orgId = sessionStorage.getItem('org_id')
    let c_params={
     module:"TIMESHEET",
     menu:"MONTH_APPROVAL_TIMESHEET",
     method:"VIEW",
     approved_state:'YET_TO_APPROVED',
     user_id:this.user_id,
     page_number:1,
     data_per_page:10,
     search_key:'',
     pagination:'TRUE'
    }
   this.getByStatus(c_params)
   this.getUserControls()
  }
  get f(){
    return  this.monthForm.controls;
  }
  initForm(){
    this.monthForm = this.fb.group({
      fromMonth:['',Validators.required],
    })
  }
  
  
   handleMonthSelection(selectedMonth) {
    //console.log(selectedMonth,"MONTHNAME");
    const currentYear = new Date().getFullYear();
    const monthIndex = new Date(Date.parse(selectedMonth + ' 1, ' + currentYear)).getMonth() + 1;
    const formattedMonth = ('0' + monthIndex).slice(-2); // Add leading zero if needed
    this.formattedDate = '01/' + formattedMonth +"/"+ currentYear;
  }
  onChanges(){
    this.changes = true
  }
  getUserControls(){
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10&organization_id=${this.orgId}&pagination=TRUE`).subscribe((res:any)=>{
      if(res.status_code !== '401'){
        this.common_service.permission.next(res['data'][0]['permissions'])
      }
      else{
        this.api.showError("ERROR !")
      }
    }
  
    )
  
  
    this.common_service.permission.subscribe(res=>{
      let accessArr:any = []
      accessArr = res
      if(accessArr.length > 0){
        accessArr.forEach((element) => {
          if (element['MONTH_APPROVAL_TIMESHEET']) {
            let exebtn = element['MONTH_APPROVAL_TIMESHEET'].includes('ACCEPT') ||  element['MONTH_APPROVAL_TIMESHEET'].includes('REJECT')// Check if 'ACCEPT' is present in the array
            this.exebtn = exebtn; // Set this.exebtn based on exebtn value
            element['MONTH_APPROVAL_TIMESHEET'].includes('ACCEPT') ? this.acceptOption = true : this.acceptOption = false
            element['MONTH_APPROVAL_TIMESHEET'].includes('REJECT') ? this.rejectOption = true : this.rejectOption = false
          }
          
        });
      }
    })
    }
  
  submit(){
    if(this.monthForm.invalid){
      this.monthForm.markAllAsTouched()
      this.api.showWarning('Please select month')
    }
    else{
      this.allDetails = []
      this.submited = true;
      this.handleMonthSelection(this.monthForm.value['fromMonth'])
      let c_params={
        module:"TIMESHEET",
        menu:"MONTH_APPROVAL_TIMESHEET",
        method:"VIEW",
        approved_state:'YET_TO_APPROVED',
        user_id:this.user_id,
        page_number:1,
        data_per_page:10,
        search_key:'',
        timesheets_from_date:this.formattedDate,
        pagination:'TRUE'
       }
      
       this.getAllTimeSheet(c_params)
       this.tabset.tabs[0].active = true; 
       this.tabsets.tabs[0].active = true;  
    }
    }
    getByStatus(params){
      this.allListDataids = []
      this.exebtn = false;
      this.api.getData(`${environment.live_url}/${environment.time_sheets_monthly}?user_id=${params.user_id}&module=${params.module}&menu=${params.menu}&method=${params.method}&approved_state=${params.approved_state}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=${params.pagination}&organization_id=${this.orgId}`).subscribe(res=>{
      if(res['result']['data']){ 
        if(res['result']['data'].length >1){
          res['result']['data'].forEach(element => {
           // console.log(element.id)
            this.allListDataids.push(element.id)
            this.exebtn = true;
          });
        }
        else{
          if(res['result']['data'].length === 1){
            this.allListDataids.push(res['result']['data'][0].id)
            this.exebtn = true;
          }  
        } 
        
        this.allDetails = res['result']['data']
        this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10};
        if(this.allDetails.length <= 0){
          this.api.showWarning('No records found !')
        }
      }
      
      },((error:any)=>{
        this.api.showError(error.error.error.message)
      })
      )
    }
    getAllTimeSheet(params){ 
      this.allListDataids = []
      this.exebtn = false;
      this.api.getData(`${environment.live_url}/${environment.time_sheets_monthly}?user_id=${params.user_id}&module=${params.module}&menu=${params.menu}&method=${params.method}&timesheets_from_date=${params.timesheets_from_date}&approved_state=${params.approved_state}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=${params.pagination}&organization_id=${this.orgId}`).subscribe(res=>{
      if(res['result']['data']){
        if(res['result']['data'].length >1){
          res['result']['data'].forEach(element => {
           // console.log(element.id)
            this.allListDataids.push(element.id)
            this.exebtn = true;
          });
        }
        else{
          if(res['result']['data'].length === 1){
            
            this.allListDataids.push(res['result']['data'][0].id)
            this.exebtn = true;
          }  
        } 
        this.allDetails = res['result']['data']
        
        this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10};
        if(this.allDetails.length <= 0){
          this.api.showWarning('No records found !')
        }
      }
        
      },((error:any)=>{
        this.api.showError(error.error.error.message)
      }))
      
    }
 
  
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
    if(this.monthForm.value['fromMonth'] !== ''){
      let c_params={
        module:"TIMESHEET",
        menu:"MONTH_APPROVAL_TIMESHEET",
        method:"VIEW",
        approved_state:this.selectedTab,
        user_id:this.user_id,
        page_number:1,
        data_per_page:10,
        search_key:'',
        timesheets_from_date:this.formattedDate,
        pagination:'TRUE'
       }
       
        if(this.monthForm.invalid){
          this.monthForm.markAllAsTouched()
          this.api.showWarning('Please select month')
        }
        else{
          this.allDetails = []
          this.getAllTimeSheet(c_params)
        }
    }
    else{
      let c_params={
        module:"TIMESHEET",
        menu:"MONTH_APPROVAL_TIMESHEET",
        method:"VIEW",
        approved_state:this.selectedTab,
        user_id:this.user_id,
        page_number:1,
        data_per_page:10,
        search_key:'',
        pagination:'TRUE'
       }
       this.getByStatus(c_params) 
    }
    
   

   }
 
   buttonClick(event){
    console.log(event.page);
    this.handleMonthSelection(this.monthForm.value['fromMonth'])
    if(event){
      this.cdref.detectChanges();
      if(this.changes){
        let c_params={
          module:"TIMESHEET",
          menu:"MONTH_APPROVAL_TIMESHEET",
          method:"VIEW",
          approved_state:this.selectedTab,
          user_id:this.user_id,
          page_number:event.page,
          data_per_page:event.tableSize,
          search_key:event.search_key,
          timesheets_from_date:this.formattedDate,
          pagination:'TRUE'
         }
           this.getAllTimeSheet(c_params)
      }
      else{
        let c_params={
          module:"TIMESHEET",
          menu:"MONTH_APPROVAL_TIMESHEET",
          method:"VIEW",
          approved_state:this.selectedTab,
          user_id:this.user_id,
          page_number:event.page,
          search_key:event.search_key,
          data_per_page:event.tableSize,
          pagination:'TRUE'
         }
           this.getByStatus(c_params)
      }
    
    }
  }

  searchFiter(event){
    this.handleMonthSelection(this.monthForm.value['fromMonth'])
    if(event){
      this.cdref.detectChanges();
      if(this.changes){
        let c_params={
          module:"TIMESHEET",
          menu:"MONTH_APPROVAL_TIMESHEET",
          method:"VIEW",
          approved_state:this.selectedTab,
          user_id:this.user_id,
          page_number:event.page,
          data_per_page:event.tableSize,
          search_key:event.search_key,
          timesheets_from_date:this.formattedDate,
          pagination:'TRUE'
         }
           this.getAllTimeSheet(c_params)
      }
      else{
        let c_params={
          module:"TIMESHEET",
          menu:"MONTH_APPROVAL_TIMESHEET",
          method:"VIEW",
          approved_state:this.selectedTab,
          user_id:this.user_id,
          page_number:event.page,
          search_key:event.search_key,
          data_per_page:event.tableSize,
          pagination:'TRUE'
         }
           this.getByStatus(c_params)
      }
    
    }
  }
   exeDropdown(){
    this.openDropdown = !this.openDropdown
   }
  
   updateStatus(status){
    let currMethod =  status === 'DECLINED'?'REJECT':'ACCEPT'
   
    let data= {
      user_id:this.user_id,
      update:"TRUE",
      approved_by_manager_id:this.user_id,
      module:"TIMESHEET",
      menu:"MONTH_APPROVAL_TIMESHEET",
      method:currMethod,
      time_sheet_id_list:this.allListDataids,
      time_sheet_id:null,
      approved_state: status
    }
 this._timesheet.updateStatus(data).subscribe(res =>{
  let c_params={
    module:"TIMESHEET",
    menu:"MONTH_APPROVAL_TIMESHEET",
    method:"VIEW",
    approved_state:this.selectedTab,
    user_id:this.user_id,
    page_number:1,
    data_per_page:10,
    search_key:'',
    timesheets_from_date:this.formattedDate,
    pagination:'TRUE'
   }
   if(res){
     const toastText = status === 'DECLINED' ? 'declined':'approved'
     this.api.showSuccess(`Timesheet ${toastText} updated successfully`)
     this.handleMonthSelection(this.monthForm.value['fromMonth'])
     this.getAllTimeSheet(c_params)
     this.ngOnInit()
   }
 })
 }
}
