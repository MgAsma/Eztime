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
  BreadCrumbsTitle:any='Applied approved leaves';
  AllCardData: any = [];
  selectedTab: any = '';
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
  constructor(
    private api:ApiserviceService,
    private datepipe:DatePipe,
    private _fb:FormBuilder,
    private location:Location,
    private common_service:CommonServiceService
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
    let params= {
      module:"LEAVE/HOLIDAY_LIST",
      menu:"APPLIED/APPROVIED_LEAVES",
      method:"VIEW",
      page_number:1,
      data_per_page:10,
      user_id:this.user_id,
      pagination:"TRUE",
      search_key:'',
      approved_state:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
    }
    this.getByStatus(params)
  }
  searchFiter(event){
    if(event){
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
        this.getByStatus(params)
      }  
    }
    
  }
  buttonClick(event){
    if(event){
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
        this.getByStatus(params)
      }  
    }
  }
  get f(){
  return  this.appliedLeaveForm.controls 
  }
  getByStatus(paginate){
    this.api.getData(`${environment.live_url}/${environment.leave_application}?module=${paginate.module}&menu=${paginate.menu}&method=${paginate.method}&user_id=${paginate.user_id}&search_key=${paginate.search_key}&page_number=${paginate.page_number}&data_per_page=${paginate.data_per_page}&pagination=${paginate.pagination}&organization_id=${this.orgId}&approved_state=${paginate.approved_state}`).subscribe(res=>{
      if(res){ 
        this.AllListData = res['result'].data
        this.AllCardData = res['result'].leave_dashboard
        this.totalCount  = res['result']['pagination'].number_of_pages
      if(this.AllListData.length <= 0){
        this.api.showWarning('No records found')
      }
      
    }
    else{
      this.AllListData.length < 0 ? this.api.showWarning('No records found'):''
    }
    
  },(error:any)=>{
    this.api.showError(error.error.error.message)
  })
  }
  getAppliedLeaves(paginate){
    this.api.getData(`${environment.live_url}/${environment.leave_application}?module=${paginate.module}&menu=${paginate.menu}&method=${paginate.method}&user_id=${paginate.user_id}&search_key=${paginate.search_key}&page_number=${paginate.page_number}&data_per_page=${paginate.data_per_page}&pagination=${paginate.pagination}&organization_id=${this.orgId}&approved_state=${paginate.approved_state}&leaveApplication_from_date=${paginate.leaveApplication_from_date}&leaveApplication_to_date=${paginate.leaveApplication_to_date}`).subscribe(res=>{
        if(res){ 
        this.AllCardData = res['result'].leave_dashboard
        this.AllListData = res['result'].data
        this.totalCount  = res['result']['pagination'].number_of_pages
      
        
      
        if(this.AllListData.length <= 0){
          this.api.showWarning('No records found')
        }
      
         this.month = res['result'].data[0].your_applied_leave_to_date;
    }

    },(error:any)=>{
      this.api.showError(error.error.error.message)
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
      //console.log(data,"WERTYFDS")
      if(data.heading == 'Approved leaves'){
        this.selectedTab = 'APPROVED'
      }
      else if(data.heading == 'Yet to be approved' ){
        this.selectedTab = 'YET_TO_APPROVED' 
      }
      else if(data.heading == 'Declined leaves'){
        this.selectedTab = 'DECLINED'
      }
      else{
        this.selectedTab = 'YET_TO_APPROVED' 
      }
      if(this.changes){
        
         let params= {
          module:"LEAVE/HOLIDAY_LIST",
          menu:"APPLIED/APPROVIED_LEAVES",
          method:"VIEW",
          page_number:1,
          data_per_page:10,
          search_key:'',
          user_id:this.user_id,
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
        }
      }
    else{
       let params= {
        module:"LEAVE/HOLIDAY_LIST",
        menu:"APPLIED/APPROVIED_LEAVES",
        method:"VIEW",
        page_number:1,
        data_per_page:10,
        search_key:'',
        user_id:this.user_id,
        pagination:"TRUE",
        approved_state:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
      }
      this.getByStatus(params)
    }
    
    }
    
}
