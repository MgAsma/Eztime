import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { TimesheetService } from 'src/app/service/timesheet.service';

@Component({
  selector: 'app-month-yet-approve',
  templateUrl: './month-yet-approve.component.html',
  styleUrls: ['./month-yet-approve.component.scss']
})
export class MonthYetApproveComponent implements OnInit {
  @Output() buttonClick = new EventEmitter<string>();
  slno:any;
  date:any;
  people:any;
 
  time:any;
  savedon:any;
  status:any;
  action:any;
  term:any;
  yetToApproveAll:any = [];
  params: { status: string; user_id: any; page_number: any; data_per_page: number; timesheets_to_date: string; timesheets_from_date: string; };
  //userId: any = 1;
  page:any = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];
  yetcount = 0;
  user_id: any;
  accessConfig: any = [];
  
  @Input() set data(value) {
    this.yetToApproveAll = value;
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
  constructor(private _timesheet:TimesheetService,
   private modalService:NgbModal,
   private api:ApiserviceService,
   private common_service:CommonServiceService) { 
  
  }

  ngOnInit(): void {
   this.user_id = sessionStorage.getItem('user_id')
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
        //console.log(res,'resp from yet');
        
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
  open(content,status) {
    const selectedStatus = status === 'APPROVED' ? 'approve' : 'decline'
    const confirmText  = status === 'APPROVED' ? 'Approve' :'Decline'
    if(content){
      const modelRef =   this.modalService.open(GenericDeleteComponent, {
        size: <any>'md',
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
let currMethod =  status === 'DECLINED'?'REJECT':'ACCEPT'
let data= {
 user_id:this.user_id,
 update:"TRUE",
 approved_by_manager_id:this.user_id,
 module:"TIMESHEET",
 menu:"MONTH_APPROVAL_TIMESHEET",
 method:currMethod,
 time_sheet_id_list:[],
 time_sheet_id:content,
 approved_state: status
}
this._timesheet.updateStatus(data).subscribe(res =>{
  this.buttonClick.emit(this.page)
 if(res){
  const toasterText = status ===  'DECLINED'?'declined':'approved'
   this.api.showSuccess(`Timesheet ${toasterText} successfully !!`)
   this.ngOnInit();
 }
 
})
}
}
