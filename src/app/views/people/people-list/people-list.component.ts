import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss']
})
export class PeopleListComponent implements OnInit {
  currentIndex = 1;
  allPeople=[];
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];
  pNav:boolean = true;
  term:any;
  slno:any;
  people_name:any;
  designation:any;
  doj:any;
  role:any;
  center:any;
  photo:any;
  status:any;
  action:any;

  startDate:any
  selectedId: any;
  enabled: boolean = true;
  permissions: any = [];
  allRoleList: any = [];
  organizationList: any = [];
  user_id: any;
  params:any = { };
  org_id: any;
  constructor(
    private api:ApiserviceService,
    private router:Router,
    private modalService:NgbModal,
    private location:Location,
    private common_service:CommonServiceService
    ) { }
    
    goBack(event){
      event.preventDefault(); // Prevent default back button behavior
      this.location.back();
     }
  ngOnInit(): void {
    this.org_id = sessionStorage.getItem('org_id')
    this.getPeople();
    this.enabled = true;
   this.getUserControls()
  }
  getUserControls(){
    this.user_id = sessionStorage.getItem('user_id')
    this.api.getUserRoleById(`user_id=${this.user_id}&page_number=1&data_per_page=10&organization_id=${this.org_id}&pagination=FALSE`).subscribe((res:any)=>{
      if(res.status_code !== '401'){
        this.common_service.permission.next(res['data'][0]['permissions'])
      }
      else{
        this.api.showError("ERROR !")
      }
    }
  
    )
  
    this.common_service.permission.subscribe(res=>{
      const accessArr = res
      if(accessArr.length > 0){
        accessArr.forEach((element,i) => {
          if(element['PEOPLE']){
            this.permissions = element['PEOPLE']
          }
          
        });
      }
      
    })
   
    }
  
  changeYearStartDate(event:any){
    //console.log(event.target.value)
    this.startDate = event.target.value
  }
  isDate(value: any): boolean {
    // Convert the value to a Date object
    const date = new Date(value);
    // Check if the converted date is valid and not NaN
    return date instanceof Date && !isNaN(date.getTime());
  }
  
  
  getPeople(){
    let params = {
    page_number:this.page,
    data_per_page:this.tableSize,
    organization_id:this.org_id
    }
    this.api.getPeopleDetailsPage(params).subscribe((data:any)=>{
      this.allPeople = data.result.data;

      const noOfPages:number = data['result'].pagination.number_of_pages
      this.count  = noOfPages * this.tableSize
    },((error)=>{
      this.api.showError(error.error.error.message)
    })
    )
  }
  filterSearch(){
      this.api.getData(`${environment.live_url}/${environment.people_list}?search_key=${this.term}&page_number=1&data_per_page=10&pagination=TRUE&organization_id=${this.org_id}`).subscribe((data:any)=>{
        this.allPeople = data.result.data;
        const noOfPages:number = data['result'].pagination.number_of_pages
        this.count  = noOfPages * this.tableSize
      },((error)=>{
        this.api.showError(error.error.error.message)
      })
      )
  }
  delete(id:any){
    this.api.deletePeopleDetails(id).subscribe((data:any)=>{
      if(data){
        this.api.showWarning('People deleted successfully!')
          this.allPeople = []
          this.ngOnInit()
      }
    
    },((error:any)=>{
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
    this.router.navigate([`/people/updatePeople/${id}/${this.page}/${this.tableSize}`])
  }
  onTableDataChange(event:any){
    this.page = event;
    this.getPeople();
  }  
  onTableSizeChange(event:any): void {
    this.tableSize = Number(event.target.value);
    this.count = 0
    // Calculate new page number
    const calculatedPageNo = this.count / this.tableSize 
    if(calculatedPageNo < this.page){
      this.page = 1
    }
    this.getPeople();
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

  sortValue:any='u_first_name'
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
