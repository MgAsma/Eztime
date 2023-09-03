import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-leave-master',
  templateUrl: './leave-master.component.html',
  styleUrls: ['./leave-master.component.scss']
})
export class LeaveMasterComponent implements OnInit {

  leaveMasterList=[];
  currentIndex:any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];

  term:any;
  slno:any;
  title:any;
  type:any;
  leave:any;
  carry:any;
  day:any;
  encashment:any;
  max_encashment:any;
  action:any;
  selectedId: any;
  enabled: boolean = true;
  permissions: any = [];
  user_id: string;
  
  constructor(
    private modalService:NgbModal, 
    private api:ApiserviceService,
    private router:Router,
    private location:Location,
    private common_service:CommonServiceService
    ) { }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  ngOnInit(): void {
    this.getLeaveType();
    this.enabled = true
    // const accessAction = JSON.parse(sessionStorage.getItem('permissionArr'));

    
    // if(accessAction.length){
    //   accessAction.forEach(res=>{
    //     if(res.module_name === 'LEAVE/HOLIDAY_LIST'){
    //       this.permissions = res.permissions['LEAVE_MASTER']
    //      // console.log(this.permissions,'Permission for LEAVE_MASTER')
    //     }
    //   })
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
          if(element['LEAVE_MASTER']){
            this.permissions = element['LEAVE_MASTER']
          }
          
        });
       
      }
    
      
    //  console.log(this.accessConfig,"this.accessConfig")
    })
    }
  getLeaveType(){
    this.api.getLeaveTypeDetails().subscribe((data:any)=>{
      this.leaveMasterList= data.result.data;
    },(error=>{
     this.api.showError(error.error.error.message)
      
    })

    )
  }
  delete(id:any){
    this.api.deleteLeaveTypeDetails(id).subscribe((data:any)=>{
      this.enabled = true
      this.api.showWarning('Deleted successfully!')
      this.getLeaveType();

    },error=>{
      this.api.showError(error.error.error.message);
      
    })
    
  }
  arrow:boolean=false
  directionValue:any='desc'




  sortValue:any='leave_title'
  sort(direction:any,value:any){
    if(direction=='asc'){
      this.arrow=true
      this.directionValue= direction
      this.sortValue= value
    }
    else{
      this.arrow=false
      this.directionValue= direction
      this.sortValue= value
    }
  }
  cardId(selected):any{
    this.selectedId = selected.id;
    this.enabled = false;

   }
  deleteCard(id){
    this.delete(id)
    this.enabled = true;
  }
  editCard(id){
    this.router.navigate([`/leave/updateLeaveDetails/${id}`])
  }
  onTableDataChange(event:any){
    this.page = event;
    this.getLeaveType();
  }  
  onTableSizeChange(event:any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getLeaveType();
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
}
