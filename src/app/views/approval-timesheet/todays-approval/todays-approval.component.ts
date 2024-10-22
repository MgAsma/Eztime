import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TimesheetService } from 'src/app/service/timesheet.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-todays-approval',
  templateUrl: './todays-approval.component.html',
  styleUrls: ['./todays-approval.component.scss']
})
export class TodaysApprovalComponent implements OnInit {
  BreadCrumbsTitle: any = 'Todays approval';
  allDetails: any = [];
  selectedTab: string;
  changes: boolean = false;
  totalCount: any;
  currDate: any;
  user_id: string;
  orgId: any;
  table_size: any = 10;
  showSearch:boolean = false;
  term:string;
  page:any = 1;
  constructor(
    private timesheetService: TimesheetService,
    private location: Location,
    private common_service: CommonServiceService,
    private cdr: ChangeDetectorRef,
    private api: ApiserviceService,
  ) { }
  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    let date = new Date();
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    this.orgId = sessionStorage.getItem('org_id')
    this.currDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate())).slice(-2)
    //console.log( this.currDate," this.currDate")

    let data = {
      // user_id: this.user_id,
      // page_number: 1,
      // data_per_page: this.table_size,
      status: 'Pending',
      // organization_id: this.orgId,
      // search_key: '',
    }
    this.getApprovals(data)
  }
  getApprovals(params) {
    this.allDetails = [];
   // this.timesheetService.getTodaysApprovalTimesheet(params).subscribe(res => {
      this.api.getData(`${environment.live_url}/${environment.timesheets}/?status=${params.status}&current_date=today`).subscribe((res:any) =>{
      if (res) {
        this.allDetails = res.timesheets        ;
       // this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page, itemsPerPage: this.table_size };
      } else {
        this.api.showWarning('No records found !')
      }
    })
  }
  buttonClick(event) {
    if (event) {
      this.table_size = event.tableSize;
      this.page = event.page;
      let data = {
        // user_id: this.user_id,
        // page_number: event.page,
        // data_per_page: event.tableSize,
        status: this.selectedTab ? this.selectedTab : 'Pending',
        // organization_id: this.orgId,
        //search_key: event.search_key,
      }
      this.getApprovals(data);
    }
  }

  searchFiter(event) {
    if (event) {
      // this.table_size = event.tableSize;
      let data = {
        // user_id: this.user_id,
        // page_number: this.page,
        // data_per_page: this.table_size,
        status: this.selectedTab ? this.selectedTab : 'Pending',
        // organization_id: this.orgId,
        // search_key: this.term
      }
      this.getApprovals(data);
    }

  }
  tabState(data) {
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

    let params = {
      // page_number: 1,
      // data_per_page: this.table_size,
      status: this.selectedTab ? this.selectedTab : 'Pending',
      // search_key: '',
    }
    this.getApprovals(params);
  }
  refershPage() {
    let data = {
      page_number: 1,
      data_per_page: this.table_size,
      status: this.selectedTab ? this.selectedTab : 'Pending',
      //organization_id: this.orgId,
      //search_key: '',
    }
    this.getApprovals(data);
  }
}
