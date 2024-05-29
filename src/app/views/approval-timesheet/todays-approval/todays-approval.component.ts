import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TimesheetService } from 'src/app/service/timesheet.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-todays-approval',
  templateUrl: './todays-approval.component.html',
  styleUrls: ['./todays-approval.component.scss']
})
export class TodaysApprovalComponent implements OnInit {
  BreadCrumbsTitle:any='Todays approval';
  allDetails:any = [];
  selectedTab: string;
  changes:boolean = false;
  totalCount: any;
  currDate:any;
  user_id: string;
  orgId: any;

  constructor(
    private timesheetService:TimesheetService,
    private location:Location,
    private common_service:CommonServiceService,
    private cdr: ChangeDetectorRef
    ) { }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    let date = new Date();
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    this.orgId = sessionStorage.getItem('org_id')
    this.currDate =  date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-'  +('0' +(date.getDate())).slice(-2) 
     //console.log( this.currDate," this.currDate")
  
    let data ={
      user_id:this.user_id,
      page_number:1,
      data_per_page:10,
      status:'YET_TO_APPROVED',
      organization_id:this.orgId,
      search_key:'',
    }
   this.getApprovals(data)
  }
  getApprovals(params){ 
    this.timesheetService.getTodaysApprovalTimesheet(params).subscribe(res=>{
      this.allDetails = res['result'].data;
      this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page,itemsPerPage:10};
    })
  }
  buttonClick(event){
    if(event){
      this.cdr.detectChanges();
      let data ={
        user_id:this.user_id,
        page_number:event.page,
        data_per_page:event.tableSize,
        status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
        organization_id:this.orgId,
        search_key:event.search_key,
      }
      this.getApprovals(data);
    }
  }

  searchFiter(event){
    if(event){
      this.cdr.detectChanges();
      let data ={
        user_id:this.user_id,
        page_number:event.page,
        data_per_page:event.tableSize,
        status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
        organization_id:this.orgId,
        search_key:event.search_key,
      }
      this.getApprovals(data);
    }
    
  }
  tabState(data){
    if(data.heading == 'Approved timesheet'){
      this.selectedTab = 'APPROVED'
    }
    else if(data.heading == 'Yet to be approved' ){
      this.selectedTab = 'YET_TO_APPROVED' 
    }
    else if(data.heading == 'Declined timesheet'){
      this.selectedTab = 'DECLINED'
    }
    else if(data.heading == 'Time sheets'){
      this.selectedTab = 'TIMESHEET'
    }
    else{
      this.selectedTab = 'YET_TO_APPROVED' 
    }
    
    let params ={
      user_id:this.user_id,
      page_number:1,
      data_per_page:10,
      status:this.selectedTab? this.selectedTab :'YET_TO_APPROVED',
      organization_id:this.orgId,
      search_key:'',
    }
    this.getApprovals(params);
  }

}
