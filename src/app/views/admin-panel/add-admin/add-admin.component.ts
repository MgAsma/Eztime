import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {
  breadCrumbsTitle: string = 'Add Admins';
  adminList: { isEditing: boolean }[] = [];
  adminForm!: FormGroup;
  isAdminForm: boolean = false;

  constructor(private fb: FormBuilder,
    private commonService: CommonServiceService
  ) {}

  openAdminForm(){
    this.addAdmin()
    this.isAdminForm = !this.isAdminForm
  }
  ngOnInit(): void {
    this.commonService.setTitle(this.breadCrumbsTitle);
    this.adminForm = this.fb.group({
      admins: this.fb.array([])
    });
    this.addAdmin()
  }

  get adminFormArray() {
    return this.adminForm.get('admins') as FormArray;
  }

  getAdminFormGroup(index: number): FormGroup {
    return this.adminFormArray.at(index) as FormGroup;
  }

  addAdmin() {
    const adminGroup = this.fb.group({
      admin_name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      admin_email_id: ['', [Validators.required, Validators.email]],
      admin_phone_number: ['', [Validators.required, Validators.minLength(10)]],
      is_active: [true]
    });

    this.adminFormArray.push(adminGroup);
    this.adminList.push({ isEditing: true });
  }

  toggleFormControlState(index, isEditing: boolean) {
    this.adminList[index].isEditing = isEditing;
  }

  saveAdmin(index) {
    if (this.getAdminFormGroup(index).valid) {
      this.toggleFormControlState(index, false);
      // Save admin logic
    }
  }

  deleteAdmin(index) {
    this.adminFormArray.removeAt(index);
    this.adminList.splice(index, 1);
  }

  organizationSubmit() {
    if (this.adminForm.valid) {
      // Submit the form
      console.log(this.adminForm.value);
    }
  }

}
