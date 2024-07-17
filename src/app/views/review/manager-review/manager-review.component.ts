import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { TimesheetService } from 'src/app/service/timesheet.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';

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
  constructor(
    private api: ApiserviceService,
    private modalService: NgbModal,
    private _timesheet: TimesheetService,
    private location: Location,
    private common_service: CommonServiceService
  ) { }
  data = []

  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();
  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    this.user_role_id = JSON.parse(sessionStorage.getItem('user_role_id'))
    this.orgId = sessionStorage.getItem('org_id')
    this.getEmployeeData()
    this.getUserControls()
  }
  getUserControls() {
    this.user_id = sessionStorage.getItem('user_id')
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10&pagination=TRUE&organization_id=${this.orgId}`).subscribe((res: any) => {
      if (res.status_code !== '401') {
        this.common_service.permission.next(res['data'][0]['permissions'])
      }
      else {
        this.api.showError("ERROR !")
      }
    }

    )

    this.common_service.permission.subscribe(res => {
      const accessArr = res
      if (accessArr.length > 0) {
        accessArr.forEach((element, i) => {
          if (element['REVIEW']) {
            this.timesheetAccess = element['REVIEW'];
            this.leaveAccess = element['REVIEW']
          }
        });
      }
    })

  }
  getEmployeeData() {
    this.api.getData(`${environment.live_url}/${environment.managerReview}?user_id=${this.user_id}&role_id=${this.user_role_id}&organization_id=${this.orgId}`).subscribe(response => {
      if (response) {
        this.empInfoList = response['result'].data.emp_info_list;
        this.manger_info.push(response['result'].data.manger_info);
        this.empLeaveList = response['result'].data.emp_leave_list[0];
        this.emptimesheet = response['result'].data.emp_timesheet_list[0]
      }
    }, (error => {
      this.api.showError(error.error.error.message)
    }))
  }


  openDialogue(content, status) {
    if (content) {
      const statusText = status === 'DECLINED' ? 'decline' : 'approve'
      const confirmText = status === 'APPROVED' ? 'Approve' : 'Decline'
      const modelRef = this.modalService.open(GenericDeleteComponent, {
        size: <any>'sm'
        ,
        backdrop: true,
        centered: true
      });
      modelRef.componentInstance.title = `Are you sure do you want to ${statusText}`;
      modelRef.componentInstance.message = `${confirmText} confirmation`;
      modelRef.componentInstance.status.subscribe(resp => {
        if (resp == "ok") {
          console.log(content, "CONTENT")
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
      const statusText = status === 'APPROVED' ? 'approve' : 'decline'
      const confirmText = status === 'APPROVED' ? 'Approve' : 'Decline'
      const modelRef = this.modalService.open(GenericDeleteComponent, {
        size: <any>'sm'
        ,
        backdrop: true,
        centered: true
      });
      modelRef.componentInstance.title = `Are you sure do you want to ${statusText}`;
      modelRef.componentInstance.message = `${confirmText} confirmation`;
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
    console.log(content, "TIMESHEET CONTENT")
    let currMethod = status === "APPROVED" ? 'ACCEPT' : "REJECT";
    const confirmText = status === 'APPROVED' ? 'approved' : 'declined'
    let data = {
      user_id: this.user_id,
      update: "TRUE",
      approved_by_manager_id: this.user_id,
      module: "TIMESHEET",
      menu: "PEOPLE_TIMESHEET",
      method: currMethod,
      time_sheet_id_list: [],
      time_sheet_id: content.timesheet_id,
      approved_state: status
    }
    this._timesheet.updateStatus(data).subscribe(res => {
      if (res) {
        this.api.showSuccess(`Timesheet ${confirmText} successfully`)
        this.getEmployeeData()
      }
    }, (error => {
      this.api.showError(error.error.error.message)
    }))
  }
  updateStatus(content, status) {
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    let date = new Date();
    let currDate = ('0' + (date.getDate())).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
    let method = status === "APPROVED" ? "APPROVE" : "REJECT"
    let contentUser_id: number = content.user_id
    let content_Id: number = content.leave_id
    let data = {
      user_id: this.user_id,
      module: "LEAVE/HOLIDAY_LIST",
      menu: "APPLIED/APPROVIED_LEAVES",
      method: method,
      id: content_Id,
      approved_state: status,
      approved_by_id: this.user_id,
      approved_date: currDate
    }

    this.api.leaveApplicationState(data).subscribe(res => {

      if (res) {
        this.api.showSuccess(res['result'].message)
        this.getEmployeeData()
      }

    }, ((error: any) => {
      this.api.showError(error.error.error.message)
    }))
  }
}
