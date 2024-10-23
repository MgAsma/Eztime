import { DatePipe } from '@angular/common';
import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-applied-approved-leaves',
  templateUrl: './applied-approved-leaves.component.html',
  styleUrls: ['./applied-approved-leaves.component.scss']
})
export class AppliedApprovedLeavesComponent implements OnInit {
  @ViewChild('tabset') tabset: TabsetComponent;
  appliedLeaveForm:FormGroup;
  BreadCrumbsTitle:any='Leave Status';
 
  selectedTab: any = 'Pending';
  currDate:any;
  AllListData:any = []
  fromDate: any ;
  toDate: any ;
  changes: boolean = false;
  month: any;
  params: {};
 
  tableSize: any;
  yetToApprove: any = [];
  approved: any = [];
  declined: any = {};
  totalCount: any;
  user_id =sessionStorage.getItem('user_id')
  permission: any;
  orgId: any;
  term:any;
  showSearch = false
  allCardData: Object;
  selectedTabId: number;
  constructor(
    private api:ApiserviceService,
    private datepipe:DatePipe,
    private _fb:FormBuilder,
    private location:Location,
    private common_service:CommonServiceService,
    private cdref: ChangeDetectorRef,
    ) {}
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initForm(){
  this.appliedLeaveForm = this._fb.group({
    from_date:['',Validators.required],
    to_date:['' ,Validators.required]
  })
  }
  ngOnInit(): void { 
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('org_id')
    this.initForm();
    this.getAppliedLeaves('')
    // let params= {
    //   module:"LEAVE/HOLIDAY_LIST",
    //   menu:"APPLIED/APPROVIED_LEAVES",
    //   method:"VIEW",
    //   page_number:1,
    //   data_per_page:10,
    //   user_id:this.user_id,
    //   pagination:"TRUE",
    //   search_key:'',
    //   approved_state:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
    // }
    // this.getByStatus(params)
    this.getCount()
  }
  getCount(){
    this.api.getData(`${environment.live_url}/${environment.employee_leave_details}/?get-count=true&employee-id=${this.user_id}`).subscribe(res=>{
      if(res){ 
      
      this.allCardData = res
      //this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10}; 
    }
  },(error:any)=>{
    this.api.showError(error?.error?.message)
  })
  
  }
  searchFiter(event){
    if(event){
      this.cdref.detectChanges();
      if(this.changes){
        let params= {
          module:"LEAVE/HOLIDAY_LIST",
          menu:"APPLIED/APPROVIED_LEAVES",
          method:"VIEW",
          page_number:event.page,
          data_per_page:event.tableSize,
          search_key:event.search_key,
          user_id:this.user_id,
          pagination:"TRUE",
          approved_state:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
          leaveApplication_from_date:this.fromDate,
          leaveApplication_to_date:this.toDate
        }
       this.getAppliedLeaves(params);
      }
      else{
        let params= {
          module:"LEAVE/HOLIDAY_LIST",
          menu:"APPLIED/APPROVIED_LEAVES",
          method:"VIEW",
          page_number:event.page,
          data_per_page:event.tableSize,
          search_key:event.search_key,
          user_id:this.user_id,
          pagination:"TRUE",
          approved_state:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
        }
        this.getByStatus()
      }  
    }
    
  }
  refershPage(){}
  buttonClick(event){
    if(event){
      this.cdref.detectChanges();
      if(this.changes){
        let params= {
          module:"LEAVE/HOLIDAY_LIST",
          menu:"APPLIED/APPROVIED_LEAVES",
          method:"VIEW",
          page_number:event.page,
          data_per_page:event.tableSize,
          search_key:event.search_key,
          user_id:this.user_id,
          pagination:"TRUE",
          approved_state:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
          leaveApplication_from_date:this.fromDate,
          leaveApplication_to_date:this.toDate
        }
       this.getAppliedLeaves(params);
      }
      else{
        let params= {
          module:"LEAVE/HOLIDAY_LIST",
          menu:"APPLIED/APPROVIED_LEAVES",
          method:"VIEW",
          page_number:event.page,
          data_per_page:event.tableSize,
          search_key:event.search_key,
          user_id:this.user_id,
          pagination:"TRUE",
          approved_state:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
        }
        this.getByStatus()
      }  
    }
  }
  get f(){
  return  this.appliedLeaveForm.controls 
  }
  getByStatus(){
    this.api.getData(`${environment.live_url}/${environment.employee_leave_details}/?status-id=${this.selectedTabId}&employee-id=${this.user_id}`).subscribe(res=>{
      if(res){ 
        this.AllListData = res
       // this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10};
    }
  },(error:any)=>{
    this.api.showError(error?.error?.message)
  })
  }
  getAppliedLeaves(paginate){
    this.api.getData(`${environment.live_url}/${environment.employee_leave_details}/?status-id=1&employee-id=${this.user_id}`).subscribe(res=>{
        if(res){ 
        this.AllListData = res
        //this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10}; 
      }
    },(error:any)=>{
      this.api.showError(error?.error?.message)
    })
    
  }

   changeFormat(){
    //console.log(this.appliedLeaveForm.value.from_date,"CHANGE")
    this.fromDate = this.datepipe.transform(this.appliedLeaveForm.value.from_date,'dd/MM/yyyy')
    this.toDate   = this.datepipe.transform(this.appliedLeaveForm.value.to_date,'dd/MM/yyyy')
    this.changes  = true;
    if(this.appliedLeaveForm.value.to_date){
      this.month    = this.appliedLeaveForm.value.to_date
    }
    
   }
    submit(){
      if(this.changes){
         let params= {
          module:"LEAVE/HOLIDAY_LIST",
          menu:"APPLIED/APPROVIED_LEAVES",
          method:"VIEW",
          page_number:1,
          data_per_page:10,
          user_id:this.user_id,
          search_key:'',
          pagination:"TRUE",
          approved_state:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
          leaveApplication_from_date:this.fromDate,
          leaveApplication_to_date:this.toDate
        }
        if(this.appliedLeaveForm.invalid){
          this.appliedLeaveForm.markAllAsTouched()
        }
        else{
          this.getAppliedLeaves(params)
          this.tabset.tabs[0].active = true;
        }
      }
      else{
        if(this.appliedLeaveForm.invalid){
          this.appliedLeaveForm.markAllAsTouched()
        }
      }
    // else{
      
    //   let params= {
    //     module:"LEAVE/HOLIDAY_LIST",
    //     menu:"APPLIED/APPROVIED_LEAVES",
    //     method:"VIEW",
    //     page_number:1,
    //     data_per_page:10,
    //     user_id:this.user_id,
    //     pagination:"TRUE",
    //     approved_state:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
    //   }
    //   this.getByStatus(params)
    // }
    
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
      
      this.getByStatus()
 
   
    
    }
    
}
