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
  maximum_enhancement:any;
  action:any;
  selectedId: any;
  enabled: boolean = true;
  permissions: any = [];
  user_id: string;
  orgId: any;
  params:any;
  sortValue: string = '';
  directionValue: string = '';
  constructor(
    private modalService:NgbModal, 
    private api:ApiserviceService,
    private router:Router,
    private location:Location,
    private common_service:CommonServiceService
    ) { }
    
    arrowState: { [key: string]: boolean } = {
      number_of_leaves: false,
      cary_forward_percentage: false,
      graceful_days:false,
      maximum_enhancement:false
    };
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.getLeaveType();
  }
  filterSearch(){
    // this.api.getData(`${environment.live_url}/${environment.master_leave_list}?search_key=${this.term}&page_number=${this.page}&data_per_page=${this.tableSize}&pagination=TRUE&organization_id=${this.orgId}`).subscribe((res:any)=>{
    //   if(res){
    //     this.leaveMasterList= res.result.data;
    //     const noOfPages:number = res['result'].pagination.number_of_pages
    //     this.count  = noOfPages * this.tableSize
    //     this.page=res['result'].pagination.current_page;

    //   }
    // },((error:any)=>{
    //   this.api.showError(error.error.error.message)
    // }))
  }

  
  getLeaveType(){
  
    this.api.getData(`${environment.live_url}/${environment.leave_master}/`).subscribe((data:any)=>{
      this.leaveMasterList= data;
      // const noOfPages:number = data['result'].pagination.number_of_pages
      // this.count  = noOfPages * this.tableSize;
      // this.page=data['result'].pagination.current_page;

    },(error=>{
     this.api.showError(error?.error?.message)
      
    })

    )
  }
  delete(id:any){
    this.api.delete(`${environment.live_url}/${environment.leave_master}/${id}/`).subscribe((data:any)=>{
      this.enabled = true
      this.api.showWarning('Deleted successfully!')
      this.getLeaveType();

    },error=>{
      this.api.showError(error?.error?.message);
      
    })
    
  }
  
  sort(direction: string, column: string) {
    // Reset the state of all columns except the one being sorted
    Object.keys(this.arrowState).forEach(key => {
      this.arrowState[key] = false;
    });
  
    // Update the state of the currently sorted column
    this.arrowState[column] = direction === 'asc';
  
    this.directionValue = direction;
    this.sortValue = column;
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
