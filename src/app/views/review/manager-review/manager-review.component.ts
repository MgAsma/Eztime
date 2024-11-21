import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { TimesheetService } from 'src/app/service/timesheet.service';
import { environment } from 'src/environments/environment';
import { DatePipe, Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { error } from 'console';

@Component({
  selector: 'app-manager-review',
  templateUrl: './manager-review.component.html',
  styleUrls: ['./manager-review.component.scss']
})
export class ManagerReviewComponent implements OnInit {
  BreadCrumbsTitle: any = 'Approvals';
  panelOpenState = true;
  user_id: any;
  user_role_id: number;
  empInfoList: any = [];
  empLeaveList: any = [];
  matchingEmpInfo: any;
  manger_info: any = [];
  emptimesheet: any = [];
  timesheetAccess: any;
  leaveAccess: any;
  orgId: any;
  selectedSection = 'lists';
  tableSize = 10;
  tableSizes = [10,25,50,100];
  employeeList = [
    { name: 'Surya', id: 149, role: 'Designer', email: 'Surya@ekfrazon.in', contact: '62695723681' },
    { name: 'Manoj', id: 150, role: 'Tester', email: 'Manoj@ekfrazon.in', contact: '98792036781' }
  ];

  leaveList:any = []

  timesheetList:any = []

  selectedTimesheetTabId: number;
  selectedTimesheetTab: string;
  page = 1;
  count:any= 0;
  selectedLeaveTab: string;
  selectedLeaveTabId: number;
  
  
  constructor(
    private api: ApiserviceService,
    private modalService: NgbModal,
    private _timesheet: TimesheetService,
    private location: Location,
    private common_service: CommonServiceService,
    private datepipe:DatePipe
  ) { }
  data = []

  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();
  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('organization_id')
    this.user_id = sessionStorage.getItem('user_id')
    
    this.getEmployeeData(`page=${this.page}&page_size=${this.tableSize}`)
  }
 
  getEmployeeData(params) {
    this.api.getData(`${environment.live_url}/${environment.all_employee}/?organization_id=${this.orgId}&${params}`).subscribe(response => {
      if (response) {
        this.empInfoList = response?.['results'];
        const noOfPages:number = response?.['total_pages']
        this.count  = noOfPages * this.tableSize;
        this.page=response?.['current_page'];
      }
    }, (error => {
      this.api.showError(error?.error?.message)
    }))
  }
  selectedTab(event){
    if(event){
      this.selectedSection = event
    }
    if(event === 'lists'){
      this.count = 0;
      this.page = 1
      this.getEmployeeData(`page=${this.page}&page_size=${this.tableSize}`)
    }else if(event === 'leaves'){
      this.count = 0;
      this.page = 1
      this.getAllLeaves(`?status=1&organization=${this.orgId}&page=${this.page}&page_size=${this.tableSize}`)
    }else if(event === 'timesheets'){
      this.count = 0;
      this.page = 1
      this.getAllTimesheets(`?organization=${this.orgId}&status=1&page=${this.page}&page_size=${this.tableSize}`)
    }
    
  }
  getAllTimesheets(params){
    this.api.getData(`${environment.live_url}/${environment.time_sheets}/${params}`).subscribe(response => {
      if (response) {
        this.timesheetList = response?.['results']
        const noOfPages:number = response?.['total_pages']
        this.count  = noOfPages * this.tableSize;
        this.page= response?.['current_page'];
       
    }
  },(error)=>{
    this.api.showError(error?.error?.message)
  })
  }
  getAllLeaves(params){
    this.api.getData(`${environment.live_url}/${environment.employee_leave_details}/${params}`).subscribe((res:any)=>{
      if(res){
        this.leaveList = res?.['results']
        const noOfPages:number = res?.['total_pages']
        this.count  = noOfPages * this.tableSize;
        this.page=res?.['current_page'];
      }
    },(error)=>{
      this.api.showError(error?.error?.message)
    })
  }
  tabTimesheet(data){
    if(data.tab.textLabel === 'Approved'){
      this.selectedTimesheetTab = 'Approved'
      this.selectedTimesheetTabId = 2
    }
    else if(data.tab.textLabel === 'Pending' ){
      this.selectedTimesheetTab = 'Pending' 
      this.selectedTimesheetTabId = 1
    }
    else if(data.tab.textLabel === 'Declined'){
      this.selectedTimesheetTab = 'Declined'
      this.selectedTimesheetTabId = 3
    }
    let query:string = `?organization=${this.orgId}&status=${this.selectedTimesheetTabId}&page=${1}&page_size=${this.tableSize}`;
   
    this.getAllTimesheets(query)

 
  
  }
  tabLeaveSection(data){
    if(data.tab.textLabel === 'Approved'){
      this.selectedLeaveTab = 'Approved'
      this.selectedTimesheetTabId = 2
    }
    else if(data.tab.textLabel === 'Pending' ){
      this.selectedLeaveTab = 'Pending' 
      this.selectedLeaveTabId = 1
    }
    else if(data.tab.textLabel === 'Declined'){
      this.selectedLeaveTab = 'Declined'
      this.selectedLeaveTabId = 3
    }
    let query:string = `?organization=${this.orgId}&status=${this.selectedTimesheetTabId}&page=${1}&page_size=${this.tableSize}`;
   
    this.getAllLeaves(query)

 
  
  }
  openDialogue(content, status) {
    if (content) {
      const modelRef = this.modalService.open(GenericDeleteComponent, {
        size: <any>'sm'
        ,
        backdrop: true,
        centered: true
      });
      modelRef.componentInstance.title = `Are you sure you want to ${status}`;
      modelRef.componentInstance.message = `${status}`;
      modelRef.componentInstance.status.subscribe(resp => {
        if (resp == "ok") {
          this.updateTimesheetStatus(content, status)
          modelRef.close();
        }
        else {
          modelRef.close();
        }
      })

    }

  }
  onTableDataChange(event:any){
    this.page = event;
    const leaveStatusId = this.selectedLeaveTabId || 1
    const timesheetTabId = this.selectedTimesheetTabId
    if(this.selectedSection === 'lists'){
      this.count = 0;
      this.getEmployeeData(`page=${this.page}&page_size=${this.tableSize}`)
    }else if(this.selectedSection === 'leaves'){
      this.count = 0;
      this.getAllLeaves(`?status=${leaveStatusId}&organization=${this.orgId}&page=${this.page}&page_size=${this.tableSize}`)
    }else if(this.selectedSection === 'timesheets'){
      this.count = 0;
      this.getAllTimesheets(`?organization=${this.orgId}&status=${timesheetTabId}&page=${this.page}&page_size=${this.tableSize}`)
    }
  }  
  onTableSizeChange(event:any): void {
    if(event){
     
    this.tableSize = Number(event.value);
   
    const leaveStatusId = this.selectedLeaveTabId || 1
    const timesheetTabId = this.selectedTimesheetTabId
    if(this.selectedSection === 'lists'){
      this.count = 0;
      this.getEmployeeData(`page=${1}&page_size=${this.tableSize}`)
    }else if(this.selectedSection === 'leaves'){
      this.count = 0;
      this.getAllLeaves(`?status=${leaveStatusId}&organization=${this.orgId}&page=${1}&page_size=${this.tableSize}`)
    }else if(this.selectedSection === 'timesheets'){
      this.count = 0;
      this.getAllTimesheets(`?organization=${this.orgId}&status=${timesheetTabId}&page=${1}&page_size=${this.tableSize}`)
    }
    }
  } 
  open(content, status) {
    if (content) {
      const modelRef = this.modalService.open(GenericDeleteComponent, {
        size: <any>'sm'
        ,
        backdrop: true,
        centered: true
      });
      modelRef.componentInstance.title = `Are you sure you want to ${status}`;
      modelRef.componentInstance.message = `${status}`;
      modelRef.componentInstance.status.subscribe(resp => {
        if (resp == "ok") {
          this.updateStatus(content, status)
          modelRef.close();
        }
        else {
          modelRef.close();
        }
      })

    }
  }
  updateTimesheetStatus(content, status) {
    const confirmText = status === 'Approve' ? 'approved' : 'declined'
    let date = new Date()
    let formattedDate = this.datepipe.transform(date,'yyyy-MM-dd')
    let data =   {
      id: content.id,
      status: status === 'Approve' ? 2 : 3,
      organization: this.orgId,
      employee: content.created_by,
      approved_by: status === 'Approve' ? this.user_id :null,
      approved_on: status === 'Approve' ? formattedDate :null,
      rejected_by: status === 'Decline' ? this.user_id :null,
      rejected_on: status === 'Decline' ? formattedDate :null 
  }
    this.api.postData(`${environment.live_url}/${environment.update_timesheet_status}/`,data).subscribe(res => {
      if (res) {
        this.api.showSuccess(`Timesheet ${confirmText} successfully`)
        this.getAllTimesheets(`?organization=${this.orgId}&status=1`)
      }
    }, (error => {
      this.api.showError(error?.error?.message)
    }))
  }
  updateStatus(content, status) {
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    let date = new Date()
    let formattedDate = this.datepipe.transform(date,'yyyy-MM-dd')
    const confirmText = status === 'Approve' ? 'approved' : 'declined'
    let data = {
      id: content.id,
      status: status === 'Approve' ? 2 : 3,
      organization: this.orgId,
      employee: content.employee,
      leave_type:content.leave_type,
      approved_by: status === 'Approve' ? this.user_id :null,
      approved_on: status === 'Approve' ? formattedDate :null,
      rejected_by: status === 'Decline' ? this.user_id :null,
      rejected_on: status === 'Decline' ? formattedDate :null
  }
  
    this.api.updateData(`${environment.live_url}/${environment.update_leave_details}/`,data).subscribe(res => {

      if (res) {
        this.api.showSuccess(`Leave ${confirmText} successfully`)
        this.getAllLeaves(`?status=1&organization=${this.orgId}`)
      }

    }, ((error: any) => {
      this.api.showError(error?.error?.message)
    }))
  }
}
