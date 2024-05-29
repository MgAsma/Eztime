import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { TimesheetService } from 'src/app/service/timesheet.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  BreadCrumbsTitle:any='My timesheets ';
  timeSheetForm:FormGroup
  allDetails: any = [];
  params: any = {};
  pagination: { page_number: any; data_per_page: number; };
  page: any = 1;
  fromDate: any;
  toDate: any;
  changes: boolean;
  month: any;
  selectedTab: any;
  userId:any;
  count: number;
  cardData: any;
  p_FromDate= '2023-03-03';
  p_ToDate= '2023-03-30';
  totalCount: any;
  @ViewChild('tabset') tabset: TabsetComponent;
  orgId: any;
  constructor(
    private _fb:FormBuilder,
    private api:ApiserviceService,
    private datepipe:DatePipe,
    private location:Location,private cdref: ChangeDetectorRef,
    private common_service:CommonServiceService) { }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  get f(){
    return this.timeSheetForm.controls;
  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('org_id')
    let params={
      module:"TIMESHEET",
      menu:"PEOPLE_TIMESHEET",
      method:"VIEW",
      status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
      user_id:this.userId,
      page_number:this.page,
      data_per_page:10,
      search_key:'',
     }
      this.userId = sessionStorage.getItem('user_id')
      this.initForm()
      this.getByStatus(params)
  }
 initForm(){
  this.timeSheetForm = this._fb.group({
    from_date:[ '',Validators.required],
    to_date:['',Validators.required]
  })
 }
  getByStatus(params){
   
     this.api.getData(`${environment.live_url}/${environment.time_sheets}?user_id=${this.userId}&module=TIMESHEET&menu=PEOPLE_TIMESHEET&method=VIEW&search_key=${params.search_key}&approved_state=${params.status}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&pagination=TRUE&organization_id=${this.orgId}`).subscribe((res:any)=>{
      if( res['result'].data.length >0){
        this.allDetails = res['result']['data']
        this.cardData = res['result'].timesheet_dashboard
        this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10};
      }
      else{
        this.allDetails.length < 0 ? this.api.showWarning('No records found') : ''
       }
     })
  }

  getAllTimeSheet(params){ 
    this.api.getData(`${environment.live_url}/${environment.time_sheets}?user_id=${this.userId}&module=TIMESHEET&menu=PEOPLE_TIMESHEET&method=VIEW&search_key=${params.search_key}&approved_state=${params.status}&page_number=${params.page_number}&data_per_page=${params.data_per_page}&timesheets_from_date=${params.timesheets_from_date}&timesheets_to_date=${params.timesheets_to_date}&pagination=TRUE&organization_id=${this.orgId}`).subscribe((res:any)=>{
      if( res['result'].data.length >0){
        this.allDetails = res['result']['data']
        this.cardData = res['result'].timesheet_dashboard
        this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10};
        this.timeSheetForm.patchValue({
          from_date:this.datepipe.transform(this.cardData.from_date,'dd/MM/yyyy'),
          to_date:this.datepipe.transform(this.cardData.to_date,'dd/MM/yyyy')
        });
        //this.month   = this.cardData.from_date
      }
      else{
        this.allDetails.length < 0 ? this.api.showWarning('No records found') :''
       }
      
    })

  }
  changeFormat(){
    this.fromDate = this.timeSheetForm.value.from_date
    this.toDate   = this.timeSheetForm.value.to_date
    this.changes  = true;
    this.month    = this.timeSheetForm.value.to_date
   }
   buttonClick(event){
    if(event){
      this.cdref.detectChanges();
      let c_params={}
      if(this.changes){
        c_params={
          module:"TIMESHEET",
          menu:"PEOPLE_TIMESHEET",
          method:"VIEW",
          status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
          user_id:this.userId,
          page_number:event.page,
          data_per_page:event.tableSize,
          search_key:event.search_key,
          timesheets_to_date:this.datepipe.transform(this.toDate,'dd/MM/yyyy'),
          timesheets_from_date:this.datepipe.transform(this.fromDate,'dd/MM/yyyy') 
         }
         this.getAllTimeSheet(c_params);
      }
    else{
      c_params={
        module:"TIMESHEET",
        menu:"PEOPLE_TIMESHEET",
        method:"VIEW",
        status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
        user_id:this.userId,
        page_number:event.page,
        data_per_page:event.tableSize,
        search_key:event.search_key,
       }
       this.getByStatus(c_params)
    }
    
    }
  }
  searchFiter(event){
    if(event){
      this.cdref.detectChanges();
      this.allDetails = []
      this.cardData =""
      this.totalCount = ""
     let c_params={
        module:"TIMESHEET",
        menu:"PEOPLE_TIMESHEET",
        method:"VIEW",
        status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
        user_id:this.userId,
        page_number:event.page,
        data_per_page:event.tableSize,
       }
       this.api.getData(`${environment.live_url}/${environment.time_sheets}?search_key=${event.search_key}&user_id=${this.userId}&module=TIMESHEET&menu=PEOPLE_TIMESHEET&method=VIEW&approved_state=${c_params.status}&page_number=${c_params.page_number}&data_per_page=${c_params.data_per_page}&pagination=TRUE`).subscribe((res:any)=>{
        if( res['result'].data.length >0){
          this.allDetails = res['result']['data']
          this.cardData = res['result'].timesheet_dashboard
          this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10};
        }
        else{
          this.allDetails.length < 0 ? this.api.showWarning('No records found') : ''
         }
       })
    }
    
  }
   submit(){
      //console.log(this.timeSheetForm.value.from_date)
      let c_params = {}
      this.month    = this.timeSheetForm.value.to_date
      if(this.changes){
        c_params={
          module:"TIMESHEET",
          menu:"PEOPLE_TIMESHEET",
          method:"VIEW",
          status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
          user_id:this.userId,
          page_number:this.page,
          data_per_page:10,
          search_key:'',
          timesheets_to_date:this.datepipe.transform(this.toDate,'dd/MM/yyyy') ,
          timesheets_from_date:this.datepipe.transform(this.fromDate,'dd/MM/yyyy') 
         }
         if(this.timeSheetForm.invalid){
          this.timeSheetForm.markAllAsTouched()
          //this.api.showWarning('Please enter from date and to date')
        }
        else{
          this.allDetails = []
          this.getAllTimeSheet(c_params)
          this.tabset.tabs[0].active = true;
        }
      }
      else{
        if(this.timeSheetForm.invalid){
          this.timeSheetForm.markAllAsTouched()
          //this.api.showWarning('Please enter from date and to date')
        }
      }
    
    }
    tabState(data){
      if(data.heading == 'Approved timesheets'){
        this.selectedTab = 'APPROVED'
      }
      else if(data.heading == 'Yet to be approved' ){
        this.selectedTab = 'YET_TO_APPROVED' 
      }
      else if(data.heading == 'Declined timesheets'){
        this.selectedTab = 'DECLINED'
      }
      else if(data.heading == 'Flagged timesheets'){
        this.selectedTab = 'FLAGGED'
      }
      else{
        this.selectedTab = 'YET_TO_APPROVED' 
      }
      let c_params = {}
    if(this.changes){
      c_params={
        module:"TIMESHEET",
        menu:"PEOPLE_TIMESHEET",
        method:"VIEW",
        status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
        user_id:this.userId,
        page_number:this.page,
        data_per_page:10,
        search_key:'',
        timesheets_to_date:this.datepipe.transform(this.toDate,'dd/MM/yyyy') ,
        timesheets_from_date:this.datepipe.transform(this.fromDate,'dd/MM/yyyy') 
       }
      
        this.getAllTimeSheet(c_params)
      
    }
    else{
      c_params={
        module:"TIMESHEET",
        menu:"PEOPLE_TIMESHEET",
        method:"VIEW",
        status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
        user_id:this.userId,
        page_number:this.page,
        data_per_page:10,
        search_key:'',
      }
      this.getByStatus(c_params)
    }
   
    }
  

}
