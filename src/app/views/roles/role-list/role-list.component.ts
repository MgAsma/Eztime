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
  BreadCrumbsTitle:any='Designation';
  allRoleList=[];
  currentIndex:any = 1;
  page :any= 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10,25,50,100];

  show = false

  term:any='';
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
  defaultUrl:any ;
  totalCount: number;
  permission: any = [];
  admin: boolean = false;
  role: any;
  permissions: any =[];
  user_id: string;
  org_id: string;

  
  constructor(private api:ApiserviceService,
    private router:Router,
    private modalService:NgbModal,
    private location:Location,
    private common_service : CommonServiceService
    ) { }
    goBack(event){
      event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
    }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.org_id = sessionStorage.getItem('organization_id')
    // this.getRole(`search_key=${this.term}&page_number=${this.page}&data_per_page=${this.tableSize}&pagination=TRUE&organization_id=${this.org_id}`)
    this.enabled = true
    this.role = sessionStorage.getItem('user_role_name');
    this.user_id = sessionStorage.getItem('user_id');
    // this.defaultUrl = `?organization_id=${this.org_id}&page=${this.page}&page_size=${this.tableSize}`;
    this.defaultUrl = `?organization_id=${this.org_id}`;
    this.getAllDesignations();
    
    
    // this.getUserControls()
  
  }
  getAllDesignations(){
    this.api.getDesignationList(this.defaultUrl).subscribe(
      (res:any)=>{
        console.log('desinations',res);
        this.allRoleList = res;
        // this.count = res.total_no_of_record;
      }
    )
  }
  filterSearch(){
  }
 
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  delete(id:any){
    this.api.deleteDesignationList(id).subscribe((data:any)=>{
      if(data){
        this.allRoleList = []
        this.ngOnInit()
        this.api.showWarning(data['message'])
     
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
  
  onTableDataChange(event:any){
    // console.log(event,"EVENT PAGE---");
    // this.page = event;
    // const updatedUrl:any = this.defaultUrl;
    // const page:any = "page";
    // updatedUrl.searchParams.set(page,this.page)
    // this.defaultUrl= updatedUrl.toString().replace(/%26/g, "&");
    // console.log('this.defaultUrl',this.defaultUrl)
    // this.filtersCommonAPI(this.defaultUrl)
     }  

  onTableSizeChange(event:any): void {
    console.log(event,"EVENT CHECK")
    this.tableSize = Number(event.target.value);
    this.count = 0
    // Calculate new page number
    const calculatedPageNo = this.totalCount / this.tableSize
    
    if(calculatedPageNo < this.page){
      this.page = 1
    }
    // this.getRole(`search_key=${this.term}&page_number=${this.page}&data_per_page=${this.tableSize}&pagination=TRUE&organization_id=${this.org_id}`);
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
  sortValue: string = '';
  directionValue: string = '';
  arrowState: { [key: string]: boolean } = {
    department_name: false,
    created_datetime: false,
  };
  arrow:boolean=false
  sort(direction: string, column: string) {
    Object.keys(this.arrowState).forEach(key => {
      this.arrowState[key] = false;
    });
    this.arrowState[column] = direction === 'asc';
    this.directionValue = direction;
    this.sortValue = column;
  }
  getContinuousIndex(index: number):number {
    return (this.page-1)*this.tableSize+ index + 1;
  }

  filtersCommonAPI(url:any){
    this.api.getDesignationList(decodeURIComponent(url)).subscribe(
      (res:any)=>{
        console.log('desinations',res);
        this.allRoleList = res.results;
        this.count = res.total_no_of_record;
      },
      (error:any)=>{
        console.log('error',error)
      }
    )
  }
}
 

