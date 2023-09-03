import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
import { error } from 'console';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categoryList=[];
  currentIndex = 1;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];

  term:any;
  slno:any;
  name:any;
  date:any;
  action:any;
  status:any;
  selectedId: any;
  enabled: boolean;
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
    this.getCategory();
    // const accessAction = JSON.parse(sessionStorage.getItem('permissionArr'));

    // if (accessAction.length) {
    //   accessAction.forEach((res) => {
    //   // console.log(res.module_name, res.permissions, "RESP");
    //     if (res.module_name === 'PROJECT_TASK_CATEGORIES') {
    //       this.permissions = res.permissions['PROJECT_TASK_CATEGORIES'];
    //    //   console.log(this.permissions, "Permissions for PROJECT_TASK_CATEGORIES");
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
      
    },(error=>{
      this.api.showError(error.error.error.message)
   })
  
    )
  
    this.common_service.permission.subscribe(res=>{
      const accessArr = res
      if(accessArr.length > 0){
        accessArr.forEach(element => {
          if(element['PROJECT_TASK_CATEGORIES']){
            this.permissions = element['PROJECT_TASK_CATEGORIES']
          }
          
        });  
      }
    
    })
    }
  getCategory(){
    let params = {
      page_number:this.page,
      data_per_page:this.tableSize
  }

    this.api.getProjectTaskCategoryDetailsPage(params).subscribe(data=>{
      
      if(data['result'].data){
        this.categoryList= data['result'].data;
        //console.log(this.categoryList,"CATEGORY")
        const noOfPages:number = data['result'].pagination.number_of_pages
        this.count  = noOfPages * this.tableSize
      }
      
    },error=>{
      this.api.showError(error.error.error.message)
    })
  }
  delete(id:any){
    this.api.deleteProjectTaskCategoryDetails(id).subscribe((data:any)=>{
      if(data){
        this.categoryList = []
        this.ngOnInit()
        this.api.showWarning('Project category deleted successfully')
      }
     
    },error=>{
      this.api.showError(error.error.error.message)
    })
    
  }
  
  deleteCard(id){
    this.delete(id)
    this.enabled = true;
  }
  editCard(id){
    this.router.navigate([`/task/update/${id}/${this.page}/${this.tableSize}`])
  }
  onTableDataChange(event:any){
    this.page = event;
    this.getCategory();
  }  
  onTableSizeChange(event:any): void {
    this.tableSize = Number(event.target.value);
    this.count = 0
    // Calculate new page number
    const calculatedPageNo = this.count / this.tableSize
    
    if(calculatedPageNo < this.page){
      this.page = 1
    }
    this.getCategory();
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

  arrow:boolean=false
  directionValue:any='desc'




  sortValue:any='tpc_name'
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
}

