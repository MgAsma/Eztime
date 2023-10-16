import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-roles-access',
  templateUrl: './roles-access.component.html',
  styleUrls: ['./roles-access.component.scss']
})
export class RolesAccessComponent implements OnInit {
  rolesAccessForm:FormGroup
  id: any;
  mainMenu:any =[]
  show = true;
  role: string;
  constructor(private _fb:FormBuilder,private routes:ActivatedRoute) {
    this.id =this.routes.snapshot.paramMap.get('id')
    this.role =this.routes.snapshot.paramMap.get('role')
    sessionStorage.setItem('user_role_id',this.id)
    sessionStorage.setItem('user_role_c_side',this.role)
    this.mainMenu =[
      {
        label:'Accounts',
        icon:'fa fa-key',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'accounts',
        path:'accounts-config'
      },
      {
        label:'Roles',
        icon:'fa fa-handshake',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'roles',
        path:'roles-config'
      },
      {
        label:'Department',
        icon:'fa fa-th-large',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'department',
        path:'department-config'
      },
      {
        label:'People',
        icon:'fa fa-user-plus',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'people',
        path:'people-config'
      },
      {
        label:'Leave/Holiday List',
        icon:'fa fa-calendar',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'leave/holiday',
        path:`leave/holiday-config`
      },
      {
        label:'Timesheet',
        icon:'fa fa-clock',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'timesheet',
        path:'timesheet-config'
      },
      {
        label:'Industry/Sector',
        icon:'fa fa-building',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'industry/sector',
        path:'industry-config'
      },
      {
        label:'Review',
        icon:'fa fa-sitemap',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'review',
        path:'review'
      },
      {
        label:'Clients',
        icon:'fa fa-building',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'clients',
        path:'clients-config'
      },
      {
        label:'Project Status',
        icon:'fa fa-list',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'projectStatus',
        path:'project-status-config'
      },
      {
        label:'Project Task Categories',
        icon:'fa fa-tags',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'projectTaskCategories',
        path:'project-task-config'
      },
      {
        label:'Projects',
        icon:'fa fa-folder-open',
        type:'radio',
        class:'form-check-input',
        labelClass:'form-check-label',
        checked:false,
        containerClass:'form-check',
        controlName:'projects',
        path:'projects'
      },
    ]
   }
  
  
  ngOnInit(): void {
  // this.mainMenu.forEach(menu =>{
  //  let controlName =menu.controlName
  //   this.rolesAccessForm = this._fb.group({
  //     controlName : controlName
  //   })
  // })

  }
  onChange(items){
    if(items ){
      this.show = !this.show 
    } 
  }
  
}
