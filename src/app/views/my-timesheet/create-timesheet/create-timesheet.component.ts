import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-timesheet',
  templateUrl: './create-timesheet.component.html',
  styleUrls: ['./create-timesheet.component.scss']
})
export class CreateTimesheetComponent implements OnInit {
  BreadCrumbsTitle: any = 'Create Timesheet';
  isExpanded: boolean = false;
 
  timeSheetForm!: FormGroup;
  createdProject!: FormArray;
  taskForm!: FormGroup; 
  userId = 195;
  manager_id = 195;
  orgId = 102;
  hours_to_complete: any = [];
  timeList: any[] = [];
  project_id: any;
  allClient: any[] = [];
  client: any;
  allProject: any[] = [];
  project: any;
  allTask: any[] = [];
  currentIndex: any = 0;
  client_id: any;
  projectList: any[] = [];
  taskList: any[] = [];
  params = {
    pagination: "FALSE"
  };
  //isTaskForm: boolean = false;
  originalTaskData: any = [];
  isSaved: boolean = false;
  //showSave: boolean = false;
  panelExpand:boolean = false;
  isTaskSubmitted: boolean = false;
  remainingHours: number;
  projectListArray: FormArray<any>;
  duplicateDate: string;
  totalHoursForDate: number;
  taskDetailsList:string[]=[];

  constructor(
    private builder: FormBuilder,
    private api: ApiserviceService,
    private datepipe: DatePipe,
    private common_service: CommonServiceService,
    private modalService:NgbModal,
  ) {}
  panelOpenState = false
  @ViewChildren(MatExpansionPanel) panels: QueryList<MatExpansionPanel>;

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.initializeForm();
    this.taskInitForm()
    this.addProjectDetails(); 
    this.getClient(this.currentIndex);
  }
  // Initialize panel state tracking
  panelStates = new Array<boolean>();

  // Track when a panel is opened
  onPanelOpen(index: number): void {
    this.panelStates[index] = true;
  }

  // Track when a panel is closed
  onPanelClose(index: number): void {
    this.panelStates[index] = false;
  }

  // Check if panel is open
  isPanelOpen(index: number): boolean {
    return this.panelStates[index] || false;
  }

  getRemainingHours(i: number): number {
    const totalHours = 8;
    const taskArray = this.getTaskArray(i);
    const spentHours = taskArray.controls.reduce((sum, task) => {
      const timeSpent = task.get('hours_to_complete').value;
      return sum + (timeSpent ? parseFloat(timeSpent) : 0);
    }, 0);
    const remainingHours = totalHours - spentHours;
    this.remainingHours = remainingHours;
    // return remainingHours > 0 ? remainingHours : 0;
    return this.totalHoursForDate >0 ? totalHours - this.totalHoursForDate : remainingHours;
  }


  calculateTotalHoursForDate(selectedDate: string): number {
    let totalHours = 0;

    // Iterate through all projects in the response FormArray
    this.createdProject?.controls?.forEach((projectGroup: FormGroup) => {
        const taskArray = projectGroup.get('task_list') as FormArray;

        // Iterate through all tasks in the current project
        taskArray?.controls?.forEach((taskControl: FormGroup) => {
            const taskDate = projectGroup.get('created_date')?.value;
            const timeSpent = taskControl.get('hours_to_complete')?.value;

            // Add the hours for tasks with the matching selected date
            if (taskDate === selectedDate && timeSpent) {
                totalHours += parseFloat(timeSpent);
            }
        });
    });

    return totalHours;
}
async open(index) {
  
  try {
    const modalRef = await this.modalService.open(GenericDeleteComponent, {
      size: 'sm',
      backdrop: 'static',
      centered: true
    });
    
    modalRef.componentInstance.status.subscribe(resp => {
      if (resp === 'ok') {
        this.deleteProject(index);
        modalRef.dismiss();
      } else {
        modalRef.dismiss();
      }
    });
  } catch (error) {
    console.error('Error opening modal:', error);
  }
  
  }

  initializeForm(): void {
    this.timeSheetForm = this.builder.group({
      response: this.builder.array([])
    });

  }
  // Access the FormArray
get responseArray() {
  return this.timeSheetForm.get('response') as FormArray;
}
getValue(i,j,value,type?){
//   const projectGroup = this.getProjectControl(i);
//  const taskArray = this.getTaskArray(j)
 
//   projectGroup.patchValue({
//       task_list: taskArray.value,  // This patches the task details array
//     });
 

}
onDateChange(date: string) {
  const maxHours = 8; // Max allowed hours for each date
  const selectedDate = this.datepipe.transform(date, 'dd/MM/yyyy');

  // Filter the responseArray by matching dates
  const matchedDates = this.responseArray.value.filter((group: any) => 
    this.datepipe.transform(group.created_date, 'dd/MM/yyyy') === selectedDate
  );

  if (matchedDates.length > 0) {
    // Sum up the hours for the matching dates
    this.totalHoursForDate = 0;
    
    matchedDates.forEach((group: any) => {
      group.task_list.forEach((task: any) => {
        // Extract hours from hours_to_complete (assuming "X hr" format)
        const hours = parseInt(task.hours_to_complete.split(' ')[0], 10);
        this.totalHoursForDate += hours;
      });
    });
    // alert(this.totalHoursForDate)
    // Check if total hours exceed the max hours
    if (this.totalHoursForDate >= maxHours) {
      this.duplicateDate = selectedDate
      this.api.showError(`No slots are available in this date.`);
    }else{
      this.duplicateDate = "";
    }
    // else {
    //   const availableHours = maxHours - totalHoursForDate;
    //   this.api.showError(`You can assign up to ${availableHours} more hours for this date (${selectedDate}).`);
    // }
  }
}

  taskInitForm(){
    this.taskForm = this.builder.group({
      task_id: ['', Validators.required],
      hours_to_complete: ['', Validators.required],
      hours_left:[''],
      isEditing: [false]
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
    this.createdProject = this.timeSheetForm.get('response') as FormArray;
    const projectGroup = this.createProjectDetails();
    this.createdProject.push(projectGroup)
    this.isSaved = false;
    projectGroup.get('isSaved').setValue(false);
    
  }
  

  reverseFormArray(formArray: FormArray,index?): void {
    const reversedArray = formArray.controls.slice().reverse();
    formArray.clear();
    reversedArray.forEach(control => formArray.push(control));
  }
  getTaskLength(project: AbstractControl): number {
    const tasks = project.get('task_list') as FormArray;
    return tasks ? tasks.length : 0;
  }
  getProjectNameById(projectId: number): string {
    const project = this.allProject.find(p => p.id === projectId);
    return project ? project.p_name : 'NA';
  }
  
  getClientNameById(clientId: number): string {
    const client = this.allClient.find(c => c.id === clientId);
    return client ? client.c_name : 'NA';
  }
  
  getProjectLength(): number {
    return (this.timeSheetForm.get('response') as FormArray).length;
  }

  
  getTaskArray(projectIndex: number): FormArray {
  return this.createdProject.at(projectIndex).get('task_list') as FormArray;
  }

 
  editTask(projectIndex: number, taskIndex: number): void {
    const taskArray = this.getTaskArray(projectIndex);
    const taskFormGroup = taskArray?.at(taskIndex) as FormGroup;
  // console.log(taskArray,'ALL DETAILS')
  
    const newTimeSpentValue = this.extractNumber(taskFormGroup.get('hours_to_complete').value);
  
    // Get the original (old) time spent before editing
  //  const oldTimeSpentValue = this.extractNumber(this.originalTaskData[projectIndex][taskIndex]?.hours_to_complete || 0);
  
    // Calculate the available hours by excluding the current task's old hours_to_complete
    // const availableHours = this.getRemainingHours(projectIndex) + oldTimeSpentValue;

    const availableHours = this.getRemainingHours(projectIndex) ;
    // console.log('Available Hours:', availableHours);
    // console.log('New Time Spent Value:', newTimeSpentValue);
    const hours = 8
    // this.isTaskSubmitted = true;
     if ((newTimeSpentValue - hours)  > availableHours) {
    this.api.showError(`The selected hours (${newTimeSpentValue}) cannot exceed the left hours .`);
  //   this.api.showError(`The selected hours cannot exceed the remaining available hours.`)
} else {
       
      // Update the task with the new value
     // this.toggleTaskEditingState(projectIndex, taskIndex, false);
      // Replace the original value with the new value in the data
     // console.log(taskFormGroup.value)
      this.originalTaskData[projectIndex][taskIndex] = taskFormGroup?.value;
      // this.isTaskSubmitted = false;
      this.timeSheetForm.markAsTouched();
      taskFormGroup?.get('isEditing')?.setValue(false);
      this.disableTaskDetailsBasedOnEditing(projectIndex, taskIndex,false);
    }
    
  
  }
  
  
  getProjectControl(index: number): FormGroup {
    return this.createdProject.at(index) as FormGroup;
  }
  hoursList = [];

  generateHoursList(projectIndex: number): void {
    const taskArray = this.getTaskArray(projectIndex);
    
    taskArray?.controls.forEach(taskControl => {
      const taskDate = taskControl.get('created_date')?.value;
      const timeSpent = taskControl.get('hours_to_complete')?.value;
  
      if (taskDate && timeSpent) {
        const existingDate = this.hoursList.find(item => item.date === taskDate);
        
        if (existingDate) {
          existingDate.totalHours += parseFloat(timeSpent);
        } else {
          this.hoursList.push({
            date: taskDate,
            totalHours: parseFloat(timeSpent)
          });
        }
      }
    });
  }

saveTask(projectIndex: number): void {
  const projectGroup = this.getProjectControl(projectIndex);
  const taskArray = this.getTaskArray(projectIndex);
  
  if (this.taskForm.invalid || this.duplicateDate) {
    this.taskForm.markAllAsTouched();
    if (this.duplicateDate) {
      this.api.showError(`This date (${this.duplicateDate}) is already fully reserved with max hours.`);
    }
    return; // Exit early if there are validation errors
  }

  // Calculate values
  const remainingHours = this.getRemainingHours(projectIndex);
  const enteredTime = this.extractNumber(this.taskForm.get('hours_to_complete').value);
  const totalHoursForDate = this.totalHoursForDate || 0; // Default to 0 if undefined

  
  if (enteredTime  > remainingHours) {
    this.api.showError(`You have only ${remainingHours } hours left for this date.`);
    projectGroup.get('isTaskForm').setValue(true);
  } 
  // If everything is okay, save the task
  else {
  
  // Disable the task details based on editing state
  
  // Add the new task to the form array
  //const newTaskGroup = this.builder.group(this.taskForm.value);
  //taskArray.push(newTaskGroup);
  taskArray.push(this.builder.group(this.taskForm.value));
   console.log(taskArray)
  const taskIndex = taskArray?.length ? taskArray?.length - 1 : 0
  const task = taskArray.at(taskIndex) as FormGroup;
  task?.get('task_id')?.disable();
  task?.get('hours_to_complete')?.disable();
  // this.disableTaskDetailsBasedOnEditing(projectIndex,taskIndex,false)
    projectGroup.get('isTaskForm').setValue(false);
    this.taskForm.reset();
  }
}

disableTaskDetailsBasedOnEditing(projectIndex: number, taskIndex: number,isEditing:boolean): void {
  const taskArray = this.getTaskArray(projectIndex); // Get the FormArray containing tasks
  const task = taskArray.at(taskIndex) as FormGroup; // Access the specific task form group

  // Check if isEditing is true or false
  // const isEditing = task?.get('isEditing')?.value;
  // const isEditingArr  = this.taskDetailsList?.[taskIndex]['isEditing']
 //console.log(this.taskDetailsList[taskIndex]['isEditing'])
 alert(isEditing)
  if (isEditing) {
    // If isEditing is true, enable the fields
    task?.get('task_id')?.enable();
    task?.get('hours_to_complete')?.enable();
  } else {
    // If isEditing is false, disable the fields
    task?.get('task_id')?.disable();
    task?.get('hours_to_complete')?.disable();
  }
 
}

deleteProject(projectIndex: number): void {
  const projectGroup = this.getProjectControl(projectIndex);
  const projectsArray = this.timeSheetForm.get('response') as FormArray;

  // Confirm if the user really wants to delete the project
  if (projectsArray) {
    // Remove the project at the specified index
    projectsArray.removeAt(projectIndex);
    projectGroup.get('isSaved').setValue(false);
    // Optional: If you need to update any other state or UI after deletion, do it here
    this.api.showSuccess('Project and its tasks deleted successfully'); // Example of showing a success message
    this.isSaved = false;
    // Optional: Reset or update any form states as needed
    this.taskForm.reset();
  }
}



  extractNumber(value: string): number {
    const numericValue = value?.match(/\d+/);
    return numericValue ? +numericValue[0] : null;
  }

 
  saveTimesheet(i: number): void {
    const projectGroup = this.getProjectControl(i);
   
    // Check if the specific project's form controls and task form are valid
    const isProjectGroupInvalid = projectGroup.invalid;
    const isTaskFormInvalid = projectGroup.get('isTaskForm').value ? this.taskForm.invalid : false;
    //  const tasks = taskArray.at(i).value
    // const isEditing = tasks.find(element=>element.isEditing);
    const tasksArray = projectGroup.get('task_list') as FormArray;
    let isEditing = false;

    // Loop through the FormArray
    tasksArray?.controls.forEach((taskGroup: FormGroup, index: number) => {
      const taskIsEditing = taskGroup.get('isEditing')?.value;
      console.log(`Task ${index + 1}: isEditing =`, taskIsEditing);
  
      // Update isEditing if any task is being edited
      if (taskIsEditing === true) {
        isEditing = true;
      }
    });
    if (isProjectGroupInvalid || isTaskFormInvalid) {
      // Mark all controls as touched for the specific index
      projectGroup.markAllAsTouched();
      if (projectGroup.get('isTaskForm').value) {
        this.taskForm.markAllAsTouched();
      }
      
  
      this.api.showWarning('Please select the mandatory fields');
      projectGroup.get('isSaved').setValue(false);
      this.isSaved = false;
      this.isTaskSubmitted = true;
    } else {
      if (isEditing || (projectGroup.get('isTaskForm').value && this.taskForm.invalid) || (projectGroup.get('isTaskForm').value && this.taskForm.valid )) {
        this.api.showWarning('Please add task details before save');
        this.isTaskSubmitted = true;
      } else {
        this.isTaskSubmitted = false;
        projectGroup.get('showSave').setValue(true);
        projectGroup.get('isSaved').setValue(true);
        this.isSaved = true;
      }
      // this.saveTask(i)
    }
  }
  
  deleteTask(projectIndex: number, taskIndex: number): void {
    const taskArray = this.getTaskArray(projectIndex);
    taskArray.removeAt(taskIndex);
  }

  
  toggleTaskEditingState(i: number, j: number, isEditing: boolean): void {
    const taskArray = this.getTaskArray(i);
    const task = taskArray?.at(j) as FormGroup;
    console.log(task)
    // Check if we're enabling or disabling editing mode
    if (isEditing) {
      // Store the initial task data before editing
      if (!this.originalTaskData[i]) {
        this.originalTaskData[i] = {};
      }
      this.originalTaskData[i][j] = { ...task.value };
      task?.get('isEditing')?.setValue(true);
      this.isTaskSubmitted = true;
        
    this.disableTaskDetailsBasedOnEditing(i, j,isEditing);
    } else {
      // Revert to the original task data when cancelling
      const originalData = this.originalTaskData[i]?.[j];
      // if (originalData) {
      //   task?.setValue(originalData);
      // }
      if (originalData && originalData.task_id && originalData.hours_to_complete) {
        console.log(originalData)
        task?.patchValue(originalData); // Use patchValue to avoid errors
      } else {
       // alert("Missing data for task_id or hours_to_complete");
      }
  
      // Disable editing mode for this task
      task?.get('isEditing')?.setValue(false);
      this.isTaskSubmitted = false;
        
    this.disableTaskDetailsBasedOnEditing(i, j,isEditing);
    }
  
  }
  
  
  

  resetTaskForm(i): void {
    this.taskForm.reset();
    const projectGroup = this.getProjectControl(i);
    projectGroup.get('isTaskForm').setValue(false);
  }

  createProjectDetails(): FormGroup {
    return this.builder.group({
      client_id: ['',Validators.required],
      project_id: ['',Validators.required],
      description: [''],
      created_date: ['',Validators.required],
      clientList:[],
      projectList: [],
      taskList: [],
      time: [],
      task_list: this.builder.array([]),
      showSave: [true],  // Add variable to control save button visibility
      isTaskForm: [true], // Add variable to control task form visibility
      isSaved:[false]
    });
  }

  addTimeSheet(): void {
    if (this.timeSheetForm.invalid) {
      this.timeSheetForm.markAllAsTouched();
      this.api.showError('Please enter the mandatory fields');
      return;
    }

    const selectedArr = this.timeSheetForm.getRawValue().response.map(project => {
      
      const { client_id, project_id, description, created_date, task_list } = project;
      return {
        client_id,
        project_id,
        description,
        created_date,
        task_list: task_list.map(task => ({
          task_id: task['task_id'],
          hours_to_complete: task['hours_to_complete'],
          hours_left:task['hours_left']
        }))
       
      };
    });
console.log(selectedArr,'MAP')
    // const data = {
    //   created_by: this.userId,
    //   reporting_manager_id: this.manager_id,
    //   user_id: this.userId,
    //   status: 'YET_TO_APPROVED',
    //   module: 'TIMESHEET',
    //   menu: 'PEOPLE_TIMESHEET',
    //   method:"CREATE",
    //   date: this.datepipe.transform(new Date(), 'dd/MM/yyyy'),
    //   timesheet_status: 'YET_TO_APPROVED',
    //   data: selectedArr,
    //   organization_id: this.orgId,
    // };
    const data = {
      created_by: this.userId,
      reporting_manager_id: this.manager_id,
      data: selectedArr,
      organization_id: this.orgId,
    };

  //   {
  //     "reporting_manager_id": 4, 
  //     "created_by": 46,
  //     "data": [
  //         {
  //             "client_id": 1,
  //             "project_id" : 1,
  //             "created_date": "24-09-2024",
  //             "description": "",
  //             "task_list": [
  //                 {
  //                     "task_id": 1,
  //                     "hours_left": 2,
  //                     "hours_to_complete":1
  
  //                 },
  //                 {
  //                     "task_id": 2,
  //                     "hours_left": 8,
  //                     "hours_to_complete":1
  
  //                 }
  //             ] 
  //         },
  //          {
  //             "client_id": 1,
  //             "project_id" : 2,
  //             "created_date": "24-09-2024",
  //             "description": "",
  //             "task_list": [
  //                 {
  //                     "task_id": 1,
  //                     "hours_left": 2,
  //                     "hours_to_complete":1
  
  //                 },
  //                 {
  //                     "task_id": 1,
  //                     "hours_left": 8,
  //                     "hours_to_complete":1
  
  //                 }
  //             ] 
  //         }
  //     ]
  // }
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

  getClient(i){
    this.currentIndex = i;
    this.api.getClientDetails(this.params,this.orgId).subscribe((data:any)=>{
      if(data){
        this.allClient = data.result.data;
        // console.log(this.allClient,'CLIENTLIST')
        const allClient = [...this.allClient]
      
        const projectControl = this.createdProject.at(i);
  
        // Update only the relevant index's project list
        projectControl.patchValue({ clientList: allClient });
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
        this.createdProject?.at(index)?.patchValue({projectList: this.projectList})
        
        // ----------------
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
        this.createdProject.at(index)?.patchValue({taskList: this.taskList})
      }
      
    },(error =>{
      this.api.showError(error.error.error.message)
    })) 
  }
  getTimeSpent(event,index){
    //console.log(event)
    this.api.getData(`${environment.live_url}/${environment.get_time_sheet_values}?client_id=${this.client_id}&project_id=${this.project_id}&task_name=${event}`).subscribe((res:any)=>{
      if(res){
       this.hours_to_complete = res
       this.timeList = [...this.hours_to_complete]
        //console.log(res,"TIMESPENT n/----------------")
        this.createdProject?.at(index)?.patchValue({time: this.timeList})
      }
      else{
        this.api.showError('ERROR!')
      }
    },(error =>{
      this.api.showError(error.error.error.message)
    })) 
  }
}
