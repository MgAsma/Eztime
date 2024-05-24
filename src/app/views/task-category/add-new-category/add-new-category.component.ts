import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder,FormGroup, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent implements OnInit {
  BreadCrumbsTitle:any='Create category';
  taskCategoryForm! : FormGroup 

  allTaskCategory:any=[];
  taskCategory:any;
  file_templates_list!:FormArray
  task_name!:FormArray
  uploadFile:any;
  url:any;
  fileUrl:any;
  baseImg: any= [];
  orgId: any;

  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private location:Location,
    private common_service:CommonServiceService
    ) { }

  initForm(){
    this.taskCategoryForm = this.builder.group({
      tpc_name: ['', [Validators.pattern(/^\S.*$/),Validators.required]],
      file_templates_list: this.builder.array([]),
      task_list: this.builder.array([]),
      organization_id:this.orgId
    });
    
    // Adding file attachment fields to file_templates_list FormArray
    const fileAttachmentsArray = this.taskCategoryForm.get('file_templates_list') as FormArray;
    fileAttachmentsArray.push(this.fileAttachementFields());
  
    // Adding task fields to task_list FormArray
    const taskArray = this.taskCategoryForm.get('task_list') as FormArray;
    taskArray.push(this.taskFields());
  }
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
  goBack(event)
  {
  event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  }
  ngOnInit(): void { 
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('org_id')
    this.initForm();
  }
  get f(){
    return this.taskCategoryForm.controls;
  }
  fileAttachementFields():any{
    // it contains form feild
      return this.builder.group({
        file_base_64:['',[Validators.required,this.fileFormatValidator]],
        file_template_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
    })
  }
  taskFields(){
    // it contains form feild
   return this.builder.group({
      task_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      billable_type:['',Validators.required],
      id:['']
  })}
  get fileOption(){
    return this.taskCategoryForm.get('file_templates_list') as FormArray
  }
  get taskOption(){
    return this.taskCategoryForm.get('task_list') as FormArray
  }
  add(){
    this.file_templates_list= this.taskCategoryForm.get('file_templates_list') as FormArray;
    this.file_templates_list.push(this.fileAttachementFields())
  }
  addTask(){
    this.task_name= this.taskCategoryForm.get('task_list') as FormArray;
    this.task_name.push(this.taskFields())
  }
  delete(i:number){
  //console.log(i,"INDEX")
  this.file_templates_list.removeAt(i)
  }
  deleteTask(i:number){
  this.task_name.removeAt(i)
  }
 
  // uploadImageFile(event:any){
  //   this.uploadFile =  event.target.files[0];
  //   if(event.target.files && event.target.files[0]){
  //     const reader =new FileReader();
  //     reader.readAsDataURL(event.target.files[0])
  //     reader.onload = (event:any)=>{
  //       this.url = event.target.result;
  //       this.fileUrl= reader.result
  //       this.baseImg.push(this.fileUrl)
  //       //console.log("BASE",this.baseImg,this.taskCategoryForm.value,"ONCHANGEVALS")
  //       this.fileOption.controls.forEach((element,i) => {
  //         const fileAttachment = element as FormGroup;
  //         this.baseImg.forEach(bs =>{
  //           fileAttachment.patchValue({
  //             file:bs,
  //             file_name:this.uploadFile.name
  //           });
  //         })
          
  //       });
       
  //   }
  //   }
  // }
  uploadImageFile(event:any, i: number){
    this.uploadFile =  event.target.files[0];
    if(event.target.files && event.target.files[0]){
      const reader =new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event:any)=>{
        this.url = event.target.result;
        this.fileUrl= reader.result
        this.baseImg.push(this.fileUrl)
        //console.log("BASE",this.baseImg,this.taskCategoryForm.value,"ONCHANGEVALS")
        
        const fileAttachment = this.fileOption.controls[i] as FormGroup;
        const baseImgIndex = this.baseImg.length - 1;
        fileAttachment.patchValue({
          file_base_64: this.baseImg[baseImgIndex],
          file_template_name: this.uploadFile.name
        });
      }
    }
  }
  addTaskCategory(){
    if(this.taskCategoryForm.invalid){
      this.api.showError('Invalid');
      this.taskCategoryForm.markAllAsTouched();
    }
    else{   
      //console.log(this.taskCategoryForm.value['task_list'],"SUBMIT")
      this.taskCategoryForm.value['task_list'].forEach((element,i) => {
        element.id = i + 1
      });
         
      this.api.addProjectTaskCategoryDetails(this.taskCategoryForm.value).subscribe(res =>{
        if(res){
          this.api.showSuccess('Project category added successfully!');
          this.taskCategoryForm.reset();
          this.initForm()
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
