import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TimesheetService } from 'src/app/service/timesheet.service';
import { DatePipe, Location } from '@angular/common';
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
  selectedTab: string = 'Pending';
  changes: boolean = false;
  totalCount: any;
  currDate: any;
  user_id: string;
  orgId: any;
  table_size: any = 10;
  showSearch:boolean = false;
  term:string;
  page:any = 1;
  selectedTabId: number;
  constructor(
    private timesheetService: TimesheetService,
    private location: Location,
    private common_service: CommonServiceService,
    private cdr: ChangeDetectorRef,
    private api: ApiserviceService,
    private datepipe:DatePipe
  ) { }
  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    let date = new Date();
    this.currDate = this.datepipe.transform(date,'yyyy-MM-dd')
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    this.orgId = sessionStorage.getItem('organization_id')
   
   
    this.getTodaysApprovals(`?status=1&organization=${this.orgId}&created-date=${this.currDate}`)
  }
  getTodaysApprovals(params) {
    this.allDetails = [];
   // this.timesheetService.getTodaysApprovalTimesheet(params).subscribe(res => {
      this.api.getData(`${environment.live_url}/${environment.timesheets}/${params}`).subscribe((res:any) =>{
      if (res) {
        this.allDetails = res;
       // this.totalCount = { pageCount: res['result']['pagination'].number_of_pages, currentPage: res['result']['pagination'].current_page, itemsPerPage: this.table_size };
      }
    })
  }
  buttonClick(event) {
    const selectedTab = this.selectedTabId || 1
    this.getTodaysApprovals(`?status=${selectedTab}&organization=${this.orgId}&created-date=${this.currDate}`);
   
  }

  searchFiter(event) {
    if (event) {
      // this.table_size = event.tableSize;
      let data = {
        status: this.selectedTab ? this.selectedTab : 'Pending',
      }
      this.getTodaysApprovals(data);
    }

  }
  tabState(data) {
    if(data.tab.textLabel == 'Approved'){
      this.selectedTab = 'Approved'
      this.selectedTabId = 2
    }
    else if(data.tab.textLabel == 'Pending' ){
      this.selectedTab = 'Pending'
      this.selectedTabId = 1
    }
    else if(data.tab.textLabel == 'Declined'){
      this.selectedTab = 'Declined'
      this.selectedTabId = 3
    }
    this.getTodaysApprovals(`?status=${this.selectedTabId}&organization=${this.orgId}&created-date=${this.currDate}`);
  }
  refershPage() {
    
    this.getTodaysApprovals(`?status=1&organization=${this.orgId}&created-date=${this.currDate}`);
  }
}
