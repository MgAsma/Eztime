import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent implements OnInit {
  BreadCrumbsTitle: any = 'Create category';
  taskCategoryForm!: FormGroup

  allTaskCategory: any = [];
  taskCategory: any;
  file_templates_list!: FormArray
  task_name!: FormArray
  uploadFile: any;
  url: any;
  fileUrl: any;
  baseImg: any = [];
  orgId: any;
  isSaved: boolean = false;

  constructor(
    private builder: FormBuilder,
    private api: ApiserviceService,
    private location: Location,
    private common_service: CommonServiceService,
    private modalService: NgbModal
  ) { }

  initForm() {
    this.taskCategoryForm = this.builder.group({
      tpc_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      task_list: this.builder.array([]),
      organization_id: this.orgId
      // task_list: this.builder.array([]),
      // file_templates_list: this.builder.array([]),
    });
    this.dynamicArray.push(this.builder.group({
      id: [''],
      task_name: ['', [Validators.pattern(/^\S.*$/), Validators.required]],
      is_saved: false,
      edit_icon: false,
      is_cancelled: false
    }));
    console.log(this.taskCategoryForm.value)
    // Adding task fields to task_list FormArray
    // const taskArray = this.taskCategoryForm.get('task_list') as FormArray;
    // taskArray.push(this.taskFields());
  }


  saveTask(index: any) {

  }
  // new ends herer



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
  goBack(event) {
    event.preventDefault(); // Prevent default back button behavior
    this.location.back();
  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('org_id')
    this.initForm();
  }
  get f() {
    return this.taskCategoryForm.controls;
  }
 
  taskFieldEntering(event: any, index: any) {
    if (event.target.value) {
      console.log('present', event.target.value)
    } else {
      console.log('no data', event.target.value)
    }
    console.log(this.taskCategoryForm.controls['task_list'], 'only task list')
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

  addTaskCategory() {
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
        console.log(data, 'data form')
        this.api.addProjectTaskCategoryDetails(data).subscribe(res => {
          if (res) {
            this.api.showSuccess('Project category added successfully!');
            this.taskCategoryForm.reset();
            this.initForm()
          }
          else {
            this.api.showError('Error!')
          }
        }, ((error: any) => {
          this.api.showError(error?.error.error.message)
        })
        )
      }

    }
  }


}
