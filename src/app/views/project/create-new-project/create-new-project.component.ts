import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.scss']
})
export class CreateNewProjectComponent implements OnInit {
  isShown: boolean = false ; // hidden by default
  taskCategories: any = [];
  subTaskCategories: any = [];
  invalidDate: boolean = false;
  subTaskSetting:any ={}
  taskName: any = [];


  toggleShow() {
  
  this.isShown = ! this.isShown;
  
  }
  isGroupShown: boolean = false ; 
  isListShown: boolean = true ; 


  toggleGroupShow() {
  
  this.isGroupShown = ! this.isGroupShown;
  this.isListShown = ! this.isListShown;
  
  }
  
  projectForm : FormGroup

  allProject:any=[];
  project:any;

  allClientList:any=[];
  client:any;

  allPeopleGroup:any=[];
  peopleGroup:any;
  peopleListSetting = {};
  peopleGroupSetting = {};
  peopleId:any=[]
  taskList ={}
  allManager:any=[];
  reporting_manager:any;
  approver_manager:any;
  params={
    pagination:"FALSE"
  }

  constructor(private builder:FormBuilder, 
    private api: ApiserviceService,
    private datepipe:DatePipe,
    private location:Location
    ) { }
  

    goBack(event)
  {
      event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
    }
  ngOnInit(): void {
    this.getClient();
    this.getManager();
    this.getPeopleGroup();
    this.initForm();
    this.getCategory()
  }
  onChange(){
    this.projectForm.patchValue({
      p_closure_date:'' 
    }) 
  }
  initForm(){
    this.projectForm = this.builder.group({
      p_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      p_estimated_hours:['',[Validators.required]],
      p_estimated_cost:['',[Validators.required]],
      reporting_manager_ref_id:['',[Validators.required]],
      pc_ref_id: [''],
      p_status:['',[Validators.required]],
      p_description:['',[Validators.pattern(/^\S.*$/)]],
      p_start_date:['',[Validators.required]],
      p_closure_date:['',[Validators.required]],
      approve_manager_ref_id:['',[Validators.required]],
      p_task_checklist_status:['',[Validators.required]],
      org_ref_id:[''],
      user_ref_id:[''],
      opg_ref_id:[''],
      p_code:[''],
      p_people_type:[''],
      people_ref_list:['',[Validators.required]],
      p_activation_status:[''],
      c_ref_id:['',[Validators.required]],
      project_related_task_list:['',[Validators.required]],
      task_project_category_list:['']
     
    })
  }
    noHyphenValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.includes('-')) {
        return { hyphen: true };
      }
      return null;
    };
  }
  get f(){
    return this.projectForm.controls;
  }
  getClient(){
   
    this.api.getClientDetails(this.params).subscribe((data:any)=>{
      if(data){
        this.allClientList= data.result.data;
      }
      else{
        //console.log('Error');
      }
     
    }

    )
  }
  onPeopleGroupSelect(event: any) {
    this.peopleId.push(event.id)
    
  }
  // onSingleSelect(event){
  //   this.taskName.push(event.id)
  // }
  // onSelectAll(event){
  //   event.forEach((element : any)  => {
  //     this.taskName.push(element.id)
  //   });
  //   //console.log(this.taskName)
  // }
  onPeopleGroupSelectAll(event: any) {
    event.forEach((element : any)  => {
      this.peopleId.push(element.id)
    });
    //console.log(this.peopleId)
  }
  getPeopleGroup(){
    this.peopleListSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'u_first_name',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.peopleGroupSetting = {
      singleSelection: true,
      idField: 'id',
      textField: 'u_first_name',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.api.getData(`${environment.live_url}/${environment.people_list}?page_number=1&data_per_page=2&pagination=FALSE`).subscribe((data:any)=>{
      if(data){
        this.allPeopleGroup = data.result.data;
      }
      else{
        //console.log('Error');
      }
      
    }

    )
  }
  getManager(){
    this.api.getManagerDetails(this.params).subscribe((data:any)=>{
      if(data){
        this.allManager= data.result.data;
      }
    
    }

    )
  }
 
  addProject(){
    this.projectForm.patchValue({people_ref_id:this.peopleId});
    
    const startDate = this.projectForm.value.p_start_date
    const EndDate   = this.projectForm.value.p_closure_date
    // this.projectForm.patchValue({project_related_task_list:this.subTaskValue})
    if(this.projectForm.invalid){
      this.api.showError('Invalid');
      this.projectForm.markAllAsTouched()
    }
    else{
      if(this.invalidDate == false){
        let data = {
          p_name:this.projectForm.value.p_name,
          p_estimated_hours:this.projectForm.value.p_estimated_hours,
          p_estimated_cost:this.projectForm.value.p_estimated_cost,
          reporting_manager_ref_id:this.projectForm.value.reporting_manager_ref_id,
          pc_ref_id:this.projectForm.value.pc_ref_id || this.projectForm.value.pc_ref_id,
          p_status:this.projectForm.value.p_status,
          p_description:this.projectForm.value.p_description,
          p_start_date:this.datepipe.transform(startDate,'dd/MM/yyyy'),
          p_closure_date:this.datepipe.transform(EndDate,'dd/MM/yyyy'),
          approve_manager_ref_id:this.projectForm.value.approve_manager_ref_id,
          p_task_checklist_status:this.projectForm.value.p_task_checklist_status,
          org_ref_id:this.projectForm.value.org_ref_id,
          user_ref_id:this.projectForm.value.user_ref_id,
          opg_ref_id:this.projectForm.value.opg_ref_id,
          p_code:this.projectForm.value.p_code,
          p_people_type:this.projectForm.value.p_people_type,
          people_ref_list:this.projectForm.value.people_ref_list,
          p_activation_status:this.projectForm.value.p_activation_status,
          c_ref_id:this.projectForm.value.c_ref_id,
          project_related_task_list:this.subTaskValue,
          task_project_category_list:[Number(this.projectForm.value.task_project_category_list)]
        }
        this.api.addProjectDetails(data).subscribe(res=>{
          if(res){
              this.projectForm.patchValue({
                p_name:'',
                p_estimated_hours:'',
                p_estimated_cost:'',
                reporting_manager_ref_id:'',
                pc_ref_id: '',
                p_status:'',
                p_description:'',
                p_start_date:'',
                p_closure_date:'',
                approve_manager_ref_id:'',
                p_task_checklist_status:'',
                org_ref_id:'',
                user_ref_id:'',
                opg_ref_id:'',
                p_code:'',
                p_people_type:'',
                people_ref_list:'',
                p_activation_status:'',
                c_ref_id:'',
                project_related_task_list:'',
                task_project_category_list:''
               })
            
            this.api.showSuccess('Project added successfully!');
           this.initForm()
          }
         else{
          this.api.showError('Error')
         }
          
        },(error =>{
          this.api.showError(error.error.error.message)
        })
      )
      }
      else{
        this.api.showWarning('Invalid date')
      }
      
    
    }
  }
  getCategory(){
    this.api.getData(`${environment.live_url}/${environment.taskProjectCategories}?page_number=1&data_per_page=2&pagination=FALSE`).subscribe(data=>{
    //console.log(data,"RESPONSE")
    this.taskCategories = data['result'].data
    })
  }
  getSubTask(event:any){
  
    this.api.getSubTaskByProjectTaskCategory(event.target.value).subscribe(
      (resp:any)=>{
        if(resp.result.data[0].task_list[0].task_name){
          this.subTaskCategories=resp.result.data[0].task_list
         // //console.log(resp.result.data[0].task_list,"TREEEEW");
        }
        
     //data.push(event.target.value)
    // debugger;
       this.projectForm.patchValue({task_project_category_list:event.target.value})
      },
      (error:any)=>{
        //console.log(error);

      }
    )
    
  }
  subTaskValue:any
  subTask(event:any){
    this.subTaskValue=this.subTaskCategories.filter(x => x.task_name ===event.target.value)
  }
  yearEndDateValidator():any {
    const StartDate = new Date(this.projectForm.get('p_start_date').value).getTime() / (1000 * 60);
    
    const EndDate = new Date(this.projectForm.get('p_closure_date').value).getTime() / (1000 * 60);
    if(StartDate > EndDate ){
      this.invalidDate = true;
      //console.log(StartDate > EndDate,'true')
    }
    else{
      this.invalidDate = false;
    }
  }
}
