import { Component, OnInit } from '@angular/core';
import {   FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-prefix-suffix-list',
  templateUrl: './prefix-suffix-list.component.html',
  styleUrls: ['./prefix-suffix-list.component.scss']
})
export class PrefixSuffixListComponent implements OnInit {

  allPrefixSuffix=[];
  currentIndex = 1;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 100];


  term:any;
  slno:any;
  prefix:any;
  suffix:any;
  date:any;
  status:any;
  action:any;
  cards;
  selectedId: any;
  enabled: boolean = true;
  params: { page_number: number; data_per_page: number; };
  permissions: any;
  pagination={
    number_of_pages: 0,
    has_next: false
  }
  user_id: string;
  constructor(
    private modalService:NgbModal, 
    private api:ApiserviceService,
    private router:Router,
    private location:Location,
    private common_service:CommonServiceService) { }

    goBack(event)
  {
      event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
    }
  ngOnInit(): void {
    this.allPrefixSuffix =[]
    this.params = {
      page_number:this.page,
      data_per_page:this.tableSize
    }
    this.getPrefixSuffix(this.params);
    this.enabled = true;
    // const accessAction = JSON.parse(sessionStorage.getItem('permissionArr'));

    // if (accessAction.length) {
    //   accessAction.forEach((res) => {
    //    //console.log(res.module_name, res.permissions, "RESP");
    //     if (res.module_name === 'PEOPLE') {
    //       this.permissions = res.permissions['PREFIX/SUFFIX'];
    //    //   console.log(this.permissions, "Permissions for DEPARTMENT");
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
      
    }
  
    )
  
    this.common_service.permission.subscribe(res=>{
      const accessArr = res
      if(accessArr.length > 0){
        accessArr.forEach((element,i) => {
          if(element['PREFIX/SUFFIX']){
            this.permissions = element['PREFIX/SUFFIX']
          }  
        });
      }
      
    })
   
    }
  getPrefixSuffix(params){
    this.api.getPrefixSuffixDetailsPage(params).subscribe((data:any)=>{
      this.allPrefixSuffix   = data.result.data;
      const noOfPages:number = data['result'].pagination.number_of_pages
      this.count  = noOfPages * this.tableSize
    },(error=>{
      this.api.showError(error.error.error.message)
    })
      
    
    )
  }
  filterSearch(){
    this.api.getData(`${environment.live_url}/${environment.prefix_suffix}?search_key=${this.term}&page_number=1&data_per_page=10`).subscribe((data:any)=>{
      this.allPrefixSuffix   = data.result.data;
      const noOfPages:number = data['result'].pagination.number_of_pages
      this.count  = noOfPages * this.tableSize
    },(error=>{
      this.api.showError(error.error.error.message)
    })
      
    
    )
  }
  
  delete(id:any){
    this.api.deletePrefixSuffixDetails(id).subscribe((data:any)=>{
      if(data){
        this.api.showWarning('Prefix suffix deleted successfully!')
          this.allPrefixSuffix = []
          this.ngOnInit()
        } 
      },(error=>{
        this.api.showError(error.error.error.message)
      })
      )
  }
  
  cardId(selected):any{
    this.selectedId = selected.id;
   }
  deleteCard(id){
    this.delete(id)
  }
  editCard(id){
    this.router.navigate([`/people/updatePrefixSuffix/${id}/${this.page}/${this.tableSize}`])
  }
  onTableDataChange(event:any){
    this.page = event;
    let params = {
      page_number:this.page,
      data_per_page:this.tableSize
    }
    this.getPrefixSuffix(params);
  }  
  onTableSizeChange(event:any): void {
    this.tableSize = Number(event.target.value);
    // Calculate new page number
    const calculatedPageNo = this.count / this.tableSize
    
    if(calculatedPageNo < this.page){
      this.page = 1
    }
   let params = {
      page_number:this.page,
      data_per_page:this.tableSize
    }
    this.getPrefixSuffix(params);
  }  
  arrow:boolean=false
  directionValue:any='desc'




  sortValue:any='prefix'
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
  

  
}}
