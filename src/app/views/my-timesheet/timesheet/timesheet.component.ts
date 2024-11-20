import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { TimesheetService } from 'src/app/service/timesheet.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { error } from 'console';

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
  
  changes: boolean;
 
  selectedTab:string = 'Pending';
  userId:any;
  count: number;
  cardData: any = {};

  totalCount: any;
  term:string;
  showSearch=false;
  @ViewChild('tabset') tabset: TabsetComponent;
  orgId: any;
  // tableSize: any = 10;
  selectedTabId: number;
  submitted: boolean = false;
  page_size:number = 5;
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
  this.selectedTab = 'Pending'
  }
  get f(){
    return this.timeSheetForm.controls;
  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('organization_id')
    this.userId = sessionStorage.getItem('user_id')
      this.initForm()
      
      this.getByStatus(`?organization=${this.orgId}&status=${1}&user=${this.userId}&page=${1}&page_size=${5}`)
      this.getStatusCount(`?user=${this.userId}&get-count=true&organization=${this.orgId}`)
  }
 initForm(){
  this.timeSheetForm = this._fb.group({
    from_date:['',Validators.required],
    to_date:['',Validators.required]
  })
 }
  
  getByStatus(params){

    this.api.getData(`${environment.live_url}/${environment.time_sheets}/${params}`).subscribe((res:any)=>{
     if(res){
       this.allDetails = res?.['results']
      this.totalCount = { pageCount: res?.total_pages, currentPage: res?.current_page,itemsPerPage:10};
     }
    
    },(error)=>{
      this.api.showError(error?.error?.message)
    })
 }
reset(){
  this.timeSheetForm.reset()
  const selectedTab = this.selectedTabId || 1
  this.getByStatus(`?organization=${this.orgId}&status=${selectedTab}&user=${this.userId}`)
}
  getStatusCount(params){ 
    this.api.getData(`${environment.live_url}/${environment.time_sheets}/${params}`).subscribe((res:any)=>{
      if( res){
        
        this.cardData = {
          approved_count:res.Approved,
          request_count:res.Pending,
          declined_count:res.Declined,
          total_count:res.total,
        }
      } 
    },(error)=>{
      this.api.showError(error?.error?.message)
    })

  }
  changeFormat(){
    // this.fromDate = this.timeSheetForm.value.from_date
    // this.toDate   = this.timeSheetForm.value.to_date
    this.changes  = true;
    //this.month    = this.timeSheetForm.value.to_date
    this.timeSheetForm.patchValue({
      to_date:''
    })
   }
   dateModified(){
    this.timeSheetForm.patchValue({
      to_date:''
    })
   }
   buttonClick(event){
    if(event){
      this.cdref.detectChanges();
     // let c_params={}
      //this.tableSize = event.tableSize
    //   if(this.changes){
    //     c_params={
        
    //       status:this.selectedTab? this.selectedTab :'Pending',
    //       timesheets_to_date:this.datepipe.transform(this.toDate,'yyyy-MM-dd'),
    //       timesheets_from_date:this.datepipe.transform(this.fromDate,'yyyy-MM-dd') 
    //      }
    //      this.getAllTimeSheet(c_params);
    //   }
    // else{
    //   c_params={
    //     status:this.selectedTab? this.selectedTab :'Pending',
    //     page_number:event.page,
    //     data_per_page:event.tableSize,
    //     search_key:event.search_key,
    //    }
    //    this.getByStatus(c_params)
    // }
    const selectedTab = this.selectedTabId || 1
    this.getByStatus(`?organization=${this.orgId}&status=${selectedTab}&user=${this.userId}&page=${event.page}&page_size=${event.page_size}`)
    this.getStatusCount(`?user=${this.userId}&get-count=true`)
    }
  }
  searchFiter(event){
    // if(event){
    //   this.cdref.detectChanges();
    //   let c_params={}
    //   if(this.changes){
    //     c_params={
    //       status:this.selectedTab? this.selectedTab :'Pending',
    //       // user_id:this.userId,
    //       // page_number:this.page,
    //       // data_per_page:this.tableSize,
    //       search_key:this.term,
    //       timesheets_to_date:this.datepipe.transform(this.toDate,'yyyy-MM-dd'),
    //       timesheets_from_date:this.datepipe.transform(this.fromDate,'yyyy-MM-dd') 
    //      }
    //   }
    // else{
    //   c_params={
    //     status:this.selectedTab? this.selectedTab :'Pending',
    //     page_number:this.page,
    //     data_per_page:this.tableSize,
    //     search_key:this.term,
    //    }
       
    // }
    // this.allDetails = []
    // this.getByStatus(c_params)
    // }
    
  }
  
  async submit() {
    let c_params = {};
    
    // Check if form is valid before proceeding
    if (this.timeSheetForm.invalid) {
      this.timeSheetForm.markAllAsTouched(); // Show validation only if form is invalid
      return; // Exit the function early if invalid
    }else{
      // If changes exist and form is valid
      
        c_params = {
          status: this.selectedTab ? this.selectedTab : 'Pending',
          timesheets_to_date: this.datepipe.transform(this.timeSheetForm.value.to_date, 'yyyy-MM-dd'),
          timesheets_from_date: this.datepipe.transform(this.timeSheetForm.value.from_date, 'yyyy-MM-dd')
        };

        this.allDetails = [];
        let query:string;
        if(this.selectedTabId){
         query = `?from-date=${c_params['timesheets_from_date']}&to-date=${c_params['timesheets_to_date']}&status=${this.selectedTabId}&organization=${this.orgId}&user=${this.userId}&page=${this.page}&page_size=${this.page_size}`
        }else{
          query = `?from-date=${c_params['timesheets_from_date']}&to-date=${c_params['timesheets_to_date']}&status=${1}&organization=${this.orgId}&user=${this.userId}&page=${this.page}&page_size=${this.page_size}`
        }
        this.getByStatus(query);  
        this.submitted = true
      
    }
  
   
  }
  
    tabState(data){
      if(data.tab.textLabel === 'Approved'){
        this.selectedTab = 'Approved'
        this.selectedTabId = 2
      }
      else if(data.tab.textLabel === 'Pending' ){
        this.selectedTab = 'Pending'
        this.selectedTabId = 1
      }
      else if(data.tab.textLabel === 'Declined'){
        this.selectedTab = 'Declined'
        this.selectedTabId = 3
      }
     let query = `?organization=${this.orgId}&status=${this.selectedTabId}&user=${this.userId}`
     if(this.submitted && this.timeSheetForm.valid){
      const to_date = this.datepipe.transform(this.timeSheetForm.value.to_date, 'yyyy-MM-dd')
      const from_date =  this.datepipe.transform(this.timeSheetForm.value.from_date, 'yyyy-MM-dd')
      query=`?organization=${this.orgId}&status=${this.selectedTabId}&user=${this.userId}&from-date=${from_date}&to-date=${to_date}&page=${this.page}&page_size=${this.page_size}`
     }else{
      query=`?organization=${this.orgId}&status=${this.selectedTabId}&user=${this.userId}&page=${this.page}&page_size=${this.page_size}`
     }
      this.getByStatus(query)
    
   
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
