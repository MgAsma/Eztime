import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { SortPipe } from 'src/app/sort/sort.pipe';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
  providers: [
    SortPipe
]
})
export class DepartmentListComponent implements OnInit {
  BreadCrumbsTitle:any='Department list';
  currentIndex:any = 1;
  public searchText : any;
  allDepartmentList=[];
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];

  term:any;
  selectedId: any;
  enabled: boolean = true;
  // @Input() selectedSortValue1:Subject<any> = new Subject<any>();
  // @Input() selectedDirection1:Subject<any> = new Subject<any>()
  directionValue:any='desc'
  sortValue:any='od_name'
  params: { page_number: number; data_per_page: number; };
  permissions: any = [];
  user_id: string;
  org_id: string;

  constructor(private api:ApiserviceService,private router:Router,
    private modalService:NgbModal,
    private location:Location,
    private common_service:CommonServiceService
    ) { }

    
 goBack(event){
  event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
}
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
     this.org_id = sessionStorage.getItem('org_id')
    this.params = {
      page_number : this.page,
      data_per_page : this.tableSize
    }
    this.getDepartment(`page_number=${this.params.page_number}&data_per_page=${this.params.data_per_page}&pagination=TRUE&org_ref_id=${this.org_id}`); 
    this.enabled = true;
    this.getUserControls()
  }
  getUserControls(){
    this.user_id = sessionStorage.getItem('user_id')
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10&pagination=FALSE&organization_id=${this.org_id}`).subscribe((res:any)=>{
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
          if(element['DEPARTMENT']){
            this.permissions = element['DEPARTMENT']
          }
          
        });
      }
   
    })
   
    }
    filterSearch(){
      this.api.getData(`${environment.live_url}/${environment.org_department}?search_key=${this.term}&page_number=1&data_per_page=10&pagination=TRUE&org_ref_id=${this.org_id}`).subscribe((res:any) =>{
        if(res){
          this.allDepartmentList= res.result.data;
          const noOfPages:number = res['result'].pagination.number_of_pages
          this.count  = noOfPages * this.tableSize
        }
        else{
          this.api.showError('Error!')
        }
  
      },((error)=>{
        this.api.showError(error.error.error.message)
      }))
    }
  getDepartment(params){
    this.api.getDepartmentDetailsPage(params).subscribe((res:any) =>{
      if(res){
        this.allDepartmentList= res.result.data;
        const noOfPages:number = res['result'].pagination.number_of_pages
        this.count  = noOfPages * this.tableSize
      }
      else{
        this.api.showError('Error!')
      }

    },((error)=>{
      this.api.showError(error.error.error.message)
    }))
  }
  delete(id:any){
    this.api.deleteDepartmentDetails(id).subscribe((data:any)=>{
      this.ngOnInit();
      this.api.showWarning('Department deleted successfully!')
      this.ngOnInit()
    },((error)=>{
      this.api.showError(error.error.error.message)
    }))
    
  }
  cardId(selected):any{
    this.selectedId = selected.id;
    
   }
  deleteCard(id){
    this.delete(id)  
  }
  editCard(id){
    this.router.navigate([`/department/update/${id}/${this.page}/${this.tableSize}`])
  }
  onTableDataChange(event:any){
    this.page = event;
    this.getDepartment(`page_number=${this.page}&data_per_page=${this.tableSize}&pagination=TRUE&org_ref_id=${this.org_id}`);
  }  
  onTableSizeChange(event:any): void {
    this.tableSize = Number(event.target.value);
    this.count = 0
    // Calculate new page number
    const calculatedPageNo = this.count / this.tableSize
    
    if(calculatedPageNo < this.page){
      this.page = 1
    }
   
    this.getDepartment(`page_number=${this.page}&data_per_page=${this.tableSize}&pagination=FALSE&org_ref_id=${this.org_id}`);
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
