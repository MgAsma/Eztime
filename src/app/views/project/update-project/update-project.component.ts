import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {
  BreadCrumbsTitle: any = 'Update project';
  id: any;
  isShown: boolean = false; // hidden by default
  peopleId: any = [];
  page: string;
  tableSize: string;
  params = {
    pagination: 'FALSE'
  }
  taskCategories: any = [];
  subTaskCategories: any = [];
  updateForm: FormGroup;
  invalidDate: boolean = false;
  url: any;
  assigneePeoples: any = [];
  task_name: any = [];
  subTaskValue: any;
  org_id: any;
  tasks = []
  status = [
    { value: 'open', viewValue: 'Open' },
    { value: 'inprogress', viewValue: 'Inprogress' },
    { value: 'completed', viewValue: 'Completed' },
    { value: 'pending', viewValue: 'Pending' },
  ];
  toggleShow() {
    this.isShown = !this.isShown;
  }
  isGroupShown: boolean = false;
  isListShown: boolean = true;
  toggleGroupShow() {
    this.isGroupShown = !this.isGroupShown;
    this.isListShown = !this.isListShown;
  }

  allClientList: any = [];
  client: any;

  allPeopleGroup: any = [];
  peopleGroup: any;

  allManager: any = [];
  reporting_manager: any;
  approver_manager: any;
  peopleListSetting = {};
  peopleGroupSetting = {};
  subTaskSetting: any = {};
  taskForm: FormGroup;
  selectedTeams:any= []
  constructor(
    private builder: FormBuilder,
    private api: ApiserviceService,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private router: Router,
    private location: Location,
    private common_service: CommonServiceService,
    private modalService: NgbModal
  ) {
    this.id = this.route.snapshot.paramMap.get('id')
    this.page = this.route.snapshot.paramMap.get('page')
    this.tableSize = this.route.snapshot.paramMap.get('tableSize')

  }
  onChange(event:any) {
    this.updateForm.patchValue({
      end_date: ''
    })
  }
  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  initForm() {
    this.updateForm = this.builder.group({
      project_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      client_id: ['', [Validators.required]],
      p_description: ['', [Validators.pattern(/^\S.*$/)]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      estimated_hour: ['', [Validators.required]],
      estimated_billing: ['', [Validators.required]],
      project_manager_id: ['', [Validators.required]],
      approve_manager_ref_id: ['', [Validators.required]],
      project_task:  this.builder.array([]),
      p_task_checklist_status: [''],
      project_category: [''],
      status_id: ['', [Validators.required]],
      pclient_id: [''],
      user_ref_id: [''],
      opg_ref_id: [''],
      p_code: [''],
      p_people_type: [''],
      team: ['', Validators.required],
      p_activation_status: [''],

    });
    this.addTask();
  }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.org_id = sessionStorage.getItem('org_id')
    this.subTaskCategories = []
    this.subTaskSetting = {
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
    // this.edit();
    // this.taskForm = this.builder.group({
    //   subTasks: this.builder.array([])
    // });

    // Optionally, you can add an initial empty task
    // this.addTask();
  }
 
  get subTasks(): FormArray {
    return this.updateForm.get('project_task') as FormArray;
  }
  addTask(): void {
    console.log('this.updateForm.value',this.updateForm.value)
    const taskList = this.updateForm.value.project_task;
    let allTasksValid = true;

    taskList.forEach((element: any) => {
      if (element.is_saved === false && element.task_name.trim() === '' || element.status === '' || element.assignee === '') {
        this.api.showWarning('Task cannot be empty.');
        allTasksValid = false;
      }
      else if (element.task_name.trim() !== '') {
        if (element.is_saved === false) {
          this.api.showWarning('Please click on the ✅ to save your task.');
          allTasksValid = false;
        }
      }
    });
    if (allTasksValid) {
      this.subTasks?.push(this.createSubTask());
    }
  }
  createSubTask(): FormGroup {
    return this.builder.group({
      task_name: '',
      status: '',
      assignee: '',
      is_saved: false,
      is_cancelled: false,
      edit_icon: false,
      is_template: false
    });
  }
  
  removeTask(index: number): void {
    this.subTasks.removeAt(index);
  }
  get f() {
    return this.updateForm.controls;
  }
  startDate: any
  endDate: any
  changeYearStartDate(event: any) {
    this.startDate = event.target.value
  }
  changeYearEndDate(event: any) {
    this.endDate = event.target.value
  }
  edit() {
    let params = {
      page_number: this.page,
      data_per_page: this.tableSize,
      organization_id: this.org_id
    }
    this.api.getCurrentProjectDetails(this.id, params).subscribe((data: any) => {
      this.startDate = this.datepipe.transform(data.result.data[0].start_date * 1000, 'yyyy-MM-dd')
      this.endDate = this.datepipe.transform(data.result.data[0].end_date * 1000, 'yyyy-MM-dd')
      // this.getSubTask(data.result.data[0].p_task_checklist_status, 'TS')
      this.updateForm.patchValue({
        status_id: data.result.data[0].status_id,
        project_name: data.result.data[0].project_name,
        client_id: data.result.data[0].client_id,
        p_description: data.result.data[0].p_description,
        start_date: this.datepipe.transform(data.result.data[0].start_date * 1000, 'yyyy-MM-dd'),
        end_date: this.datepipe.transform(data.result.data[0].end_date * 1000, 'yyyy-MM-dd'),
        estimated_hour: data.result.data[0].estimated_hour,
        estimated_billing: data.result.data[0].estimated_billing,
        project_manager_id: data.result.data[0].project_manager_id,
        approve_manager_ref_id: data.result.data[0].approve_manager_ref_id,
        p_task_checklist_status: data.result.data[0].p_task_checklist_status,
        team: data.result.data[0].pclient_id == null ? data.result.data[0].team : data.result.data[0].pclient_id,
        project_category: data.result.data[0].project_category,
        project_task: data.result.data[0].project_task[0]?.task_name
      })
      let subTasksArray: any = [];
      let removedItem = [];
      data.result.data[0].project_task.forEach((item: any) => {
        if (item) {
          subTasksArray.push(item);
        }
      });


      const subTasksVal: any = this.taskForm.get('subTasks') as FormArray;
      if (subTasksArray.length > 2) {
        removedItem = subTasksArray.slice(1);
        subTasksVal.removeAt(0);


        removedItem.forEach((task: any) => {

          subTasksVal.push(this.builder.group({
            task_name: task.task_name || '',
            status: task.status,
            assignee: task.assignee
            // Add more form controls as needed
          }));
        });
      }
      else {
        if (subTasksArray.length > 1) {
          removedItem = subTasksArray.slice(1);

          subTasksVal.removeAt(0);
          subTasksVal.push(this.builder.group({
            task_name: removedItem[0]['task_name'] || '',
            status: removedItem[0]['status'],
            assignee: removedItem[0]['assignee']
            // Add more form controls as needed
          }));
        }

      }
    })


  }
  getClient() {
    this.api.getClientDetails(this.params, this.org_id).subscribe((data: any) => {
      this.allClientList = data.result.data;
    }
    )
  }
  getPeopleGroup() {
    this.peopleListSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'u_first_name',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.api.getData(`${environment.live_url}/${environment.people_list}?page_number=1&data_per_page=2&pagination=FALSE&organization_id=${this.org_id}`).subscribe((data: any) => {
      if (data) {
        this.allPeopleGroup = data.result.data;
      }
      else {
        //console.log('Error');
      }

    }, ((error) => {
      this.api.showError(error.error.error.message)
    })

    )
  }
  getManager() {
    this.api.getManagerDetails(this.params, this.org_id).subscribe((data: any) => {
      this.allManager = data.result.data;
    }

    )
  }
  getCategory() {
    this.api.getData(`${environment.live_url}/${environment.taskProjectCategories}?page_number=1&data_per_page=2&pagination=FALSE&org_ref_id=${this.org_id}`).subscribe(data => {
      //console.log(data,"RESPONSE")
      this.taskCategories = data['result'].data
    })
  }
  selectedTask = []
  update() {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched()
    } else {
      //this.tasks.push(this.updateForm.value.project_task)
      console.log(this.tasks, "TASK")
      this.subTask(this.updateForm.value.project_task)
      this.selectedTask.push(this.subTaskValue, this.taskForm.value)
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
      this.startDate = this.updateForm.value.start_date
      this.endDate = this.updateForm.value.end_date
      let data = {
        project_name: this.updateForm.value.project_name,
        status_id: this.updateForm.value.status_id,
        client_id: this.updateForm.value.client_id,
        //   people_ref_id:this.updateForm.value.people_ref_id,
        p_description: this.updateForm.value.p_description,
        start_date: this.datepipe.transform(this.startDate, 'dd/MM/yyyy'),
        end_date: this.datepipe.transform(this.endDate, 'dd/MM/yyyy'),
        estimated_hour: this.updateForm.value.estimated_hour,
        estimated_billing: this.updateForm.value.estimated_billing,
        project_manager_id: this.updateForm.value.project_manager_id,
        approve_manager_ref_id: this.updateForm.value.approve_manager_ref_id,
        p_task_checklist_status: this.updateForm.value.p_task_checklist_status,
        pclient_id: this.updateForm.value.pclient_id,
        org_ref_id: this.org_id,
        user_ref_id: this.updateForm.value.user_ref_id,
        opg_ref_id: this.updateForm.value.opg_ref_id,
        p_code: this.updateForm.value.p_code,
        p_people_type: this.updateForm.value.p_people_type,
        team: this.updateForm.value.team,
        p_activation_status: this.updateForm.value.p_activation_status,
        project_task: flattenedData,
        project_category: [Number(this.updateForm.value.project_category)]
      }
      console.log(this.subTaskValue, this.subTaskValue.length, this.updateForm.value.project_task.length, 'LENGTH--------------')
      if (this.updateForm.value.team !== '' && this.updateForm.value.project_task.length > 0) {
        this.api.updateProject(this.id, data).subscribe(response => {

          if (response) {
            this.api.showSuccess('Project updated successfully!');
            this.router.navigate(['/project/list'])

          }
          else {
            this.api.showError('Error!')
          }

        }, ((error: any) => {
          this.api.showError(error?.error.error.message)
        })

        )
      }
      else {
        if (this.subTaskValue.length < 0) {
          this.updateForm.patchValue({
            project_task: ''
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
    event.forEach((element: any) => {
      this.peopleId.push(element.id)
    });
  }
  // getSubTask(event, data): any {
  //   // console.log(event,'))))))))))))))))))))))))))))))))))))))')
  //   this.subTaskCategories = []

  //   this.updateForm.patchValue({
  //     project_task: ''
  //   })

  //   this.api.getSubTaskByProjectTaskCategory(event, this.org_id).subscribe(
  //     (resp: any) => {
  //       this.subTaskCategories = resp.result.data[0].task_list
  //     },
  //     (error: any) => {
  //       this.api.showError(error.error.error.message)
  //     }
  //   )

  // }

  subTask(event: any) {
    if (event) {
      this.subTaskValue = this.subTaskCategories.filter((x, i) => x.task_name == event)
    }

  }
  yearEndDateValidator(): any {
    this.endDate = this.updateForm.get('end_date').value
    const StartDate = new Date(this.updateForm.get('start_date').value).getTime() / (1000 * 60);

    const EndDate = new Date(this.updateForm.get('end_date').value).getTime() / (1000 * 60);
    if (StartDate > EndDate) {
      this.invalidDate = true;
      //console.log(StartDate > EndDate,'true')
    }
    else {
      this.invalidDate = false;
    }
  }
  restrictInput(event) {
    const allowedKeys = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.',
      'Backspace', 'Tab', 'Enter', 'Escape', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End'
    ];

    if (allowedKeys.includes(event.key) || (event.ctrlKey && (event.key === 'v' || event.key === 'c' || event.key === 'a'))) {
      return true;
    }

    if (event.key === 'e' || event.key === '-' || event.keyCode === 69 || event.keyCode === 189) {
      return false;
    }

    return false;
  }

  matTeamSelect(event: any) {
    console.log(this.selectedTeams);
    this.peopleId = event.value;
    let tempId: any = []
    const taskList = this.subTasks.value
    this.allPeopleGroup.forEach(element => {
      this.peopleId.forEach(element1 => {
        if (element1 == element.id) {
          tempId.push(element)
        }
      })
    });
    this.assigneePeoples = tempId;
    this.subTasks.controls.forEach((taskControl: FormGroup, index: number) => {
      const task = taskControl.value;

      if (task.assignee && !this.assigneePeoples.some(person => person.id === task.assignee)) {
        taskControl.removeControl('original_task_assignee');
        taskControl.patchValue({
          assignee: '',
          is_saved: false,
          edit_icon: false,
          is_cancelled: false
        });
      }
    });
    
    console.log('assigneePeoples', this.assigneePeoples)
    console.log('this.subTasks.value', this.subTasks.value)
  }

  // selecting project templates
  getSubTask(event: any) {
    console.log(event.value);
    // this.subTasks.clear();
    this.api.getSubTaskByProjectTaskCategory(event.value, this.org_id,).subscribe(
      (resp: any) => {
        for (let i = this.subTasks.length - 1; i >= 0; i--) {
          const task = this.subTasks.at(i);
          if (task.get('is_template')?.value === true && task.get('is_saved')?.value === false && task.get('is_cancelled')?.value === false) {
            this.subTasks.removeAt(i);
          }
        }
        const taskList = resp.result.data[0].task_list;
        taskList.forEach(task => {
          this.subTasks.push(this.builder.group({
            task_name: [task.task_name, [Validators.required, Validators.pattern(/^\S.*$/),]],
            status: ['', Validators.required],
            assignee: ['', Validators.required],
            is_saved: false,
            is_cancelled: false,
            edit_icon: false,
            is_template: true
          }));
        });
        console.log(this.updateForm.value)
      },
      (error: any) => {
        //console.log(error);

      }
    )

  }

  // save task
  save(index1: any) {
    const taskList = this.subTasks.at(index1) as FormGroup;
    const taskName = taskList.get('task_name')?.value.trim();
    if (taskList.invalid) {
      taskList.markAllAsTouched();
    }
    else {
      taskList.patchValue({
        is_saved: true,
        edit_icon: true,
        is_cancelled: false
      });
      this.api.showSuccess('Task saved.');
    }
    console.log(this.updateForm.value, 'clicked on save button')
  }
  editTask(index1: any) {
    const taskList = this.subTasks.at(index1) as FormGroup;
    taskList.patchValue({
      is_saved: false,
      edit_icon: false,
      is_cancelled: true
    });
    const currentTaskName = taskList.get('task_name')?.value;
    const currentTaskStatus = taskList.get('status')?.value;
    const currentTaskAssignee = taskList.get('assignee')?.value;
    taskList.addControl('original_task_name', new FormControl(currentTaskName));
    taskList.addControl('original_task_status', new FormControl(currentTaskStatus));
    taskList.addControl('original_task_assignee', new FormControl(currentTaskAssignee));
    console.log(this.updateForm.value, 'clicked on edit button')
  }
  cancelEdit(index1: any) {
    const taskList = this.subTasks.at(index1) as FormGroup;
    const originalTaskName = taskList.get('original_task_name')?.value;
    const originalTaskStatus = taskList.get('original_task_status')?.value;
    const originalTaskAssignee = taskList.get('original_task_assignee')?.value;
    if (originalTaskName !== undefined) {
      taskList.patchValue({ task_name: originalTaskName });
      taskList.patchValue({ status: originalTaskStatus });
      taskList.patchValue({ assignee: originalTaskAssignee });
    }
    taskList.removeControl('original_task_name');
    taskList.removeControl('original_task_status');
    taskList.removeControl('original_task_assignee');
    taskList.patchValue({
      is_saved: true,
      is_cancelled: false,
      edit_icon: true,
    });
  }

   // delete confirmation popup
   async openDeleteConfirmation(index) {
    try {
      const modalRef = await this.modalService.open(GenericDeleteComponent, {
        size: 'sm',
        backdrop: 'static',
        centered: true
      });

      modalRef.componentInstance.status.subscribe(resp => {
        if (resp === 'ok') {
          this.deleteTaskRow(index);
          modalRef.dismiss();
        } else {
          modalRef.dismiss();
        }
      });
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }
  // delete task
  deleteTaskRow(index: any) {
    this.subTasks.removeAt(index);
    console.log(this.subTasks);
    console.log(this.updateForm.value.project_task)
    // this.projectForm.patchValue({ project_task: this.subTasks });
  }
}
