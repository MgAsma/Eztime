import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder} from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-update-tag',
  templateUrl: './update-tag.component.html',
  styleUrls: ['./update-tag.component.scss']
})
export class UpdateTagComponent implements OnInit {
  id:any;
  page: string;
  tableSize: string;

  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService, 
    private route:ActivatedRoute,
    private router:Router,
    private location:Location
    ) { 
    this.id =this.route.snapshot.paramMap.get('id')
    this.page = this.route.snapshot.paramMap.get('page')
    this.tableSize = this.route.snapshot.paramMap.get('tableSize')
   
    
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  updateForm= this.builder.group({
    tag_name:['',[Validators.pattern(/^[a-zA-Z]+$/),Validators.required]],
    tage_status:['',Validators.required],
  })
  ngOnInit(): void {
    this.edit();
  }
  get f(){
    return this.updateForm.controls;
  }
  edit(){
    let params = {
      page_number:this.page,
      data_per_page:this.tableSize
  }
    this.api.getCurrentTagCategoryDetails(this.id,params).subscribe((data:any)=>{
      this.updateForm.patchValue({tag_name:data.result.data[0].tag_name,
        tage_status:data.result.data[0].tage_status})
    })
  }
  update(){
   this.api.updateTagCategory(this.id,this.updateForm.value).subscribe(response=>{
    if(response){
      this.api.showSuccess('Tag updated successfully!!');
      this.updateForm.reset();
      this.router.navigate(['people/tag-list'])
     }
    else{
      this.api.showError('Error!')
    }  
    },(error =>{
      this.api.showError(error.error.error.message)
    })
  )
  }

}
