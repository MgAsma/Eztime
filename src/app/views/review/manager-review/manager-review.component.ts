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
  panelOpenState = true;
  user_id: any;
  user_role_id: number;
  empInfoList: any = [];
  empLeaveList: any = [];
  matchingEmpInfo: any;
  manger_info: any = [];
  timesheet: any = [];
  timesheetAccess: any;
  leaveAccess: any;
  constructor(
    private api:ApiserviceService,
    private modalService:NgbModal,
    private _timesheet:TimesheetService,
    private location:Location,
    private common_service:CommonServiceService
    ) { }
  data = []
  
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  ngOnInit(): void {
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    this.user_role_id = JSON.parse(sessionStorage.getItem('user_role_id'))
  //  const accessAction = JSON.parse(sessionStorage.getItem('permissionArr'));
    this.getEmployeeData()
    // if (accessAction.length) {
    //   accessAction.forEach((res) => {
    //   // console.log(res.module_name, res.permissions, "RESP");
    //     if (res.module_name === 'TIMESHEET') {
    //       this.timesheetAccess = res.permissions['PEOPLE_TIMESHEET'];
    //    //   console.log(this.permissions, "Permissions for DEPARTMENT");
    //     }
    //     if (res.module_name === 'LEAVE/HOLIDAY_LIST') {
    //       this.leaveAccess = res.permissions['LEAVE_APPLICATION'];
    //    //   console.log(this.permissions, "Permissions for DEPARTMENT");
    //     }
    //   });
    // }
   this.getUserControls()
  }
  getUserControls(){
    this.user_id = sessionStorage.getItem('user_id')
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10`).subscribe((res:any)=>{
      if(res.status_code !== '401'){
        this.common_service.permission.next(res['data'][0]['permissions'])
        //console.log(this.common_service.permission,"PERMISSION")
      }
      else{
        this.api.showError("ERROR !")
      }
      //console.log(res,'resp from yet');
      
    }
  
    )
  
    this.common_service.permission.subscribe(res=>{
      const accessArr = res
      if(accessArr.length > 0){
        accessArr.forEach((element,i) => {
          if(element['PEOPLE_TIMESHEET']){
            this.timesheetAccess = element['PEOPLE_TIMESHEET']
          }
          if(element['LEAVE_APPLICATION']){
            this.leaveAccess = element['LEAVE_APPLICATION']
          }
          
        });
      }
    })
   
    }
  getEmployeeData(){
    this.api.getData(`${environment.live_url}/${environment.managerReview}?user_id=${this.user_id}&role_id=${this.user_role_id}`).subscribe(response =>{
      if(response){
       this.empInfoList = response['result'].data.emp_info_list;
       this.manger_info.push(response['result'].data.manger_info);
       this.empLeaveList = response['result'].data.emp_leave_list[0];
       this.timesheet = response['result'].data.emp_timesheet_list
       //console.log(response['result'].data.emp_timesheet_list,"LEAVE_LIST")
      }
    },(error =>{
      this.api.showError(error.error.error.message)
    }))
  }
  
  
  openDialogue(content,status){
    if(content){
      const statusText = status === 'DECLINED' ? 'decline' : 'approve'
      const confirmText  = status === 'APPROVED' ? 'Approve' :'Decline'
      const modelRef =   this.modalService.open(GenericDeleteComponent, {
        size: <any>'sm'
  ,
        backdrop: true,
        centered:true
      });
      modelRef.componentInstance.title = `Are you sure do you want to ${statusText}`;
      modelRef.componentInstance.message = `${confirmText} confirmation`;
      modelRef.componentInstance.status.subscribe(resp => {
        if(resp == "ok"){
          console.log(content,"CONTENT")
          this.updateTimesheetStatus(content,status)
         modelRef.close();
        }
        else{
          modelRef.close();
        }
    })
  
  }

  }
  open(content,status){
    if(content){
      const statusText = status === 'APPROVED' ? 'approve' : 'decline'
      const confirmText  = status === 'APPROVED' ? 'Approve' :'Decline'
      const modelRef =   this.modalService.open(GenericDeleteComponent, {
        size: <any>'sm'
  ,
        backdrop: true,
        centered:true
      });
      modelRef.componentInstance.title = `Are you sure do you want to ${statusText}`;
     modelRef.componentInstance.message =`${confirmText} confirmation`;
      modelRef.componentInstance.status.subscribe(resp => {
        if(resp == "ok"){
        //  console.log(content,"CONTENT")
          this.updateStatus(content,status)
         modelRef.close();
        }
        else{
          modelRef.close();
        }
    })
  
  }
  }
  updateTimesheetStatus(content,status){
    console.log(content,"TIMESHEET CONTENT")
    let currMethod =  status === "APPROVED" ? 'ACCEPT': "REJECT";
    const confirmText  = status === 'APPROVED' ? 'approved' :'declined'
  let data= {
     user_id:this.user_id,
     update:"TRUE",
     approved_by_manager_id:this.user_id,
     module:"TIMESHEET",
     menu:"PEOPLE_TIMESHEET",
     method:currMethod,
     time_sheet_id_list:[],
     time_sheet_id:content.timesheet_id,
     approved_state: status
}
  this._timesheet.updateStatus(data).subscribe(res =>{
    if(res){
      this.api.showSuccess(`Timesheet ${confirmText} successfully`)
      this.getEmployeeData()
    } 
  },(error =>{
    this.api.showError(error.error.error.message)
  }))
  }
  updateStatus(content,status){
    //console.log(content,status,"STATUS CONTENT CHECK")
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
     let date = new Date();
     let currDate =('0' +(date.getDate())).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2) + '/'  + date.getFullYear() 
     //console.log( currDate," this.currDate")
    let method = status ==="APPROVED" ? "APPROVE" :"REJECT"
    let contentUser_id:number = content.user_id
    //console.log(typeof contentUser_id)
    let content_Id:number = content.leave_id
    //console.log(typeof this.user_id)
    let data ={
      user_id:this.user_id,
      module:"LEAVE/HOLIDAY_LIST",
      menu:"APPLIED/APPROVIED_LEAVES",
      method:method,
      id:content_Id,
      approved_state: status,
      approved_by_id:this.user_id,
      approved_date:currDate
  }
  
  this.api.leaveApplicationState(data).subscribe(res =>{
    
    if(res){
      this.api.showSuccess(res['result'].message)
      this.getEmployeeData()
      //console.log(res,"STATE CHANGE")
    }
 
  },((error:any) =>{
    this.api.showError(error.error.error.message)
  }))
  }
}
