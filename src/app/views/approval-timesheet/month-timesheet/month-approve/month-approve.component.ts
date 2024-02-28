import { AfterContentChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { TimesheetService } from 'src/app/service/timesheet.service';

@Component({
  selector: 'app-month-approve',
  templateUrl: './month-approve.component.html',
  styleUrls: ['./month-approve.component.scss']
})
export class MonthApproveComponent implements OnInit{
  @Output() buttonClick = new EventEmitter<string>();
  slno:any;
  date:any;
  people:any;
  timesheet:any;
  time:any;
  savedon:any;
  approvedon:any;
  approvedby:any;
  status:any;
  action:any;
  term:any;
  approvedAll:any = [];
  userId: any = 1;
  page:any = 1;
  approveCount = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];
  count = 0;
  accessConfig: any = [];
  user_id: any;
  noOfPages: any;
  org_id: any;
  
  @Input() set data(value) {
    this.approvedAll = value;
    // this.count = value['count']
  }

  get data(): string {
    return this.approvedAll;
  }
  @Input() set totalCount(value){
    let add:string = '0'
    let tableCount:string = value
    this.count = Number(tableCount+add);

  }
  constructor(private _timesheet:TimesheetService,
    private modalService:NgbModal,
    private api:ApiserviceService,
    private common_service:CommonServiceService) {
      
   }
   ngOnInit(){
    this.user_id = sessionStorage.getItem('user_id')
    this.org_id = sessionStorage.getItem('org_id')
    this.getUserControls()
 }
 getUserControls(){
  this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10&organization_id=${this.org_id}&pagination=TRUE`).subscribe((res:any)=>{
    if(res.status_code !== '401'){
      this.common_service.permission.next(res['data'][0]['permissions'])
     // //console.log(this.common_service.permission,"PERMISSION")
    }
    else{
      this.api.showError("ERROR !")
    }
  //  //console.log(res,'resp from yet');
    
  }

  )

  this.common_service.permission.subscribe(res=>{
    const accessArr = res
    if(accessArr.length > 0){
      accessArr.forEach((element,i) => {
        if(element['MONTH_APPROVAL_TIMESHEET']){
          this.accessConfig = element['MONTH_APPROVAL_TIMESHEET']
        } 
      });
    }
   
  })

  }

 
  onTableDataChange(event:any){
    this.page = event;
    this.buttonClick.emit(event)
  }  
  onTableSizeChange(event:any): void {
    this.tableSize = Number(event.target.value);
    this.count = 0
    const calculatedPageNo = this.count / this.tableSize
    if(calculatedPageNo < this.page){
      this.page = 1
    }
    this.buttonClick.emit(this.page)
  } 
  
// open(content,status) {
//   if(content){
//     const modelRef =   this.modalService.open(GenericDeleteComponent, {
//       size: <any>'sm'
  
//       backdrop: true,
//       centered:true
//     });
//     modelRef.componentInstance.title = `Are You Sure Do You Want To ${status}`;
//    modelRef.componentInstance.message =`Confirmation`;
//     modelRef.componentInstance.status.subscribe(resp => {
//       if(resp == "ok"){
//        this.updateStatus(content,status);
//        modelRef.close();
//       }
//       else{
//         modelRef.close();
//       }
//   })

// }
// }
// updateStatus(content,status){
//   let currMethod = status === 'DECLINED'?'REJECT':'ACCEPT'
//   //let manager_id = sessionStorage.getItem('manager_id')
//   let data= {
//     time_sheet_id_list: [],
//     time_sheet_id:content,
//     status_name: status,
//     reporting_manager_ref:this.user_id,
//     module: "TIMESHEET",
//     menu: "MONTH_APPROVAL_TIMESHEET",
//     method: currMethod,
//     user_id:this.user_id
// }
// this._timesheet.updateStatus(data).subscribe(res =>{
//   this.buttonClick.emit(this.page)
//   if(res){
//     this.api.showSuccess(`${status} updated successfully`)
//   }
// })
// }
}
