import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ValidatorFn, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.scss']
})
export class CreateNewProjectComponent implements OnInit {
  BreadCrumbsTitle: any = 'Create project';
  isShown: boolean = false; // hidden by default
  taskCategories: any = [];
  invalidDate: boolean = false;
  task_name: any = [];
  orgId: any;
  user_id: any;
  value;
  tasks = []
  status = [];
  selectedItems = [];
  toggleShow() {

    this.isShown = !this.isShown;

  }
  isGroupShown: boolean = false;
  isListShown: boolean = true;


  toggleGroupShow() {

    this.isGroupShown = !this.isGroupShown;
    this.isListShown = !this.isListShown;

  }

  projectForm: FormGroup

  allProject: any = [];
  project: any;

  allClientList: any = [];
  client: any;

  allPeopleGroup: any = [];
  peopleGroup: any;
  peopleListSetting = {};
  peopleGroupSetting = {};
  peopleId: any = []
  assigneePeoples: any = [];
  taskList = {}
  allManager: any = [];
  reporting_manager: any;
  approver_manager: any;
  params = {
    pagination: "FALSE"
  }
  taskForm: FormGroup;

  constructor(private builder: FormBuilder,
    private api: ApiserviceService,
    private datepipe: DatePipe,
    private location: Location,
    private common_service: CommonServiceService,
    private modalService: NgbModal
  ) { }


  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  onChange(event:any) {
    console.log('fff',event)
    this.projectForm.patchValue({
      end_date: ''
    })
  }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('organization_id');
    this.user_id = sessionStorage.getItem('user_id');
    this.getProjectStatus();
    this.getClient();
    this.getManager();
    this.getPeopleGroup();
    this.initForm();
    this.getCategory();
    // this.taskForm = this.builder.group({
    //   subTasks: this.builder.array([])
    // });
    // Optionally, you can add an initial empty task
    // this.addTask();
  }

  getProjectStatus(){
    this.api.getProjectStatus().subscribe(
      (res:any)=>{
        this.status = res;
      },
      (error:any)=>{
        console.log('project status error',error)
      }
    )
  }
  initForm() {
    this.projectForm = this.builder.group({
      org_ref_id: this.orgId,
      user_id: this.user_id,
      client_id: ['', [Validators.required]],
      project_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      team: ['', Validators.required],
      project_manager_id: ['', [Validators.required]],
      estimated_hour: ['', [Validators.required]],
      estimated_billing: ['', [Validators.required]],
      status_id: ['', [Validators.required]],
      project_task: this.builder.array([]),
      project_category: [''],

      pc_ref_id: [''],
      p_description: [''],
      approve_manager_ref_id: [''],
      p_task_checklist_status: [''],
      user_ref_id: [''],
      opg_ref_id: [''],
      p_code: [''],
      p_people_type: [''],
      p_activation_status: [''],
    })
    this.addTask();
  }
  // Client list
  getClient() {
    this.api.getClientListFromUserId(`?${'organization_id'}=${this.orgId}`).subscribe(
      (res:any)=>{
        this.allClientList = res;
      },
      (error) => {
        this.api.showError(error.error.error.message)
      }
    )
  }

  // employees
  getPeopleGroup() {
    this.peopleListSetting = {
      singleSelection: false,
      idField: 'id',
      textField: 'first_name',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    // this.peopleGroupSetting = {
    //   singleSelection: true,
    //   idField: 'id',
    //   textField: 'first_name',
    //   itemsShowLimit: 3,
    //   allowSearchFilter: true
    // };
    this.api.getEmployeeList(`?${'organization_id'}=${this.orgId}`).subscribe((data: any) => {
      if (data) {
        let filteredRole = [];
        data.forEach((element:any)=>{
          filteredRole.push(element.user)
        })
        // console.log(' this.filteredRole', filteredRole)
        this.allPeopleGroup = filteredRole;
        // console.log(' this.allPeopleGroup', this.allPeopleGroup)
      }
      else {
        //console.log('Error');
      }

    }

    )
  }

  
  matTeamSelect(event: any) {
    // console.log(event);
    this.peopleId = event.value;
    let tempId: any = []
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


  // Managers
  getManager() {
    this.api.getManagerDetails(this.params, this.orgId).subscribe((data: any) => {
      if (data) {
        this.allManager = data.result.data;
      }
    }
    )
  }

  // Templates
  getCategory() {
    this.api.getData(`${environment.live_url}/${environment.taskProjectCategories}?page_number=1&data_per_page=2&pagination=FALSE&org_ref_id=${this.orgId}`).subscribe(data => {
      console.log(data, "category template")
      this.taskCategories = data['result'].data
    })
  }

  get f() {
    return this.projectForm.controls;
  }
  get subTasks(): FormArray {
    return this.projectForm.get('project_task') as FormArray;
  }


  createSubTask(): FormGroup {
    return this.builder.group({
      task_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      status: ['', Validators.required],
      assignee: ['', Validators.required],
      is_saved: false,
      is_cancelled: false,
      edit_icon: false,
      is_template: false
    });
  }

  // adding new task
  addTask(): void {
    console.log('this.projectForm.value.task_list', this.projectForm.value.project_task)
    const taskList = this.projectForm.value.project_task;
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
    console.log(this.projectForm.value.project_task)
    // this.projectForm.patchValue({ project_task: this.subTasks });
  }

  // save task
  save(index1: any) {
    const taskList = this.subTasks.at(index1) as FormGroup;
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
    console.log(this.projectForm.value, 'clicked on save button')
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
    console.log(this.projectForm.value, 'clicked on edit button')
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




  onPeopleGroupSelect(event: any) {
    this.peopleId.push(event.id)
    console.log(this.peopleId)
  }
  onSingleSelect(event) {
    this.task_name.push(event.task_name)
  }
  onSelectAll(event) {
    event.forEach((element: any) => {
      this.task_name.push(element.task_name)
    });
  }
  onPeopleGroupSelectAll(event: any) {
    event.forEach((element: any) => {
      this.peopleId.push(element.id)
    });
  }




  // selecting project templates
  getSubTask(event) {
    console.log(event.value);
    // this.subTasks.clear();
    this.api.getSubTaskByProjectTaskCategory(event.value, this.orgId).subscribe(
      (resp) => {
        for (let i = this.subTasks.length - 1; i >= 0; i--) {
          const task = this.subTasks.at(i);
          if (task.get('is_template')?.value === true && task.get('is_saved')?.value === false && task.get('is_cancelled')?.value === false) {
            this.subTasks.removeAt(i);
          }
        }
        const taskList = resp['result']['data'][0].task_list;
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
        console.log(this.projectForm.value)
      },
      (error) => {
        console.log(error);

      }
    )

  }

  yearEndDateValidator(): any {
    const StartDate = new Date(this.projectForm.get('start_date').value).getTime() / (1000 * 60);

    const EndDate = new Date(this.projectForm.get('end_date').value).getTime() / (1000 * 60);
    if (StartDate > EndDate) {
      this.invalidDate = true;
      //console.log(StartDate > EndDate,'true')
    }
    else {
      this.invalidDate = false;
    }
  }

  // Add project
  selectedTask = []
  addProject() {
    this.projectForm.patchValue({ people_ref_id: this.peopleId });
    const startDate = this.projectForm.value.start_date;
    const EndDate = this.projectForm.value.end_date;
    console.log(this.projectForm.value);
    if (this.projectForm.invalid) {
      this.api.showError('Invalid');
      console.log(this.projectForm.controls);
      this.projectForm.markAllAsTouched()
    }
    else {
      const taskList = this.projectForm.value.project_task;
      let allTasksValid = true;
      taskList.forEach((element: any) => {
        if (taskList.invalid) {
          taskList.markAllAsTouched();
          allTasksValid = false;
        }
        else if (element.task_name.trim() !== '') {
          if (element.is_saved === false) {
            this.api.showWarning('Please click on the ✅ to save your task.');
            allTasksValid = false;
          }
        }
      })


      if (allTasksValid == true && this.invalidDate == false) {
        let tempList: any;
        tempList = this.projectForm.value['project_task'].map(({ task_name, status, assignee }) => ({
          task_name,
          status,
          assignee
        }));
        let data = {
          org_ref_id: this.projectForm.value.org_ref_id,
          created_by: this.projectForm.value.user_id,
          client_id: this.projectForm.value.client_id,
          project_name: this.projectForm.value.project_name,
          start_date: this.datepipe.transform(startDate, 'dd/MM/yyyy'),
          end_date: this.datepipe.transform(EndDate, 'dd/MM/yyyy'),
          team: this.projectForm.value.team,
          project_manager_id: this.projectForm.value.project_manager_id,
          estimated_hour: this.projectForm.value.p_estimated_hours,
          estimated_billing: this.projectForm.value.estimated_billing,
          status_id: this.projectForm.value.status_id,
          project_task: tempList,
          project_category: [Number(this.projectForm.value.project_category)],

          // pc_ref_id: this.projectForm.value.pc_ref_id || this.projectForm.value.pc_ref_id,
          // p_description: this.projectForm.value.p_description,
          // approve_manager_ref_id: this.projectForm.value.approve_manager_ref_id,
          // p_task_checklist_status: this.projectForm.value.p_task_checklist_status,
          // user_ref_id: this.projectForm.value.user_ref_id,
          // opg_ref_id: this.projectForm.value.opg_ref_id,
          // p_code: this.projectForm.value.p_code,
          // p_people_type: this.projectForm.value.p_people_type,
          // p_activation_status: this.projectForm.value.p_activation_status,
        }
        console.log(data, 'dataaaa')
        // this.api.addProjectDetails(data).subscribe(res => {
        //   if (res) {
        //     this.projectForm.patchValue({
        //       project_name: '',
        //       p_estimated_hours: '',
        //       estimated_billing: '',
        //       project_manager_id: '',
        //       pc_ref_id: '',
        //       status_id: '',
        //       p_description: '',
        //       start_date: '',
        //       end_date: '',
        //       approve_manager_ref_id: '',
        //       p_task_checklist_status: '',
        //       org_ref_id: '',
        //       user_ref_id: '',
        //       opg_ref_id: '',
        //       p_code: '',
        //       p_people_type: '',
        //       p_activation_status: '',
        //       c_ref_id: '',
        //       project_task: '',
        //       project_category: ''
        //     });
        //     this.taskForm.get('subTasks').reset();
        //     this.projectForm.get('team').reset();

        //     this.api.showSuccess('Project added successfully!');
        //     this.initForm()
        //   }
        //   else {
        //     this.api.showError('Error')
        //   }

        // }, (error => {
        //   this.api.showError(error.error.error.message)
        // })
        // )
      }
      // else {
      //   this.api.showWarning('Invalid date')
      // }


    }
  }

}
