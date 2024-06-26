import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { SortPipe } from 'src/app/sort/sort.pipe';
import { environment } from 'src/environments/environment';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss'],
  providers: [
    SortPipe
]
})
export class OrganizationListComponent implements OnInit {
  term:any;
  directionValue:any='desc'
  sortValue:any='org_name'
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];
  url: any;
  organizationData: any = [];
currentIndex: any;
  user_id: string;
  params:any = {}
  permissions: any = [];
  org_id: any;
  constructor(private api:ApiserviceService,private modalService:NgbModal,
    private router:Router,private location:Location,
    private common_service:CommonServiceService) { }
    goBack(event)
  {
      event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
    }
  ngOnInit(): void {
    this.user_id = sessionStorage.getItem('user_id')
    this.org_id = sessionStorage.getItem('org_id')
    this.params = {
      page_number : this.page,
      data_per_page : this.tableSize,
    }
   
    this.getOrgDetails(`page_number=${this.params.page_number}&data_per_page=${this.params.data_per_page}&pagination=TRUE`)
    // const accessAction = JSON.parse(sessionStorage.getItem('permissionArr'));

    // if (accessAction.length) {
    //   accessAction.forEach((res) => {
    //  //  console.log(res.module_name, res.permissions, "RESP");
    //     if (res.module_name === 'ORGANIZATION') {
    //       this.permissions = res.permissions['ORGANIZATION'];
    //    //   console.log(this.permissions, "Permissions for DEPARTMENT");
    //     }
    //   });
    // }
    this.getUserControls()
  }
  getUserControls(){
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10&pagination=TRUE&organization_id=${this.org_id}`).subscribe((res:any)=>{
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
          if(element['ORGANIZATION']){
            this.permissions = element['ORGANIZATION']
          }
          
        });
      }
    })
    }
  arrow:boolean=false
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
  getOrgDetails(pagination){
    this.api.getData(`${environment.live_url}/${environment.organization}?${pagination}`).subscribe(res=>{
      if(res){
       this.organizationData = res['result']['data']
       const noOfPages:number = res['result'].pagination.number_of_pages
       this.count  = noOfPages * this.tableSize
      }
    },(error =>{
      this.api.showError(error.error.error.message)
    }))
  }
  filterSearch(){
    this.api.getData(`${environment.live_url}/${environment.organization}?search_key=${this.term}&page_number=1&data_per_page=10&pagination=TRUE`).subscribe((res:any)=>{
      if(res){
        this.organizationData= res.result.data;
        const noOfPages:number = res['result'].pagination.number_of_pages
        this.count  = noOfPages * this.tableSize
      }
    },((error:any)=>{
      this.api.showError(error.error.error.message)
    }))
  }
  onTableDataChange(event:any){
    this.page = event;
    this.getOrgDetails(`page_number=${this.page}&data_per_page=${this.tableSize}&pagination=TRUE`)
  }  
  onTableSizeChange(event:any): void {
    this.tableSize = Number(event.target.value);
    this.count = 0
    // Calculate new page number
    const calculatedPageNo = this.count / this.tableSize
    
    if(calculatedPageNo < this.page){
      this.page = 1
    }
    this.getOrgDetails(`page_number=${this.page}&data_per_page=${this.tableSize}&pagination=TRUE`)
  } 
  delete(id:any){
    this.api.delete(`${environment.live_url}/${environment.organization}/${id}`).subscribe((data:any)=>{
      if(data){
        this.organizationData = []
        this.api.showWarning('Organization deleted successfully!!')
        this.ngOnInit()
      }
      
    },(error =>{
      this.api.showError(error.error.error.message)
    })) 
  }
  editCard(id){
    this.router.navigate([`/organization/updateOrg/${id}`])
  }
  deleteCard(id){
    this.delete(id)
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
