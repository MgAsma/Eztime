import { Component, OnInit, } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-update-task-category',
  templateUrl: './update-task-category.component.html',
  styleUrls: ['./update-task-category.component.scss']
})
export class UpdateTaskCategoryComponent implements OnInit {
  BreadCrumbsTitle: any = 'Update category';
  id: any;
  uploadFile: any;
  url: any = [];
  fileUrl: any;
  page: string;
  tableSize: string;
  taskCategoryForm: FormGroup;
  baseImg: any = [];
  file_templates_list: FormArray<any>;
  imgURL: any;
  task_name: FormArray<any>;
  type = 'url';
  base64String: string;
  focusedInputIndex: number;
  // inputTypes: any[];
  imgBaseArr: any = [];
  data: any = {};
  formatError: boolean = false;
  orgId: any;
  constructor(
    private builder: FormBuilder,
    private api: ApiserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private common_service: CommonServiceService,
    private modalService: NgbModal
  ) {
    this.id = this.route.snapshot.paramMap.get('id')
    this.page = this.route.snapshot.paramMap.get('page')
    this.tableSize = this.route.snapshot.paramMap.get('tableSize')

  }

  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();

  }
  initForm() {
    this.taskCategoryForm = this.builder.group({
      tpc_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      task_list: this.builder.array([]),
      organization_id: this.orgId
    });

  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('org_id')
    this.initForm();
    this.edit();
  }
  get f() {
    return this.taskCategoryForm.controls;
  }

  taskFields() {
    // it contains form feild
    return this.builder.group({
      task_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      billable_type: ['', Validators.required],
    })
  }


  // update() {
  //   if (this.taskCategoryForm.invalid) {
  //     this.taskCategoryForm.markAllAsTouched();
  //     return;
  //   }
  //   else {

  //     this.taskCategoryForm.value['task_list'].forEach((element, i) => {
  //       element.id = i + 1
  //     });

  //     if (this.type === 'file') {

  //       this.data = {
  //         tpc_name: this.taskCategoryForm.value.tpc_name,
  //         task_list: this.taskCategoryForm.value.task_list,
  //         organization_id: this.orgId
  //       }
  //     }
  //     else {
  //       let filterTemplateList = []
  //       filterTemplateList = this.taskCategoryForm.value.file_templates_list
  //       // if(filterTemplateList.length === this.this.imgBaseArr.length){
  //       filterTemplateList.forEach((element, i) => {
  //         //  console.log(this.imgBaseArr)
  //         element.file_base_64 = this.imgBaseArr[i]
  //       });
  //       // }

  //       this.data = {
  //         tpc_name: this.taskCategoryForm.value.tpc_name,
  //         file_templates_list: filterTemplateList,
  //         task_list: this.taskCategoryForm.value.task_list,
  //         organization_id: this.orgId
  //       }
  //       // console.log(this.data,"DATA------------>>>>>>>>>")
  //     }

  //     this.api.updateProjectTaskCategory(this.id, this.data).subscribe(response => {
  //       //console.log(response,"RESPONSE----")
  //       if (response) {
  //         this.api.showSuccess('Project category updated successfully');
  //         this.taskCategoryForm.reset();
  //         this.router.navigate(['/task/list'])
  //       }
  //       else {
  //         this.api.showError('Error!')
  //       }
  //     }, ((error: any) => {
  //       this.api.showError(error?.error.error.message)
  //     })
  //     )


  //   }
  // }


  edit() {
    let params = {
      page_number: this.page,
      data_per_page: this.tableSize,
      org_ref_id: this.orgId
    }

    this.api.getCurrentProjectTaskCategoryDetails(this.id, params).subscribe((res: any) => {
      ////console.log(res,"DATA+++++",res.result.data[0].file_templates_list,res.result.data[0].task_list.length)
      this.taskCategoryForm.patchValue({
        tpc_name: res.result.data[0].tpc_name
      });
      const taskList = res.result.data[0].task_list
      //  this.dynamicArray = this.taskCategoryForm.get('task_list') as FormArray;
      taskList.forEach(task => {
        this.dynamicArray.push(this.builder.group({
          task_name: [task.task_name, [Validators.required, Validators.pattern(/^\S.*$/),]],
          is_saved: true,
          is_cancelled: false,
          edit_icon: true
        }));
      });
    })
  }


  // new
  get dynamicArray() {
    return this.taskCategoryForm.controls['task_list'] as FormArray;
  }
  addRow() {
    console.log('this.taskCategoryForm.value.task_list', this.taskCategoryForm.value.task_list)
    const taskList = this.taskCategoryForm.value.task_list;
    let allTasksValid = true;  // Flag to check if all tasks are valid

    taskList.forEach((element: any) => {
      if (element.task_name.trim() === '' && element.is_saved === false) {
        this.api.showWarning('Task name cannot be empty.');
        allTasksValid = false;  // Mark as invalid if any task name is empty
      }
      else if (element.task_name.trim() !== '') {
        if (element.is_saved === false) {
          this.api.showWarning('Please click on the ✅ to save your task.');
          allTasksValid = false;  // Mark as invalid if any task is not saved
        }
      }
    });

    // Add new row only if all tasks are valid
    if (allTasksValid) {
      this.dynamicArray.push(this.builder.group({
        id: [''],
        task_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
        is_saved: false,
        edit_icon: false,
        is_cancelled: false
      }));
    }

    // this.dynamicArray.push(this.builder.group({
    //   id: [''],
    //   task_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
    //   is_saved: false,
    //   edit_icon:false
    // }));

  }

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

  deleteTaskRow(index: any) {
    this.dynamicArray.removeAt(index);
    console.log(this.dynamicArray)
    this.taskCategoryForm.patchValue({ task_name: this.dynamicArray });
  }

  save(index1: any) {
    // this.taskCategoryForm.value['task_list'].forEach((element, i) => {
    //   element.id = i + 1
    // });
    console.log(this.taskCategoryForm.value)
    const taskList = this.dynamicArray.at(index1) as FormGroup;
    const taskName = taskList.get('task_name')?.value.trim();

    if (taskName === '') {
      this.api.showWarning('Task name cannot be empty.');
    } else {
      // Update form controls using patchValue
      taskList.patchValue({
        is_saved: true,
        edit_icon: true,
        is_cancelled: false
      });
      this.api.showSuccess('Task saved.');
    }
    console.log(this.taskCategoryForm.value, 'clicked on save button')
  }

  editTask(index1: any) {
    const taskList = this.dynamicArray.at(index1) as FormGroup;
    taskList.patchValue({
      is_saved: false,
      edit_icon: false,
      is_cancelled: true
    });
    const currentTaskName = taskList.get('task_name')?.value;
    taskList.addControl('original_task_name', new FormControl(currentTaskName));
    // this.taskCategoryForm.value.task_list.forEach((element: any, index: any) => {
    //   if (index1 === index) {
    //     element['is_saved'] = false;
    //     element['is_cancelled'] = true;
    //   }
    // });
    console.log(this.taskCategoryForm.value, 'clicked on edit button')
  }
  cancelEdit(index1: any) {
    const taskList = this.dynamicArray.at(index1) as FormGroup;
    const originalTaskName = taskList.get('original_task_name')?.value;
    if (originalTaskName !== undefined) {
      taskList.patchValue({
        task_name: originalTaskName
      });
    }
    taskList.removeControl('original_task_name');
    // Revert changes for the task
    taskList.patchValue({
      is_saved: true,
      is_cancelled: false,
      edit_icon: true,
    });

    // this.taskCategoryForm.value.task_list.forEach((element: any, index: any) => {
    //   if (index1 === index) {
    //     element['is_saved'] = true;
    //     element['is_cancelled'] = false;
    //   }
    // });
  }


  update() {
    if (this.taskCategoryForm.invalid) {
      this.api.showError('Please enter the mandatory fields!');
      this.taskCategoryForm.markAllAsTouched();
    }
    else {
      const taskList = this.taskCategoryForm.value.task_list;
      let allTasksValid = true;
      taskList.forEach((element: any) => {
        if (element.task_name.trim() === '' && element.is_saved === false) {
          this.api.showWarning('Task name cannot be empty.');
          allTasksValid = false;
        }
        else if (element.task_name.trim() !== '') {
          if (element.is_saved === false) {
            this.api.showWarning('Please click on the ✅ to save your task.');
            allTasksValid = false;
          }
        }
      });
      // api will trigger if it is true 
      if (allTasksValid) {
        let tempList: any;
        this.taskCategoryForm.value['task_list'].forEach((element, i) => {
          element.id = i + 1
        });
        tempList = this.taskCategoryForm.value['task_list'].map(({ id, task_name }) => ({
          id,
          task_name
        }));
        const data = {
          tpc_name: this.taskCategoryForm.value['tpc_name'],
          task_list: tempList,
          organization_id: this.taskCategoryForm.value['organization_id']
        }

        this.api.updateProjectTaskCategory(this.id,data).subscribe(response=>{
          //console.log(response,"RESPONSE----")
          if(response){
            this.api.showSuccess('Project category updated successfully');
            this.taskCategoryForm.reset();
            this.router.navigate(['/task/list'])
          }
          else{
            this.api.showError('Error!')
          }
        },((error:any)=>{
          this.api.showError(error?.error.error.message)
        })
        )
      }
    }
  }
}
