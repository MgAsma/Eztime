import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { TimesheetService } from 'src/app/service/timesheet.service';

@Component({
  selector: 'app-decline',
  templateUrl: './decline.component.html',
  styleUrls: ['./decline.component.scss']
})
export class DeclineComponent implements OnInit {
  @Output() buttonClick:any = new EventEmitter<string>();
  list:any =[];
  slno:any;
  date:any;
  people:any;
  timesheet:any;
  time:any;
  savedon:any;
  status:any;
  action:any;
  term:any;
  page:any=1;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];
  count:any = 0
  entryPoint: any;
  user_id: any;
  accessConfig: any;
  orgId: any;
  @Input() set data(value){
    this.list = value
   //console.log(this.list)
  }
  get data(){
  return this.list
  }
  @Input() set totalCount(value){
    let add:string = '0'
    let tableCount:string = value
    this.count = Number(tableCount+add);
    //console.log(this.count,"COUNT---") 
 }
  constructor(private builder:FormBuilder, private api:ApiserviceService,private modalService:NgbModal,
    private _timesheet:TimesheetService,private common_service:CommonServiceService) { }

  ngOnInit(): void {
    this.user_id = sessionStorage.getItem('user_id')
    this.orgId = sessionStorage.getItem('org_id')
    this.getUserControls()
  }
  getUserControls(){
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10&pagination=TRUE&organization_id=${this.orgId}`).subscribe((res:any)=>{
      if(res.status_code !== '401'){
        this.common_service.permission.next(res['data'][0]['permissions'])
      }
      else{
        this.api.showError("ERROR !")
      }
    },(error=>{
      this.api.showError(error.error.error.message)
   })
  
    )
  
    this.common_service.permission.subscribe(res=>{
      const accessArr = res
      if(accessArr.length > 0){
        accessArr.forEach(element => {
          if(element['PEOPLE_TIMESHEET']){
            this.accessConfig = element['PEOPLE_TIMESHEET']
          }
          
        });
      }
    
      
    })
    }
  delete(item:any){
   
   if(this.list.length === 1){
    this.deleteContent(item)
    this.list = []
   }
    else{
      this.deleteContent(item)
    }
  }
  deleteContent(item){
    let params = {
      module: "TIMESHEET",
      menu: "PEOPLE_TIMESHEET",
      method: "DELETE",
      user_id: this.user_id
  }
  this.api.deleteTimeSheeteDetails(item.id,params).subscribe((data:any)=>{
    if(data){
      let tableData ={
        page:this.page,
        tableSize:this.tableSize
       }
      this.buttonClick.emit(tableData);
      this.api.showWarning('Declined deleted successfully!')
     
    }
    
  },error=>{
    //console.log(error);
    this.api.showError(error.error.error.message)
    
  })
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
  let currStatus =  status === 'Approved'?  "APPROVED": "DECLINED";
  let data= {
    time_sheet_ids: null,
    time_sheet_id:content,
    status_name: currStatus,
    approved_by: 73
}
this._timesheet.updateStatus(data).subscribe(res =>{
  if(res){
    this.api.showSuccess(`${status} updated successfully`)
    let tableData ={
      page:this.page,
      tableSize:this.tableSize
     }
    this.buttonClick.emit(tableData);
  }
  
})
}
onTableDataChange(event:any){
  this.page = event;
  let tableData ={
    page:this.page,
    tableSize:this.tableSize
   }
  this.buttonClick.emit(tableData);
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
    page:this.page,
    tableSize:this.tableSize
   }
  this.buttonClick.emit(tableData);
} 
}
