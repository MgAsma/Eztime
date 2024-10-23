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
  selectedTab = 'Pending';
  userId:any;
  count: number;
  cardData: any = {};
  p_FromDate= '2023-03-03';
  p_ToDate= '2023-03-30';
  totalCount: any;
  term:string;
  showSearch=false;
  @ViewChild('tabset') tabset: TabsetComponent;
  orgId: any;
  tableSize: any = 10;
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
    this.userId = sessionStorage.getItem('user_id')
    let params={
      status:this.selectedTab? this.selectedTab :'Pending',
      page_number:this.page,
      data_per_page:this.tableSize,
      search_key:'',
     }
     
      this.initForm()
      this.getByStatus(params)
      // Subscribe to from_date changes and enable/disable to_date
    
  }
 initForm(){
  this.timeSheetForm = this._fb.group({
    from_date:['',Validators.required],
    to_date:['',Validators.required]
  })
 }
  
  getByStatus(params){

    this.api.getData(`${environment.live_url}/${environment.time_sheets}/?status=${params.status}`).subscribe((res:any)=>{
     if( res){
       this.allDetails = res.timesheets

    
       this.cardData = {
        approved_count:res.total_approve_count,
        request_count:res.total_pending_count,
        declined_count:res.total_declined_count,
        total_count:res.total_status_count,
      }
      
      //  this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10};
     }
    //  else{
    //    res['result']['data'].length <=0 ? this.api.showWarning('No records found') : '';
    //    if(res['result'] && res['result'].timesheet_dashboard){
    //      this.cardData = res['result'].timesheet_dashboard    
    //    }
    //   }
    })
 }

  getAllTimeSheet(params){ 
    this.api.getData(`${environment.live_url}/${environment.time_sheets}/${params}`).subscribe((res:any)=>{
      if( res){
        this.allDetails = res.timesheets

        // {
        //   "total_status_count": 3,
        //   "total_approve_count": 0,
        //   "total_pending_count": 3,
        //   "total_declined_count": 0,
        //   "approve_count": 0,
        //   "pending_count": 3,
        //   "declined_count": 0,
        //   "timesheets": [
        //       {
        //           "id": 3,
        //           "client": 1,
        //           "project": 6,
        //           "description": "",
        //           "employee_first_name": "anandhi",
        //           "employee_last_name": "c",
        //           "manager_first_name": "Nithesh",
        //           "manager_last_name": "Hegde",
        //           "reporting_manager": 2,
        //           "created_by": 235,
        //           "status": "Pending",
        //           "timesheet_date": "2024-09-19",
        //           "created_datetime": "2024-10-22T06:16:39.474207Z",
        //           "updated_datetime": "2024-10-22T06:16:39.474261Z",
        //           "task_list": [
        //               {
        //                   "task_id": 14,
        //                   "task_name": "create project",
        //                   "hours_left": "2 hr",
        //                   "hours_to_complete": "4 hr"
        //               }
        //           ]
        //       },
        this.cardData = {
          approved_count:res.total_approve_count,
          request_count:res.total_pending_count,
          declined_count:res.total_declined_count,
          total_count:res.total_status_count,
        }

       // this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10};
        // this.timeSheetForm.patchValue({
        //   from_date:this.datepipe.transform(this.cardData.from_date,'dd-MM-yyyy'),
        //   to_date:this.datepipe.transform(this.cardData.to_date,'dd-MM-yyyy')
        // });
        
      }
      // else{
      //   res['result']['data'].length <= 0 ? this.api.showWarning('No records found') :''
      //   if(res['result'] && res['result'].timesheet_dashboard){
      //     this.cardData = res['result'].timesheet_dashboard    
      //   }
      //  }
      
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
      this.tableSize = event.tableSize
      if(this.changes){
        c_params={
        
          status:this.selectedTab? this.selectedTab :'Pending',
          //page_number:event.page,
          // data_per_page:event.tableSize,
          // search_key:event.search_key,
          timesheets_to_date:this.datepipe.transform(this.toDate,'yyyy-MM-dd'),
          timesheets_from_date:this.datepipe.transform(this.fromDate,'yyyy-MM-dd') 
         }
         this.getAllTimeSheet(c_params);
      }
    else{
      c_params={
        status:this.selectedTab? this.selectedTab :'Pending',
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
      let c_params={}
      if(this.changes){
        c_params={
          status:this.selectedTab? this.selectedTab :'Pending',
          // user_id:this.userId,
          // page_number:this.page,
          // data_per_page:this.tableSize,
          search_key:this.term,
          timesheets_to_date:this.datepipe.transform(this.toDate,'yyyy-MM-dd'),
          timesheets_from_date:this.datepipe.transform(this.fromDate,'yyyy-MM-dd') 
         }
      }
    else{
      c_params={
        status:this.selectedTab? this.selectedTab :'Pending',
        page_number:this.page,
        data_per_page:this.tableSize,
        search_key:this.term,
       }
       
    }
    this.allDetails = []
    this.getByStatus(c_params)
    }
    
  }
  async submit() {
    let c_params = {};
    this.month = this.timeSheetForm.value.to_date;
   
    // Check if form is valid before proceeding
    if (this.timeSheetForm.invalid) {
      this.timeSheetForm.markAllAsTouched(); // Show validation only if form is invalid
      return; // Exit the function early if invalid
    }else{
      // If changes exist and form is valid
      if (this.changes) {
        c_params = {
          status: this.selectedTab ? this.selectedTab : 'Pending',
          // page_number: this.page,
          // data_per_page: this.tableSize,
          // search_key: '',
          timesheets_to_date: this.datepipe.transform(this.toDate, 'yyyy-MM-dd'),
          timesheets_from_date: this.datepipe.transform(this.fromDate, 'yyyy-MM-dd')
        };

        this.allDetails = [];
        this.getAllTimeSheet(`?from_date=${c_params['timesheets_from_date']}&to_date=${c_params['timesheets_to_date']}`);  // Fetch the data
        // this.timeSheetForm.patchValue({
        //   from_date:[''],
        //   to_date:['']
        // })
       
      }
    }
  
   
  }
  
    tabState(data){
      console.log(data,"DATA")
      if(data.tab.textLabel == 'Approved'){
        this.selectedTab = 'Approved'
      }
      else if(data.tab.textLabel == 'Pending' ){
        this.selectedTab = 'Pending' 
      }
      else if(data.tab.textLabel == 'Declined'){
        this.selectedTab = 'Declined'
      }
     
      else{
        this.selectedTab = 'Pending' 
      }
      let c_params = {}
    if(this.changes){
      c_params={
        
        status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
        // // page_number:this.page,
        // // data_per_page:this.tableSize,
        // // search_key:'',
        // timesheets_to_date:this.datepipe.transform(this.toDate,'dd-MM-yyyy') ,
        // timesheets_from_date:this.datepipe.transform(this.fromDate,'dd-MM-yyyy') 
       }
       this.fromDate = ''
       this.toDate = ''
       this.timeSheetForm = this._fb.group({
        from_date:null,
        to_date:null
      })
        this.getAllTimeSheet(`?status=${this.selectedTab}`)
      
    }
    else{
      c_params={
       
        status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
       
        // page_number:this.page,
        // data_per_page:this.tableSize,
        // search_key:'',
      }
      this.getByStatus(c_params)
    }
   
    }
    refershPage(){
      let params={
       
        status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED', 
        // page_number:this.page,
        // data_per_page:this.tableSize,
        // search_key:'',
       }
       
        this.getByStatus(params)
    }

}
