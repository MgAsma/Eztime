import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';
import { error } from 'console';
@Component({
  selector: 'app-leave-master',
  templateUrl: './leave-master.component.html',
  styleUrls: ['./leave-master.component.scss']
})
export class LeaveMasterComponent implements OnInit {
  BreadCrumbsTitle:any='Master leave types';
  leaveMasterList=[];
  currentIndex:any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10,25,50,100];

  term:any='';
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
  orgId: any;
  params:any;
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
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('org_id');
    
    this.getLeaveType();
    this.enabled = true
    this.getUserControls()
  }
  filterSearch(){
    this.api.getData(`${environment.live_url}/${environment.master_leave_list}?search_key=${this.term}&page_number=${this.page}&data_per_page=${this.tableSize}&pagination=TRUE&organization_id=${this.orgId}`).subscribe((res:any)=>{
      if(res){
        this.leaveMasterList= res.result.data;
        const noOfPages:number = res['result'].pagination.number_of_pages
        this.count  = noOfPages * this.tableSize
        this.page=res['result'].pagination.current_page;

      }
    },((error:any)=>{
      this.api.showError(error.error.error.message)
    }))
  }

  getUserControls(){
    this.user_id = sessionStorage.getItem('user_id')
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10&pagination=TRUE&organization_id=${this.orgId}`).subscribe((res:any)=>{
      if(res.status_code !== '401'){
        this.common_service.permission.next(res['data'][0]['permissions'])
        //console.log(this.common_service.permission,"PERMISSION")
      }
      else{
        this.api.showError("ERROR !")
      }
      //console.log(res,'resp from yet');
      
    },(error =>{
      this.api.showError(error.error.error.message)
    })
  
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
    let params = {
      page_number:this.page,
      data_per_page:this.tableSize,
      organization_id:this.orgId,
      search_key:this.term
      }
    this.api.getLeaveDetail(params).subscribe((data:any)=>{
      this.leaveMasterList= data.result.data;
      const noOfPages:number = data['result'].pagination.number_of_pages
      this.count  = noOfPages * this.tableSize;
      this.page=data['result'].pagination.current_page;

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
    this.tableSize = Number(event.target.value);
    this.count = 0
    // Calculate new page number
    const calculatedPageNo = this.count / this.tableSize 
    if(calculatedPageNo < this.page){
      this.page = 1
    }
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

  getContinuousIndex(index: number):number {
    return (this.page-1)*this.tableSize+ index + 1;
  }
}
