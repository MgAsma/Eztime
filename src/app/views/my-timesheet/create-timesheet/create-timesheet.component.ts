import { Component, OnInit ,ViewChild} from '@angular/core';
import {  Validators, FormBuilder,FormGroup, FormArray } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-timesheet',
  templateUrl: './create-timesheet.component.html',
  styleUrls: ['./create-timesheet.component.scss']
})
export class CreateTimesheetComponent implements OnInit {
  @ViewChild('myModal') public myModal;

  timeSheetForm! : FormGroup
  task1:any;
  allClient:any=[];
  client:any;

  allProject:any=[];
  project:any;

  allTask:any=[];
  task:any;
  params = {
    pagination:"FALSE"
  }
  time_spent:any=[]
  createdtasks: FormArray<any>;
  currDate: Date;
  userId: any;
  manager_id: any;
  client_id: any;
  project_id: any;
  allData: any = [];
  projectList: any =[];
  taskList: any = [];
  timeList: any = [];
  orgId: any;
  allPeopleGroup: any = [];
  peopleId: any = [];
  ccSetting: { singleSelection: boolean; idField: string; textField: string; itemsShowLimit: number; allowSearchFilter: boolean; };
  user_role_name: any;

  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private datepipe:DatePipe,
    private location:Location) {
      this.user_role_name = sessionStorage.getItem('user_role_name')
     }

  ngOnInit(): void {
    this.orgId = sessionStorage.getItem('org_id') 
    this.userId = JSON.parse(sessionStorage.getItem('user_id'))
    this.manager_id = JSON.parse(sessionStorage.getItem('manager_id'))
     this.currDate = new Date()
     this.initForm();
    this.getPeopleGroup()
    this.getClient();
     this.addTask();
     
  }
  initForm(){
    this.timeSheetForm = this.builder.group({
      reportingManagerRef:[''],
      response: this.builder.array([])
    });
  }
 goBack(event)
  {
  event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
}
  
  get f(){
    return this.timeSheetForm.controls;
  }
  getClient(){
    this.api.getClientDetails(this.params,this.orgId).subscribe((data:any)=>{
      if(data){
        this.allClient = data.result.data;
        //console.log(this.allClient,'CLIENTLIST')
      }
      else{
        //console.log('Error');
      }
      
    }
    )
  }
  
  addTimeSheet(){
    if(this.timeSheetForm.invalid){
      this.api.showError('Invalid!')
      this.timeSheetForm.markAllAsTouched()
    }
    else{
      let date = new Date()
      const selectedArr = this.timeSheetForm.value.response.map(obj => {
        const { projectList, taskList,time, ...rest } = obj;
        return rest;
      });
      
     // console.log(selectedArr, "SELECTED");
     let managerId:any;
     if(this.user_role_name === 'ADMIN' || this.user_role_name === 'MANAGER' ){
      managerId = this.peopleId
     }else{
      managerId = this.manager_id 
     }
     
      console.log( this.peopleId,"fsfsd")
      let data = {
        created_by:this.userId,
        reporting_manager_ref:managerId ,
        user_id:this.userId,
        status:'YET_TO_APPROVED',
        module:"TIMESHEET",
        menu:"PEOPLE_TIMESHEET",
        method:"CREATE",
        date: this.datepipe.transform(date,'dd/MM/yyyy'),
        timesheet_status:"YET_TO_APPROVED",
        response:selectedArr,
        organization_id:this.orgId
      }
     
      this.api.addTimeSheet(data).subscribe(
        response=>{
          if(response){
            this.api.showSuccess('Time sheet added successfully!!');
            this.timeSheetForm= this.builder.group({
              response: this.builder.array([])
            });
            this.addTask()
          }
          else{
            this.api.showError('Error!')
          } 
        }
      
      )
    }
  }
  onPeopleSelect(event: any) {
    this.peopleId = event.id;
  }
  onPeopleSelectAll(event: any) {
    event.forEach((element: any) => {
      this.peopleId.push(element.id);
    });
    //console.log(this.peopleId)
  }
  getPeopleGroup() {
    this.ccSetting = {
      singleSelection: true,
      idField: 'id',
      textField: 'u_first_name',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.api
      .getData(
        `${environment.live_url}/${environment.people_list}?page_number=1&data_per_page=2&pagination=FALSE&organization_id=${this.orgId}`
      )
      .subscribe(
        (data: any) => {
          if (data) {
            this.allPeopleGroup = data.result.data;
          }
        },
        (error) => {
          this.api.showError(error.error.error.message);
        }
      );
  }
createTask(): FormGroup {
  return this.builder.group({
    client_id: ['',Validators.required],
    project_id: ['',Validators.required],
    projectList:[],
    taskList:[],
    time:[],
    reportingManagerRef:[],
    description: ['',[Validators.pattern(/^\S.*$/)]],
    task_id: ['',Validators.required],
    time_spent: ['',Validators.required],
  });
}

addTask(): void {
  this.createdtasks = this.timeSheetForm.get('response') as FormArray;
  this.createdtasks.push(this.createTask());
}

removeTask(index: number): void {
  this.createdtasks = this.timeSheetForm.get('response') as FormArray;
  this.createdtasks.removeAt(index);
}
get mytask(){
  return this.timeSheetForm.get('response') as FormArray
}

getProject(event, index){
  this.client_id = event
  this.api.getData(`${environment.live_url}/${environment.get_time_sheet_values}?client_id=${event}`).subscribe((res:any)=>{
    if(res){
      this.allProject = res.data
      this.projectList = [...this.allProject]
      this.createdtasks.at(index).patchValue({projectList: this.projectList})
      // ----------------
    }
    else{
      this.api.showError('ERROR!')
    }
  },(error =>{
    this.api.showError(error.error.error.message)
  }))
}
getTask(event,index){
  this.project_id = event
  this.api.getData(`${environment.live_url}/${environment.get_time_sheet_values}?client_id=${this.client_id}&project_id=${event}`).subscribe((res:any)=>{
    if(res){
     this.allTask = res.data[0].project_related_task_list
     this.taskList = [...this.allTask]
      //console.log(res.data.project_related_task_list,"RESPONSETASK n/----------------")
      this.createdtasks.at(index).patchValue({taskList: this.taskList})
    }
    else{
      this.api.showError('ERROR!')
    }
  },(error =>{
    this.api.showError(error.error.error.message)
  })) 
}
getTimeSpent(event,index){
  //console.log(event)
  this.api.getData(`${environment.live_url}/${environment.get_time_sheet_values}?client_id=${this.client_id}&project_id=${this.project_id}&task_name=${event}`).subscribe((res:any)=>{
    if(res){
     this.time_spent = res
     this.timeList = [...this.time_spent]
      //console.log(res,"TIMESPENT n/----------------")
      this.createdtasks.at(index).patchValue({time: this.timeList})
    }
    else{
      this.api.showError('ERROR!')
    }
  },(error =>{
    this.api.showError(error.error.error.message)
  })) 
}
}
