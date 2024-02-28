import { Component, OnInit } from '@angular/core';
import {  Validators, FormBuilder,FormGroup, FormArray, FormControl } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {
  id:any;
  isShown: boolean = false ; // hidden by default
  peopleId: any =[];
  page: string;
  tableSize: string;
  params={
    pagination:'FALSE'
  }
  taskCategories: any = [];
  subTaskCategories: any =[];
  updateForm: FormGroup;
  invalidDate: boolean = false;
  url: any;

  taskName: any = [];
  subTaskValue: any;
  org_id: any;
  tasks = []
  status= [
    {value: 'open', viewValue: 'Open'},
    {value: 'inprogress', viewValue: 'Inprogress'},
    {value: 'completed', viewValue: 'Completed'},
    {value: 'pending', viewValue: 'Pending'},
  ];
  toggleShow() {
  this.isShown = !this.isShown; 
  }
  isGroupShown: boolean = false ; 
  isListShown: boolean = true ; 
  toggleGroupShow() { 
  this.isGroupShown = ! this.isGroupShown;
  this.isListShown = ! this.isListShown; 
  }

  allClientList:any=[];
  client:any;

  allPeopleGroup:any=[];
  peopleGroup:any;

  allManager:any=[];
  reporting_manager:any;
  approver_manager:any;
  peopleListSetting = {};
  peopleGroupSetting = {};
  subTaskSetting:any ={};
  taskForm: FormGroup;
  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService, 
    private route:ActivatedRoute,
    private datepipe:DatePipe,
    private router:Router,
    private location:Location
    ) { 
    this.id =this.route.snapshot.paramMap.get('id')
    this.page = this.route.snapshot.paramMap.get('page')
    this.tableSize = this.route.snapshot.paramMap.get('tableSize')
    
  }
  onChange(){
    this.updateForm.patchValue({
      p_closure_date:'' 
    }) 
  }
  goBack(event)
  {
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  initForm(){
    this.updateForm= this.builder.group({
      p_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      // p_status:['',Validators.required],
      c_ref_id:['',[Validators.required]],
      p_description:['',[Validators.pattern(/^\S.*$/)]],
      p_start_date:['',[Validators.required]],
      p_closure_date:['',[Validators.required]],
      p_estimated_hours:['',[Validators.required]],
      p_estimated_cost:['',[Validators.required]],
      reporting_manager_ref_id:['',[Validators.required]],
      approve_manager_ref_id:['',[Validators.required]],
      p_task_checklist_status:[''],
        pc_ref_id: [''],
        user_ref_id:[''],
        opg_ref_id:[''],
        p_code:[''],
        p_people_type:[''],
        people_ref_list:['',Validators.required],
        p_activation_status:[''],
        project_related_task_list:['',[Validators.required]],
        task_project_category_list:['']
        
    })
  }
  
  ngOnInit(): void {
    this.org_id = sessionStorage.getItem('org_id')
    this.subTaskCategories = []
     this.subTaskSetting ={
      singleSelection: false,
      idField: 'task_name',
      textField: 'task_name',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
    this.initForm()
    this.getClient();
    this.getManager();
    this.getPeopleGroup();
    this.getCategory();
    this.edit();
    this.taskForm = this.builder.group({
      subTasks: this.builder.array([])
    });
   
    // Optionally, you can add an initial empty task
    this.addTask();
  }
  get subTasks(): FormArray {
    return this.taskForm.get('subTasks') as FormArray;
  }

  createSubTask(): FormGroup {
    return this.builder.group({
      taskName: '',
      status: '',
      assignee: ''
    });
  }

  addTask(): void {
    this.subTasks?.push(this.createSubTask());
  }

  removeTask(index: number): void {
    this.subTasks.removeAt(index);
  }
  get f(){
    return this.updateForm.controls;
  }
  startDate:any
  endDate:any
  changeYearStartDate(event:any){
    this.startDate = event.target.value
  }
  changeYearEndDate(event:any){
    this.endDate = event.target.value
  }
  edit(){
    let params = {
      page_number:this.page,
      data_per_page:this.tableSize,
      organization_id:this.org_id
      }
       this.api.getCurrentProjectDetails(this.id,params).subscribe((data:any)=>{
      this.startDate = this.datepipe.transform(data.result.data[0].p_start_date *1000,'yyyy-MM-dd')
      this.endDate = this.datepipe.transform(data.result.data[0].p_closure_date *1000,'yyyy-MM-dd')
      this.getSubTask(data.result.data[0].p_task_checklist_status,'TS')
      this.updateForm.patchValue({
        p_status:data.result.data[0].p_status,
        p_name:data.result.data[0].p_name,
        c_ref_id:data.result.data[0].c_ref_id,
        p_description:data.result.data[0].p_description,
        p_start_date:this.datepipe.transform(data.result.data[0].p_start_date *1000,'yyyy-MM-dd'),
        p_closure_date:this.datepipe.transform(data.result.data[0].p_closure_date *1000,'yyyy-MM-dd'),
        p_estimated_hours:data.result.data[0].p_estimated_hours,
        p_estimated_cost:data.result.data[0].p_estimated_cost,
        reporting_manager_ref_id:data.result.data[0].reporting_manager_ref_id,
        approve_manager_ref_id:data.result.data[0].approve_manager_ref_id,
        p_task_checklist_status:data.result.data[0].p_task_checklist_status,
        people_ref_list:data.result.data[0].pc_ref_id == null ? data.result.data[0].people_ref_list :data.result.data[0].pc_ref_id ,
        task_project_category_list:data.result.data[0].task_project_category_list,
        project_related_task_list:data.result.data[0].project_related_task_list_converted
      })
      let subTasksArray: any = [];
      let removedItem = [];
      data.result.data[0].project_related_task_list.forEach((item: any) => {
        if (item) {
          subTasksArray.push(item);
        }
      });
     
       
        const subTasksVal:any = this.taskForm.get('subTasks') as FormArray;
        if(subTasksArray.length > 2){
          removedItem = subTasksArray.slice(1);
            subTasksVal.removeAt(0);
           
          
          removedItem.forEach((task: any) => {
            
            subTasksVal.push(this.builder.group({
              taskName: task.taskName,
              status:task.status,
              assignee:task.assignee
              // Add more form controls as needed
            }));
          });
        }
        else{
          if(subTasksArray.length > 1){
            removedItem = subTasksArray.slice(1);
           
            subTasksVal.removeAt(0);
            subTasksVal.push(this.builder.group({
              taskName: removedItem[0]['taskName'],
              status:removedItem[0]['status'],
              assignee:removedItem[0]['assignee']
              // Add more form controls as needed
            }));
        }
       
      }
    })
   
  
  }
  getClient(){
    this.api.getClientDetails(this.params,this.org_id).subscribe((data:any)=>{
      this.allClientList = data.result.data;
    }
    )
  }
  getPeopleGroup(){
    this.peopleListSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'u_first_name',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  
    this.api.getData(`${environment.live_url}/${environment.people_list}?page_number=1&data_per_page=2&pagination=FALSE&organization_id=${this.org_id}`).subscribe((data:any)=>{
      if(data){
        this.allPeopleGroup = data.result.data;
      }
      else{
        //console.log('Error');
      }
      
    },((error)=>{
      this.api.showError(error.error.error.message)
    })

    )
  }
  getManager(){
    this.api.getManagerDetails(this.params,this.org_id).subscribe((data:any)=>{
      this.allManager= data.result.data;
    }

    )
  }
  getCategory(){
    this.api.getData(`${environment.live_url}/${environment.taskProjectCategories}?page_number=1&data_per_page=2&pagination=FALSE&org_ref_id=${this.org_id}`).subscribe(data=>{
    //console.log(data,"RESPONSE")
    this.taskCategories = data['result'].data
    })
  }
  selectedTask = []
  update(){
    if(this.updateForm.invalid){
     this.updateForm.markAllAsTouched()
    }else{
      //this.tasks.push(this.updateForm.value.project_related_task_list)
      console.log(this.tasks,"TASK")
      this.subTask(this.updateForm.value.project_related_task_list)
     this.selectedTask.push(this.subTaskValue,this.taskForm.value)
     let flattenedData = this.selectedTask.flatMap(item => {
     
      if (Array.isArray(item)) {
        
          return item.flat(); // Flatten inner arrays
      } else if (item.subTasks) {
        
          return item.subTasks; // Extract subTasks objects
      } else {
       
          return [item]; // Return single objects

      }
  });
  // console.log(flattenedData,"flattenedData")
     this.startDate = this.updateForm.value.p_start_date
     this.endDate  = this.updateForm.value.p_closure_date
     let data = {
        p_name:this.updateForm.value.p_name,
        p_status:this.updateForm.value.p_status,
        c_ref_id:this.updateForm.value.c_ref_id,
     //   people_ref_id:this.updateForm.value.people_ref_id,
        p_description:this.updateForm.value.p_description,
        p_start_date:this.datepipe.transform(this.startDate,'dd/MM/yyyy'),
        p_closure_date:this.datepipe.transform(this.endDate,'dd/MM/yyyy'),
        p_estimated_hours:this.updateForm.value.p_estimated_hours,
        p_estimated_cost:this.updateForm.value.p_estimated_cost,
        reporting_manager_ref_id:this.updateForm.value.reporting_manager_ref_id,
        approve_manager_ref_id:this.updateForm.value.approve_manager_ref_id,
        p_task_checklist_status:this.updateForm.value.p_task_checklist_status,
          pc_ref_id: this.updateForm.value.pc_ref_id,
          org_ref_id:this.org_id,
          user_ref_id:this.updateForm.value.user_ref_id,
          opg_ref_id:this.updateForm.value.opg_ref_id,
          p_code:this.updateForm.value.p_code,
          p_people_type:this.updateForm.value.p_people_type,
          people_ref_list:this.updateForm.value.people_ref_list,
          p_activation_status:this.updateForm.value.p_activation_status,
          project_related_task_list:flattenedData,
          task_project_category_list:[Number(this.updateForm.value.task_project_category_list)]
      }
      console.log(this.subTaskValue,this.subTaskValue.length,this.updateForm.value.project_related_task_list.length,'LENGTH--------------')
      if(this.updateForm.value.people_ref_list !== '' && this.updateForm.value.project_related_task_list.length > 0){
        this.api.updateProject(this.id,data).subscribe(response=>{
           
            if(response){
              this.api.showSuccess('Project updated successfully!');
              this.router.navigate(['/project/list'])
  
            }
            else{
              this.api.showError('Error!')
            }
           
          },((error:any)=>{
            this.api.showError(error?.error.error.message)
          })
       
        )
      }
      else{
        if(this.subTaskValue.length < 0){
          this.updateForm.patchValue({
            project_related_task_list:''
          })
          this.updateForm.markAllAsTouched()
        }
         
        this.updateForm.markAllAsTouched()
      }
     
    }
  
  }
  onPeopleGroupSelect(event: any) {
    //console.log(event)
    this.peopleId.push(event.id)
  }
  onPeopleGroupSelectAll(event: any) {
    event.forEach((element : any)  => {
      this.peopleId.push(element.id)
    });
  }
  getSubTask(event,data):any{
    // console.log(event,'))))))))))))))))))))))))))))))))))))))')
    this.subTaskCategories = []
    
    this.updateForm.patchValue({
      project_related_task_list:''
    })

    this.api.getSubTaskByProjectTaskCategory(event,this.org_id).subscribe(
      (resp:any)=>{
          this.subTaskCategories = resp.result.data[0].task_list
        },
      (error:any)=>{
        this.api.showError(error.error.error.message)
      }
    )
    
  }

  subTask(event:any){
    if(event){
      this.subTaskValue=this.subTaskCategories.filter((x,i) => x.task_name == event)
    }
  
  }
  yearEndDateValidator():any {
    this.endDate = this.updateForm.get('p_closure_date').value
    const StartDate = new Date(this.updateForm.get('p_start_date').value).getTime() / (1000 * 60);
    
    const EndDate = new Date(this.updateForm.get('p_closure_date').value).getTime() / (1000 * 60);
    if(StartDate > EndDate ){
      this.invalidDate = true;
      //console.log(StartDate > EndDate,'true')
    }
    else{
      this.invalidDate = false;
    }
  }
}
