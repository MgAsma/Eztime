import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  currentIndex:any;
  allProjectList:any=[];
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];

  term:any;
  slno:any;
  project:any;
  client:any;
  reporter:any;
  approver:any;
  start_date:any;
  end_date:any;
  status:any;
  task:any;
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
    this.getProject();
    this.enabled = true;
    // const accessAction = JSON.parse(sessionStorage.getItem('permissionArr'));

    // if (accessAction.length) {
    //   accessAction.forEach((res) => {
    //    //console.log(res.module_name, res.permissions, "RESP");
    //     if (res.module_name === 'PROJECTS') {
    //       this.permissions = res.permissions['PROJECTS'];
    //    //   console.log(this.permissions, "Permissions for PROJECTS");
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
          if(element['PROJECTS']){
            this.permissions = element['PROJECTS']
          }
          
        });
        
      }
  
    })
    }
  getProject(){
    let params = {
      page_number:this.page,
      data_per_page:this.tableSize
  }

    this.api.getProjectDetailsPage(params).subscribe((data:any)=>{
      this.allProjectList= data.result.data;
      //console.log( this.allProjectList,"ALL")
      const noOfPages:number = data['result'].pagination.number_of_pages
      this.count  = noOfPages * this.tableSize

    },error=>{
      this.api.showError(error.error.error.message)
      
    }

    )
  }
  
  delete(id:any){
    this.api.deleteProjectDetails(id).subscribe((data:any)=>{
      if(data){
        this.allProjectList = []
        this.ngOnInit()
        this.api.showWarning('Project deleted successfully!')
       }
    },(error=>{
      this.api.showError(error.error.error.message)
    })
    )
  }
 
  deleteCard(id){
    this.delete(id)
    this.enabled = true;
  }
  editCard(id){
    this.router.navigate([`/project/update/${id}/${this.page}/${this.tableSize}`])
  }
  onTableDataChange(event:any){
    this.page = event;
    this.getProject();
  }  
  onTableSizeChange(event:any): void {
    this.tableSize = Number(event.target.value);
    this.count = 0
    // Calculate new page number
    const calculatedPageNo = this.count / this.tableSize
    
    if(calculatedPageNo < this.page){
      this.page = 1
    }
    this.getProject();
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

  sortValue:any='p_name'
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
