import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { DatePipe } from '@angular/common';
import { error } from 'console';
import { environment } from 'src/environments/environment';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-create-people',
  templateUrl: './create-people.component.html',
  styleUrls: ['./create-people.component.scss']
})
export class CreatePeopleComponent implements OnInit {
  peopleForm : FormGroup
  BreadCrumbsTitle:any='Create employee';
  allDepartment:any=[];
  department:any;

  allRole:any=[];
  role:any;

  allReportingManager:any=[];
  reportingManager:any;

  allCenter:any=[];
  center:any;

  allPrefix:any=[];
  prefix:any;

  allTag:any=[];
  tag:any;
  tagSetting = {};
  tagId:any=[]
  
  uploadFile:any;
  url:any;
  fileUrl:any;

  startDate:any
  params = {
    pagination:"FALSE"
  }
//  centerId:any;
  allCostCenter: any = [];
  organizationList: any = [];
  user_id: string;
  org_id: any;
  
  changeYearStartDate(event:any){
   
    this.startDate =this.datepipe.transform( event.target.value,'dd/MM/yyyy')
    //console.log(event.target.value, this.startDate)
  }
  constructor(private builder:FormBuilder, private api: ApiserviceService,
    private datepipe:DatePipe,private common_service:CommonServiceService) {
    this.org_id = sessionStorage.getItem('org_id')
   }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.getAllRoleandDepartment()
    //this.centerId = sessionStorage.getItem('center_Id')
  }
  getAllRoleandDepartment(){
    this.getRole();
    this.getDepartment();
    this.getReportingManager();
    this.getCenter();
    this.getCostCenter()
    // this.getPrefix();
    this.getTag();
    this.user_id = sessionStorage.getItem('user_id')
    
    this.getOrgDetails(`&page_number=1}&data_per_page=2&pagination=FALSE`)
    this.initForm()
   
  }
  initForm(){
    this.peopleForm= this.builder.group({
      // prefix_suffix_id:['',[Validators.required]],
      u_email:['',[Validators.required, Validators.email]],
      department_id:['',[Validators.required]],
      u_first_name:['',[Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]],
      user_role_id:['',[Validators.required]],
      org_role_id:[1],
      u_last_name:['',[Validators.required,Validators.pattern(/^[a-zA-Z]+$/)]],
      user_reporting_manager_ref_id:['',[Validators.required]],
      u_gender:['',[Validators.required]],
      cost_center_id:['',[Validators.required]],
      u_marital_status:['',[Validators.required]],
      u_designation:['',[Validators.required]],
      u_date_of_joining:['',[Validators.required]],
      tags:['',[Validators.required]],
      profile_base64:['',[Validators.required,,this.fileFormatValidator]],
      center_id:['',Validators.required],
      u_status:['',Validators.required],
      u_org_code:['12345',Validators.required],
      })
  }
 
  fileFormatValidator(control: AbstractControl): ValidationErrors | null {
    const allowedFormats = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
    const file = control.value;
    if (file) {
      const fileExtension = file.substr(file.lastIndexOf('.')).toLowerCase();
      if (!allowedFormats.includes(fileExtension)) {
        return { accept: true };
      }
    }
    return null;
  }
  get f(){
    return this.peopleForm.controls;
  }
  uploadImageFile(event:any){
    this.uploadFile=  event.target.files[0];
    if(event.target.files && event.target.files[0]){
      const reader =new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event:any)=>{
        this.url = event.target.result;
        this.fileUrl= reader.result
        this.peopleForm.patchValue({profile_base64:this.fileUrl})
        ////console.log(this.fileUrl)

      }
    }
  }
 
  getRole(){
   let params = `page_number=1&data_per_page=2&pagination=FALSE&organization_id=${this.org_id}`
    this.api.getUserAccess(params).subscribe((data:any)=>{
      if(data.result.data){
        const role = data.result.data
        const filteredRole = role.filter(role => role.role_status !== 'Inactive')
        this.allRole = filteredRole;
      }
    
     },(error:any)=>{
      this.api.showError(error.error.error.message)  
      //console.log(error,"ERROR")
    }
    
    )
  }
 
  getDepartment(){
    this.api.getDepartmentDetails(this.params,this.org_id).subscribe((data:any)=>{
      if(data){
        const department = data.result.data
        const filteredDepartment = department.filter(depart => !depart.od_status.includes('Inactive'))
        this.allDepartment = filteredDepartment;
        }
      },(error:any)=>{
        this.api.showError(error.error.error.message)  
        //console.log(error,"ERROR")
      }
    )
  }
  getReportingManager(){
    this.api.getManagerDetails(this.params,this.org_id).subscribe((data:any)=>{
      if(data.result.data){
        const reportingManager = data.result.data
        const filteredRepotingManager = reportingManager.filter(manager => !manager.u_status?.includes('Inactive'))
        this.allReportingManager = filteredRepotingManager;
      }
     
    },(error:any)=>{
      this.api.showError(error.error.error.message)  
      //console.log(error,"ERROR")
    }
    )
  }
  getTag(){
    this.tagSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'tag_name',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      unSelectAllText:'Un Select All'
    };
    this.api.getTagDetails(this.params,this.org_id).subscribe((data:any)=>{
      if(data.result.data){
        const tags = data.result.data
        const filteredTags = tags.filter(tags => !tags.tage_status.includes('Inactive'))
        this.allTag = filteredTags;
      }
    },(error:any)=>{
      this.api.showError(error.error.error.message)  
      //console.log(error,"ERROR")
    }
   )
  }

  getCostCenter(){
    this.api.getCostCenterDetails(this.params).subscribe((data:any)=>{
      //console.log(data.result.data,"COST")
      if(data.result.data){
        const costCenter = data.result.data
        const filterdCostCenter = costCenter.filter(cc => !cc.occ_status?.includes('Inactive'))
        this.allCostCenter = filterdCostCenter;
        }
       },(error:any)=>{
        this.api.showError(error.error.error.message)  
        //console.log(error,"ERROR")
      }
    )
  }
  getCenter(){
    this.api.getCenterDetails(this.params,this.org_id).subscribe((data:any)=>{
      if(data.result.data){
        const center = data.result.data;
        const filteredCenter = center.filter(center => !center.center_status?.includes('Inactive'))
        this.allCenter = filteredCenter;
        console.log(this.allCenter,"CENTER ID")
        }
    },(error:any)=>{
      this.api.showError(error.error.error.message)  
      //console.log(error,"ERROR")
    })
  }
  getPrefix(){
    this.api.getPrefixSuffixDetails(this.params,this.org_id).subscribe((data:any)=>{
      if(data.result.data){
        this.allPrefix= data.result.data;
      } 
    },(error:any)=>{
      this.api.showError(error.error.error.message)  
      //console.log(error,"ERROR")
    }
   
    )
  }
  onTagSelect(event: any) {
    //console.log(event)
    this.tagId.push(event.id)
    this.f['tags'].markAsUntouched()
  }
  onTagSelectAll(event: any) {
    event.forEach((element : any)  => {
      this.tagId.push(element.id)
    });
  }
  onItemDeSelect(item: any) {
    if(this.tagId.length >1){
    const index = this.tagId.indexOf(item.id)
    const newArr = this.tagId.splice(index,1)
    }
    else{
      this.tagId = []
      this.f['tags'].markAllAsTouched()
    }
 }
  onItemDeSelectAll(item:any){
    if(item){
      this.tagId = []
      this.f['tags'].markAllAsTouched()
    }  
  }
  
  getOrgDetails(pagination){
    this.api.getData(`${environment.live_url}/${environment.organization}?id=${this.user_id}${pagination}`).subscribe(res=>{
      if(res){
       this.organizationList = res['result']['data']
       console.log(this.organizationList,"ORG LIST")
      }
    },(error =>{
      this.api.showError(error.error.error.message)
    }))
  }
  addPeople(){
    this.peopleForm.patchValue({tags:this.tagId});
    
    if(this.peopleForm.invalid){
      this.api.showError('Invalid')
      this.peopleForm.markAllAsTouched()
    }
    else{
   // console.log(this.peopleForm.value.user_role_id,"USER ROLE ID")
     let data =  {
        // prefix_suffix_id: this.peopleForm.value.prefix_suffix_id,
        u_email: this.peopleForm.value.u_email,
        department_id:this.peopleForm.value.department_id,
        u_first_name: this.peopleForm.value.u_first_name,
        user_role_id: this.peopleForm.value.user_role_id,
        org_role_id: this.peopleForm.value.org_role_id,
        u_last_name:this.peopleForm.value.u_last_name,
        user_reporting_manager_ref_id:this.peopleForm.value.user_reporting_manager_ref_id,
        u_gender: this.peopleForm.value.u_gender,
        cost_center_id: this.peopleForm.value.cost_center_id,
        u_marital_status: this.peopleForm.value.u_marital_status,
        u_designation:this.peopleForm.value.u_designation,
        u_date_of_joining:this.startDate,
        tags: this.tagId,
        profile_base64:this.peopleForm.value.profile_base64,
        center_id:this.peopleForm.value.center_id,
        u_status: this.peopleForm.value.u_status,
        u_org_code:this.peopleForm.value.u_org_code,
        organization_id:this.peopleForm.value.organization_id
    }
      this.api.addPeopleDetails(data).subscribe(
        response=>{
          if(response){
            this.api.showSuccess('People Added Successfully');
            this.peopleForm.reset();
            this.initForm()
            
            }
          else{
            this.api.showError('Error')
          }
        },error =>{
          this.api.showError(error.message)
      }
       
      )
    }
  }
  
}
