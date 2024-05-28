import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { TimesheetService } from 'src/app/service/timesheet.service';

@Component({
  selector: 'app-yet-approve',
  templateUrl: './yet-approve.component.html',
  styleUrls: ['./yet-approve.component.scss']
})
export class YetApproveComponent implements OnInit {
  @Output() buttonClick = new EventEmitter<any>();
  @Output() filter:any = new EventEmitter<any>();

  slno:any;
  date:any;
  people:any;
  timesheet:any;
  time:any;
  savedon:any;
  status:any;
  action:any;
  term:any='';
  yetToApproveAll:any = [];
  page:any = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10,25,50,100];
  entryPoint: any;
  user_id: string;
  accessConfig: any = [];

  @Input() set data(value) {
    this.yetToApproveAll = value;
    //console.log(this.yetToApproveAll,"this.yetToApproveAll")
    // this.count = value['count']
  }

  get data(): string {
    return this.yetToApproveAll;
  }
  @Input() set totalCount(value){
    let add:string = '0'
    let tableCount:string = value
    this.count = Number(tableCount+add);
    //console.log(this.count,"COUNT---") 
  }
  constructor(private api:ApiserviceService,private _timeSheetService:TimesheetService ,private modalService:NgbModal,
    private _timesheet:TimesheetService,
    private common_service:CommonServiceService) { }

  ngOnInit(): void {
   // this.entryPoint = JSON.parse(sessionStorage.getItem('entryPoint'))
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    this.getUserControls()
  }
  getUserControls(){
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10`).subscribe((res:any)=>{
      if(res.status_code !== '401'){
        this.common_service.permission.next(res['data'][0]['permissions'])
        //console.log(this.common_service.permission,"PERMISSION")
      }
      else{
        this.api.showError("ERROR !")
      }
      
    }
  
    )
    this.common_service.permission.subscribe(res=>{
      const accessArr = res
      if(accessArr.length > 0){
        accessArr.forEach((element,i) => {
          if(element['TODAY_APPROVAL_TIMESHEET']){
            this.accessConfig = element['TODAY_APPROVAL_TIMESHEET']
          }
          
        });
      }
   
    })
   
    }
  
  delete(item:any){
   let params = {
    module: "TIMESHEET",
    menu: "TODAY_APPROVAL_TIMESHEET",
    method: "DELETE",
    user_id:this.user_id
   }
    this._timeSheetService.deleteTodaysApproval(item.id,params).subscribe((data:any)=>{
      this.api.showWarning('Deleted successfully')
    },error=>{
      //console.log(error);
      
    })
    
  }
 
  filterSearch(){
    let tableData ={
      search_key:this.term,
      page:this.page,
      tableSize:this.tableSize
     }
    this.filter.emit(tableData);
  }
onTableDataChange(event:any){
  this.page = event;
  let tableData ={
    search_key:this.term,
    page:this.page,
    tableSize:this.tableSize
   }
  this.buttonClick.emit(tableData)
}  
onTableSizeChange(event:any): void {
  this.tableSize = Number(event.target.value);
  this.count = 0
  // Calculate new page number
  const calculatedPageNo = this.count / this.tableSize
  
  if(calculatedPageNo < this.page){
    this.page = 1
  }
  let tableData ={
    search_key:this.term,
    page:this.page,
    tableSize:this.tableSize
   }
  this.buttonClick.emit(tableData)
} 
open(content) {
  if(content){
    const modelRef =   this.modalService.open(GenericDeleteComponent, {
      size: <any>'sm',
      backdrop: true,
      centered:true
    });
   
    modelRef.componentInstance.status.subscribe(resp => {
      if(resp == "ok"){
        //console.log(content,"ID")
       this.delete(content);
       modelRef.close();
      }
      else{
        modelRef.close();
      }
  })

}



}
openDialogue(content,status) {
  if(content){
    const selectedStatus = status === 'APPROVED' ? 'approve' : 'decline'
    const confirmText  = status === 'APPROVED' ? 'Approve' :'Decline'
    const modelRef =   this.modalService.open(GenericDeleteComponent, {
      size: <any>'sm'
  ,
      backdrop: true,
      centered:true
    });
    modelRef.componentInstance.title = `Are you sure do you want to ${selectedStatus}`;
    modelRef.componentInstance.message = `${confirmText} confirmation`;
    modelRef.componentInstance.status.subscribe(resp => {
      if(resp == "ok"){
       this.updateStatus(content,status);
       modelRef.close();
      }
      else{
        modelRef.close();
      }
  })

}
}
updateStatus(content,status){
   //let currStatus =  status === 'Approved'?  "APPROVED": "DECLINED";
   let currMethod =  status === 'DECLINED'?'REJECT':'ACCEPT'
  
let data= {
  user_id:this.user_id,
  update:"TRUE",
  approved_by_manager_id:this.user_id,
  module:"TIMESHEET",
  menu:"TODAY_APPROVAL_TIMESHEET",
  method:currMethod,
  time_sheet_id_list:[],
  time_sheet_id:content,
  approved_state: status
}
this._timesheet.updateStatus(data).subscribe(res =>{
  if(res){
    const toastText = status === 'DECLINED' ? 'declined' : 'approved'
    this.api.showSuccess(`Timesheet ${toastText} successfully`)
    this.buttonClick.emit(this.page)
  }
  
})
}
getContinuousIndex(index: number):number {
  return (this.page-1)*this.tableSize+ index + 1;
}
}
