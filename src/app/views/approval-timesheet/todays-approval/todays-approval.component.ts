import { Component, OnInit } from '@angular/core';
import { TimesheetService } from 'src/app/service/timesheet.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-todays-approval',
  templateUrl: './todays-approval.component.html',
  styleUrls: ['./todays-approval.component.scss']
})
export class TodaysApprovalComponent implements OnInit {
  allDetails:any = [];
  selectedTab: string;
  changes:boolean = false;
  totalCount: any;
  currDate:any;
  user_id: string;
  orgId: any;

  constructor(
    private timesheetService:TimesheetService,
    private location:Location
    ) { }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  ngOnInit(): void {
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
      organization_id:this.orgId
    }
   this.getApprovals(data)
  }
  getApprovals(params){ 
    this.timesheetService.getTodaysApprovalTimesheet(params).subscribe(res=>{
      this.allDetails = res['result'].data
      this.totalCount = res['result']['pagination'].number_of_pages
      //console.log(res,"RESAPPROVALS")
    })
  }
  buttonClick(event){
    if(event){
      let data ={
        user_id:this.user_id,
        page_number:event,
        data_per_page:10,
        status:'YET_TO_APPROVED',
        organization_id:this.orgId
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
      organization_id:this.orgId
    }
    this.getApprovals(params);
  }

}
