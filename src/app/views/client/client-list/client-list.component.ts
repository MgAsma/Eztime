import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { SortPipe } from 'src/app/sort/sort.pipe';
import { ApiserviceService } from '../../../service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';
import { error } from 'console';
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  providers: [
    SortPipe
]
})
export class ClientListComponent implements OnInit {

  allClientList=[];
  currentIndex = 1;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];
  
  term:any;
  slno:any;
  code:any;
  name:any;
  industry:any;
  type:any;
  contact_person:any;
  project:any;
  date:any;
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
    this.getClient();
    this.enabled = true
    // const accessAction = JSON.parse(sessionStorage.getItem('permissionArr'));

    // if (accessAction.length) {
    //   accessAction.forEach((res) => {
    //    console.log(res.module_name, res.permissions, "RESP");
    //     if (res.module_name === 'CLIENTS') {
    //       this.permissions = res.permissions['CLIENTS'];
    //    //   console.log(this.permissions, "Permissions for CLIENTS");
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
          if(element['CLIENTS']){
            this.permissions = element['CLIENTS']
          }
          
        });
        
      }
   
    })
    }
    filterSearch(){
      this.api.getData(`${environment.live_url}/${environment.clients}?search_key=${this.term}&page_number=1&data_per_page=10`).subscribe((res:any)=>{
        if(res){
          this.allClientList= res.result.data;
            const noOfPages:number = res['result'].pagination.number_of_pages
            this.count  = noOfPages * this.tableSize
        }
        },((error:any)=>{
          this.api.showError(error.error.error.message)
        }))
    }
  getClient(){
    let params = {
      page_number:this.page,
      data_per_page:this.tableSize
  }
    this.api.getClientDetailsPage(params).subscribe((data:any)=>{
      //console.log(data,"TEST")
      if(data){
        this.allClientList= data.result.data;
          // let add:string = '0'
          // let tableCount:string = data['result'].pagination.number_of_pages
          // this.count = Number(tableCount+add);
          const noOfPages:number = data['result'].pagination.number_of_pages
          this.count  = noOfPages * this.tableSize
      }
     else{
      this.api.showError('ERROR !')
     }
      
    }
    

    )
  }
  delete(id:any){
    this.api.deleteClientDetails(id).subscribe((data:any)=>{
      if(data){
        this.ngOnInit();
        this.api.showWarning('Client deleted successfully!!')
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
    this.router.navigate([`/client/update/${id}/${this.page}/${this.tableSize}`])
  }
  onTableDataChange(event:any){
    this.page = event;
    this.getClient();
  }  
  onTableSizeChange(event:any): void {
    this.tableSize = Number(event.target.value);
    this.count = 0
    // Calculate new page number
    const calculatedPageNo = this.count / this.tableSize
    
    if(calculatedPageNo < this.page){
      this.page = 1
    }
    this.getClient();
  }  
  arrow:boolean=false
  directionValue:any='asc'




  sortValue:any='c_name'
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
