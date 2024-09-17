import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-create-timesheet',
  templateUrl: './create-timesheet.component.html',
  styleUrls: ['./create-timesheet.component.scss']
})
export class CreateTimesheetComponent implements OnInit {
  BreadCrumbsTitle: any = 'My Timesheet';
  timeSheetForm!: FormGroup;
  createdProject!: FormArray;
  taskForm!: FormGroup; 
  userId = 195;
  manager_id = 195;
  orgId = 102;
  time_spent: any = [];
  timeList: any[] = [];
  project_id: any;
  allClient: any[] = [];
  client: any;
  allProject: any[] = [];
  project: any;
  allTask: any[] = [];
  currentIndex: any;
  client_id: any;
  projectList: any[] = [];
  taskList: any[] = [];
  params = {
    pagination: "FALSE"
  };
  isTaskForm: boolean = false;
  originalTaskData: any = [];
  isSaved: boolean = false;
  showSave: boolean = false;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  //remainingHours: number;

  constructor(
    private builder: FormBuilder,
    private api: ApiserviceService,
    private datepipe: DatePipe,
    private common_service: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.initializeForm();
    this.addProjectDetails(); 
    this.getClient();
  }

  expandPanel(matExpansionPanel: MatExpansionPanel, event: any) {
    event.stopPropagation();
    if (!this._isExpansionIndicator(event.target)) {
      matExpansionPanel.close();
    }
  }

  private _isExpansionIndicator(target: EventTarget | any): boolean {
    const expansionIndicatorClass = "mat-expansion-indicator";
    return (
      target.classList && target.classList.contains(expansionIndicatorClass)
    );
  }

  getRemainingHours(i: number): number {
    const totalHours = 8;
    const taskArray = this.getTaskArray(i);
    const spentHours = taskArray.controls.reduce((sum, task) => {
      const timeSpent = task.get('time_spent').value;
      return sum + (timeSpent ? parseFloat(timeSpent) : 0);
    }, 0);
    const remainingHours = totalHours - spentHours;
   // this.remainingHours = remainingHours;
    // return remainingHours > 0 ? remainingHours : 0;
    return remainingHours ;
  }

  initializeForm(): void {
    this.timeSheetForm = this.builder.group({
      response: this.builder.array([])
    });

    this.taskForm = this.builder.group({
      task_id: ['', Validators.required],
      time_spent: ['', Validators.required],
      isEditing: [false]
    });
  }

  createProjectDetails(): FormGroup {
    return this.builder.group({
      client_id: ['', Validators.required],
      project_id: ['', Validators.required],
      description: [''],
      timesheet_applied_datetime: ['', Validators.required],
      projectList: [],
      taskList: [],
      time: [],
      task_details: this.builder.array([]),
      showSave: [true],  // Add variable to control save button visibility
      isTaskForm: [true], // Add variable to control task form visibility
      isSaved:[false]
    });
  }
 
  enableAction(i){
    const projectGroup = this.getProjectControl(i);
    projectGroup.get('showSave').setValue(false);
  }
  openTaskForm(i) {
    const projectGroup = this.getProjectControl(i);
    projectGroup.get('isTaskForm').setValue(true);
   
  }

  addProjectDetails(): void {
    this.removeAllValidators()
    this.createdProject = this.timeSheetForm.get('response') as FormArray;
    
    const projectGroup = this.createProjectDetails();
    
    this.createdProject.push(projectGroup);
    this.isSaved = false;
    
  }
  removeAllValidators() {
    // Get the FormArray instance
    const tasksArray = this.timeSheetForm.get('response') as FormArray;
  
    // Remove validators from the FormArray itself
    tasksArray.clearValidators();
    tasksArray.updateValueAndValidity();
  
    // Remove validators from each FormGroup inside the FormArray
    tasksArray.controls.forEach(control => {
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(key => {
          const formControl = control.get(key);
          if (formControl) {
            formControl.clearValidators();
            formControl.updateValueAndValidity();
          }
        });
      }
    });
  }
  
  getProjectLength(): number {
    return (this.timeSheetForm.get('response') as FormArray).length;
  }

  addTaskToProject(projectIndex: number): void {
    const taskArray = this.getTaskArray(projectIndex);
    taskArray.push(this.builder.group({
      task_id: ['', Validators.required],
      time_spent: ['', Validators.required],
      isEditing: [false]
    }));
  }

  getTaskArray(projectIndex: number): FormArray {
    return this.createdProject.at(projectIndex).get('task_details') as FormArray;
  }

 
  editTask(projectIndex: number, taskIndex: number): void {
    const taskArray = this.getTaskArray(projectIndex);
    const taskFormGroup = taskArray.at(taskIndex) as FormGroup;
  
    const newTimeSpentValue = this.extractNumber(taskFormGroup.get('time_spent').value);
  
    // Get the original (old) time spent before editing
    const oldTimeSpentValue = this.extractNumber(this.originalTaskData[projectIndex][taskIndex]?.time_spent || 0);
  
    // Calculate the available hours by excluding the current task's old time_spent
    const availableHours = this.getRemainingHours(projectIndex) + oldTimeSpentValue;
  
    // console.log('Available Hours:', availableHours);
    // console.log('New Time Spent Value:', newTimeSpentValue);
  
    if (newTimeSpentValue > availableHours) {
      this.api.showError(`The selected hours (${newTimeSpentValue}) cannot exceed the available hours (${availableHours}).`);
    } else {
      // Update the task with the new value
      this.toggleTaskEditingState(projectIndex, taskIndex, false);
      
      // Replace the original value with the new value in the data
      this.originalTaskData[projectIndex][taskIndex] = taskFormGroup.value;
  
      this.timeSheetForm.markAsTouched();
    }
  }
  
  
  
  
  getProjectControl(index: number): FormGroup {
    return this.createdProject.at(index) as FormGroup;
  }
  saveTask(projectIndex: number): void {
    const projectGroup = this.getProjectControl(projectIndex);
    
    const taskArray = this.getTaskArray(projectIndex);
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
    } else {
      if (this.getRemainingHours(projectIndex) !== 0 && this.extractNumber(this.taskForm.get('time_spent').value) > this.getRemainingHours(projectIndex)) {
        this.api.showError(`You left only ${this.getRemainingHours(projectIndex)} hours`);
        projectGroup.get('isTaskForm').setValue(true);
      } else {
        projectGroup.get('isTaskForm').setValue(false);

        taskArray.push(this.builder.group(this.taskForm.value));
        this.resetTaskForm();
      }
      }
  
  }

  extractNumber(value: string): number {
    const numericValue = value.match(/\d+/);
    return numericValue ? +numericValue[0] : null;
  }

  saveTimesheet(i): void {
    if (this.timeSheetForm.invalid && this.taskForm.invalid) {
      this.timeSheetForm.markAllAsTouched();
      this.taskForm.markAllAsTouched();
      this.api.showWarning('Please select the mandatory fields');
     this.isSaved = false;
    } else {
      const projectGroup = this.getProjectControl(i);
      projectGroup.get('showSave').setValue(true);
      projectGroup.get('isSaved').setValue(true);
     
     this.isSaved = true;
    }
  }

  deleteTask(projectIndex: number, taskIndex: number): void {
    const taskArray = this.getTaskArray(projectIndex);
    taskArray.removeAt(taskIndex);
  }

  
  toggleTaskEditingState(i: number, j: number, isEditing: boolean): void {
    const taskArray = this.getTaskArray(i);
    const task = taskArray.at(j) as FormGroup;
  
    // Check if we're enabling or disabling editing mode
    if (isEditing) {
      // Store the initial task data before editing
      if (!this.originalTaskData[i]) {
        this.originalTaskData[i] = {};
      }
      this.originalTaskData[i][j] = { ...task.value };
   
      task.get('isEditing')?.setValue(true);
    } else {
      // Revert to the original task data when cancelling
      const originalData = this.originalTaskData[i]?.[j];
      if (originalData) {
        task.setValue(originalData);
      }
  
      // Disable editing mode for this task
      task.get('isEditing')?.setValue(false);
    }
  }
  
  
  

  resetTaskForm(): void {
    this.taskForm.reset();
  }

  onProjectImageChange(event: any, projectIndex: number): void {
    const file = event.target.files[0];
    const projectFormGroup = this.createdProject.at(projectIndex) as FormGroup;
    projectFormGroup.patchValue({ project_image: file });
  }

  addTimeSheet(): void {
    if (this.timeSheetForm.invalid) {
      this.timeSheetForm.markAllAsTouched();
      this.api.showError('Please enter the mandatory fields');
      return;
    }

    const selectedArr = this.timeSheetForm.value.response.map(project => {
      const { client_id, project_id, description, timesheet_applied_datetime, task_details } = project;
      return {
        client_id,
        project_id,
        description,
        timesheet_applied_datetime,
        task_details: task_details.map(task => ({
          task_id: task.task_id,
          time_spent: task.time_spent
        }))
      };
    });

    const data = {
      created_by: this.userId,
      reporting_manager_ref: this.manager_id,
      user_id: this.userId,
      status: 'YET_TO_APPROVED',
      module: 'TIMESHEET',
      menu: 'PEOPLE_TIMESHEET',
      method:"CREATE",
      date: this.datepipe.transform(new Date(), 'dd/MM/yyyy'),
      timesheet_status: 'YET_TO_APPROVED',
      response: selectedArr,
      organization_id: this.orgId,
    };

    this.api.addTimeSheet(data).subscribe(
      (response) => {
        this.api.showSuccess('Timesheet added successfully!');
        this.timeSheetForm.reset();
        this.addProjectDetails(); 
      },
      (error) => {
        this.api.showError(error?.error.error.message);
      }
    );
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
  getProject(event, index){
    this.currentIndex = index
    this.client_id = event
    this.api.getData(`${environment.live_url}/${environment.get_time_sheet_values}?client_id=${event}`).subscribe((res:any)=>{
      if(res){
        this.allProject = res.data
        this.projectList = [...this.allProject]
        this.createdProject.at(index).patchValue({projectList: this.projectList})
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
        // console.log(res.data[0].project_related_task_list,"RESPONSETASK n/----------------")
        this.createdProject.at(index).patchValue({taskList: this.taskList})
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
        this.createdProject.at(index).patchValue({time: this.timeList})
      }
      else{
        this.api.showError('ERROR!')
      }
    },(error =>{
      this.api.showError(error.error.error.message)
    })) 
  }
}
