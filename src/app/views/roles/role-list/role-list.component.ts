import { Component, Inject, OnInit ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../../../service/apiservice.service';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
// import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit {
  allRoleList=[];
  currentIndex:any = 1;
  page = 1;
  tableSize = 10;
  tableSizes = [10,25,50,100];
  show = false

  term:any;
  selectedId: any;
  enabled: boolean = true;
  closeResult: string;
  sortedRolls: any[];
  moveNext: boolean;
  config = {
    currentPage: 1,
    itemsPerPage: 0,
    totalItems:0
  }
  
  count:any ;
  totalCount: number;
  permission: any = [];
  admin: boolean = false;
  role: any;
  permissions: any =[];
  user_id: string;

  
  constructor(private api:ApiserviceService,
    private router:Router,
    private modalService:NgbModal,
    private location:Location,
    private common_service : CommonServiceService
    ) { }
    goBack(event)
  {
      event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
    }
  ngOnInit(): void {
     
    this.getRole(`page_number=${this.page}&data_per_page=${this.tableSize}`)
    this.enabled = true
    this.role = sessionStorage.getItem('user_role_name')
    this.user_id = sessionStorage.getItem('user_id')
    // const accessAction = JSON.parse(sessionStorage.getItem('permissionArr'));

    // if (accessAction.length) {
    //   accessAction.forEach((res) => {
    //   // console.log(res.module_name, res.permissions, "RESP");
    //     if (res.module_name === 'ROLES') {
    //       this.permissions = res.permissions['ROLES'];
    //       //console.log(this.permissions, "Permissions for ROLES");
    //     }
    //   });
    // }
    this.getUserControls()
  
  }
  filterSearch(){
    this.getRole(`search_key=${this.term}&page_number=1&data_per_page=10`)
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
          if(element['ROLES']){
            this.permissions = element['ROLES']
          }
          
        });
      } 
    })
   
    }
  
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
  getRole(params){
    this.api.getUserAccess(params).subscribe((data:any)=>{
    
      if(data){
        this.allRoleList = data.result.data
        data.result.data.forEach(res=>{
          // permission.push(res.permissions)
          this.permission.push(res)
          //console.log(res,"PERMISSIONS")
        })
        
       
        this.sortedRolls = this.allRoleList
          const noOfPages:number = data['result'].pagination.number_of_pages
           this.totalCount  = noOfPages * this.tableSize
            this.config = { 
              currentPage: this.page,
              itemsPerPage: this.tableSize,
              totalItems: this.totalCount
            }  
        }
      
    },((error)=>{
      this.api.showError(error.error.error.message)
    })

    )
  }

  delete(id:any){
    this.api.delete(`${environment.live_url}/${environment.userRole}/${id}`).subscribe((data:any)=>{
      if(data){
        this.allRoleList = []
        this.ngOnInit()
        this.api.showWarning('Role deleted successfully!')
     
      }
    },((error)=>{
      this.api.showError(error.error.error.message)
    }))
  
  }
  cardId(selected):any{
    this.selectedId = selected.id;
    this.enabled = false;

   }
  deleteCard(){
    this.delete(this.selectedId)
    this.enabled = true;
  }
  editCard(){
    this.router.navigate([`/role/update/${this.selectedId}`])
  }
  onTableDataChange(event:any){
    this.page = event;
    //console.log(this.page,"EVENT PAGE---")
    this.getRole(`page_number=${this.page}&data_per_page=${this.tableSize}`);
  }  
  onTableSizeChange(event:any): void {
    //console.log(event,"EVENT CHECK")
    this.tableSize = Number(event.target.value);
    this.count = 0
    // Calculate new page number
    const calculatedPageNo = this.totalCount / this.tableSize
    
    if(calculatedPageNo < this.page){
      this.page = 1
    }
    this.getRole(`page_number=${this.page}&data_per_page=${this.tableSize}`);
  }  

 
	open(content) {
    if(content){
      const modelRef = this.modalService.open(GenericDeleteComponent, {
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
  directionValue:any='desc'

  sortValue:any='user_role_name'
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
}
 

