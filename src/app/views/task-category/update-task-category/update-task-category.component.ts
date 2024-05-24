import { Component,OnInit, } from '@angular/core';
import {  Validators, FormBuilder,FormGroup, FormArray } from '@angular/forms';
import { ApiserviceService } from '../../../service/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonServiceService } from 'src/app/service/common-service.service';
@Component({
  selector: 'app-update-task-category',
  templateUrl: './update-task-category.component.html',
  styleUrls: ['./update-task-category.component.scss']
})
export class UpdateTaskCategoryComponent implements OnInit {
  BreadCrumbsTitle:any='Update category';
  id:any;
  uploadFile:any;
  url:any = [];
  fileUrl:any;
  page: string;
  tableSize: string;
  taskCategoryForm:FormGroup;
  baseImg: any = [];
  file_templates_list: FormArray<any>;
  imgURL: any;
  task_name: FormArray<any>;
  type = 'url';
  base64String: string;
  focusedInputIndex: number;
  // inputTypes: any[];
  imgBaseArr: any = [];
  data:any = {};
  formatError: boolean = false;
  orgId: any;
  constructor(
    private builder:FormBuilder, 
    private api: ApiserviceService,
    private route:ActivatedRoute,
    private router:Router,
    private location:Location,
    private common_service:CommonServiceService
    ) { 
    this.id =this.route.snapshot.paramMap.get('id')
    this.page = this.route.snapshot.paramMap.get('page')
    this.tableSize = this.route.snapshot.paramMap.get('tableSize')
   
  }
  
 goBack(event)
  {
  event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
}
  initForm(){
    this.taskCategoryForm = this.builder.group({
      tpc_name: ['', [Validators.pattern(/^\S.*$/),Validators.required]],
      file_templates_list: this.builder.array([]),
      task_list: this.builder.array([])
    });
   
  }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.orgId = sessionStorage.getItem('org_id')
    this.initForm();
    this.edit()
    setTimeout(() => {
      this.onFocus() 
    }, 1000);
    
  }
  get f(){
    return this.taskCategoryForm.controls;
  }
  
  fileAttachementFields():any{
    // it contains form feild
      return this.builder.group({
        file_base_64:['',Validators.required,Validators.max(5000000)],
        file_template_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
    })
  }
  taskFields(){
    // it contains form feild
   return this.builder.group({
      task_name:['',[Validators.pattern(/^\S.*$/),Validators.required]],
      billable_type:['',Validators.required],
  })}
  get fileOption(){
    return this.taskCategoryForm.get('file_templates_list') as FormArray
  }
  get taskOption(){
    return this.taskCategoryForm.get('task_list') as FormArray
  }
  add(){
    this.file_templates_list = this.taskCategoryForm.get('file_templates_list') as FormArray;
    this.file_templates_list.push(this.fileAttachementFields())
  }
 
  addTask(){
    this.task_name = this.taskCategoryForm.get('task_list') as FormArray;
    this.task_name.push(this.taskFields())
  }
  delete(i:number){
  //console.log(i,"INDEX")
  this.file_templates_list = this.taskCategoryForm.get('file_templates_list') as FormArray;
  this.file_templates_list.removeAt(i)
  }
  deleteTask(i:number){
   this.task_name = this.taskCategoryForm.get('task_list') as FormArray; 
  this.task_name.removeAt(i)
  }
 
  uploadImageFile(event: any, index: number) {
   // console.log(event,"EVENT------------")
    this.type = 'file';
    const fileAttachment = this.fileOption.controls[index] as FormGroup;
    const fileInput = event.target;
    const file = fileInput.files?.[0];
  
   if (file) {
    //  console.log(file,"FILE")
      const fileExtension = file.name.substr(file.name.lastIndexOf('.')).toLowerCase();
      const allowedFormats = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'];
      if (!allowedFormats.includes(fileExtension)) {
        // File format is invalid, set the error
        fileAttachment.get('file_base_64')?.setErrors({ fileFormatInvalid: true });
        this.formatError = true;
        this.api.showError(`Please select the following image format '.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'`)
         
      } else {
        this.formatError = false;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: any) => {
          this.url[index] = event.target.result;
          this.fileUrl = reader.result;
          this.baseImg.push(this.fileUrl);
  
          const fileAttachment = this.fileOption.controls[index] as FormGroup;
          const baseImgIndex = this.baseImg.length - 1;
          fileAttachment.patchValue({
            file_base_64: this.baseImg[baseImgIndex], // Pass a single value instead of an array
            // file_template_name: ''
          });
        }
        fileAttachment.get('file_base_64')?.updateValueAndValidity(); // Manually update the validity status
  
        // Clear the error since the format is now valid
        fileAttachment.get('file_base_64')?.setErrors(null);
        };
      }
    
      //Always manually update the validity status when a file is selected
     fileAttachment.get('file_base_64')?.updateValueAndValidity();
   // }
  
  }
  
  
  update(){
    if (this.taskCategoryForm.invalid) {
      this.taskCategoryForm.markAllAsTouched();
      return;
    }
    else{

          this.taskCategoryForm.value['task_list'].forEach((element,i) => {
            element.id = i + 1
          });
      
           if(this.type === 'file'){
            
            this.data = {
              tpc_name:this.taskCategoryForm.value.tpc_name,
              file_templates_list:this.taskCategoryForm.value.file_templates_list,
              task_list:this.taskCategoryForm.value.task_list,
              organization_id:this.orgId
            }
           }
           else{
            let filterTemplateList = []
            filterTemplateList = this.taskCategoryForm.value.file_templates_list
              // if(filterTemplateList.length === this.this.imgBaseArr.length){
                filterTemplateList.forEach((element,i) => {
                //  console.log(this.imgBaseArr)
                  element.file_base_64 = this.imgBaseArr[i]
                });
              // }
            
               this.data = {
                tpc_name:this.taskCategoryForm.value.tpc_name,
                file_templates_list:filterTemplateList,
                task_list:this.taskCategoryForm.value.task_list,
                organization_id:this.orgId
              }
             // console.log(this.data,"DATA------------>>>>>>>>>")
           }
         
      this.api.updateProjectTaskCategory(this.id,this.data).subscribe(response=>{
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
  
 
  onFocus() {
    //console.log(this.url, "URL");
  
    const promises = this.url.map(url =>
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
    );
  
    Promise.all(promises)
      .then(results => {
        this.imgBaseArr = results.map(result => result.toString());
        // Patch the base64 values in the respective input fields
        const fileAttachmentsArray = this.taskCategoryForm.get('file_templates_list') as FormArray;
       
        for (let i = 0; i < fileAttachmentsArray.length; i++) {
          const fileAttachmentGroup = fileAttachmentsArray.at(i) as FormGroup;
        
          fileAttachmentGroup.patchValue({
            file_base_64: this.imgBaseArr[i]
          });
        }
      })
      .catch(error => {
        console.error("Error converting URLs to base64:", error);
      });
     
    //this.taskCategoryForm.get('file_templates_list')?.markAsTouched();
  }

  focusInput(index: number) {
      this.type = 'file'
      this.focusedInputIndex = index;
    }

  edit(){
    let params = {
      page_number:this.page,
      data_per_page:this.tableSize,
      org_ref_id:this.orgId
    }
    
       this.api.getCurrentProjectTaskCategoryDetails(this.id,params).subscribe((res:any)=>{
        ////console.log(res,"DATA+++++",res.result.data[0].file_templates_list,res.result.data[0].task_list.length)
        this.taskCategoryForm.patchValue({
          tpc_name: res.result.data[0].tpc_name
        });
        if(res.result.data[0].file_templates_list.file_templates_list === undefined || res.result.data[0].file_templates_list.file_templates_list.length === 0){
            // Adding file attachment fields to file_templates_list FormArray
         const fileAttachmentsArray = this.taskCategoryForm.get('file_templates_list') as FormArray;
         fileAttachmentsArray.push(this.fileAttachementFields());
  
        }
       
        else{
        
        const fileAttachmentList = res.result.data[0].file_templates_list.file_templates_list
        const fileAttachmentsArray = this.taskCategoryForm.get('file_templates_list') as FormArray;
        fileAttachmentList.forEach(fileAttachment => {
          // this.onFocus(fileAttachment['file_path'])
          fileAttachmentsArray.push(this.builder.group({
            file_base_64: [fileAttachment.file_path, [Validators.required]],
            file_template_name: [fileAttachment.file_template_name, [Validators.pattern(/^\S.*$/),Validators.required]]
          }));
          this.url.push(fileAttachment.file_path)
          //console.log(this.url,"URLPATCH")
        });
      
        //console.log(res.result.data[0].task_list,"LENGTH")
        if(res.result.data[0].task_list.length === undefined || res.result.data[0].task_list.length === 0){
          // Adding task fields to task_list FormArray
          const taskArray = this.taskCategoryForm.get('task_list') as FormArray;
          taskArray.push(this.taskFields());
          }
          else{
            const taskList =res.result.data[0].task_list
            const taskArray = this.taskCategoryForm.get('task_list') as FormArray;
            taskList.forEach(task => {
              taskArray.push(this.builder.group({
                task_name: [task.task_name,[Validators.required,Validators.pattern(/^\S.*$/),]],
                billable_type: [task.billable_type, [Validators.required]],
              }));
            });
          }
      }
       })  
      }
      
      
  
}
