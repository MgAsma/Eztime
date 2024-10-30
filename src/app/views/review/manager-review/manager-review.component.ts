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

  employeeList = [
    { name: 'Surya', id: 149, role: 'Designer', email: 'Surya@ekfrazon.in', contact: '62695723681' },
    { name: 'Manoj', id: 150, role: 'Tester', email: 'Manoj@ekfrazon.in', contact: '98792036781' }
  ];

  leaveList:any = []

  timesheetList:any = []

  selectedTimesheetTabId: number;
  selectedTimesheetTab: string;
  // = {
  //   pending: [
  //     { employeeName: 'Surya', client: 'MTN', projectName: 'eShop', time: '8 hr', duration: '01/08/2024 - 01/08/2024', tasks: 'Redesigning UI' },
  //     { employeeName: 'Manoj', client: 'MTN', projectName: 'eShop', time: '2 hr', duration: '01/08/2024 - 01/08/2024', tasks: 'Library updates' }
  //   ],
  //   approved: [
  //     { employeeName: 'Karthik', client: 'MTN', projectName: 'eShop', time: '6 hr', duration: '01/08/2024 - 01/08/2024', tasks: 'Bug fixes' }
  //   ],
  //   declined: [
  //     { employeeName: 'Ravi', client: 'MTN', projectName: 'eShop', time: '1 hr', duration: '01/08/2024 - 01/08/2024', tasks: 'Meeting' }
  //   ]
  // };
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
    this.getAllTimesheets(`?organization=${this.orgId}&status=1`)
    this.getAllLeaves(`?status-id=1&organization=${this.orgId}`)
    this.getEmployeeData() 
  }
 
  getEmployeeData() {
    this.api.getData(`${environment.live_url}/${environment.all_employee}/?organization_id=${this.orgId}`).subscribe(response => {
      if (response) {
        this.empInfoList = response;
      }
    }, (error => {
      this.api.showError(error?.error?.message)
    }))
  }

  getAllTimesheets(params){
    this.api.getData(`${environment.live_url}/${environment.time_sheets}/${params}`).subscribe(response => {
      if (response) {
        this.timesheetList = response
        console.log(this.timesheetList)
    }
  },(error)=>{
    this.api.showError(error?.error?.message)
  })
  }
  getAllLeaves(params){
    this.api.getData(`${environment.live_url}/${environment.employee_leave_details}/${params}`).subscribe((res:any)=>{
      if(res){
        this.leaveList = res
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
    let query:string = `?organization=${this.orgId}&status=${this.selectedTimesheetTabId}`;
   
    this.getAllTimesheets(query)

 
  
  }
  tabLeaveSection(data){
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
    let query:string = `?organization=${this.orgId}&status-id=${this.selectedTimesheetTabId}`;
   
    this.getAllLeaves(query)

 
  
  }
  openDialogue(content, status) {
    if (content) {
      // const statusText = status === 'DECLINED' ? 'decline' : 'approve'
      // const confirmText = status === 'APPROVED' ? 'Approve' : 'Decline'
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
  open(content, status) {
    if (content) {
    
      const confirmText = status === 'APPROVED' ? 'Approve' : 'Decline'
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
    const confirmText = status === 'Approve' ? 'Approved' : 'Declined'
    let date = new Date()
    let formattedDate = this.datepipe.transform(date,'yyyy-MM-dd')
    let data =   {
      id: content.id,
      status: status === 'Approve' ? 2 : 3,
      organization: this.orgId,
      employee: content.created_by,
      approved_by: status === 'Approve' ? this.user_id :null,
      approved_on: status === 'Approve' ? formattedDate :null,
      rejected_by: status === 'Declined' ? this.user_id :null,
      rejected_on: status === 'Declined' ? formattedDate :null
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
    const confirmText = status === 'Approve' ? 'Approved' : 'Declined'
    let data = {
      id: content.id,
      status: status === 'Approve' ? 2 : 3,
      organization: this.orgId,
      employee: content.employee,
      approved_by: status === 'Approve' ? this.user_id :null,
      approved_on: status === 'Approve' ? formattedDate :null,
      rejected_by: status === 'Declined' ? this.user_id :null,
      rejected_on: status === 'Declined' ? formattedDate :null
  }
  
    this.api.updateData(`${environment.live_url}/${environment.update_leave_details}/`,data).subscribe(res => {

      if (res) {
        this.api.showSuccess(`Timesheet ${confirmText} successfully`)
        this.getAllLeaves(`?status-id=1&organization=${this.orgId}`)
      }

    }, ((error: any) => {
      this.api.showError(error.error.error.message)
    }))
  }
}
