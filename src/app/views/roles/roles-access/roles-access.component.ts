import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-roles-access',
  templateUrl: './roles-access.component.html',
  styleUrls: ['./roles-access.component.scss']
})
export class RolesAccessComponent implements OnInit {
  BreadCrumbsTitle: any = 'Roles Accessibilty';
  rolesAccessForm: FormGroup
  designation_id: any;
  mainMenu: any = []
  show = true;
  role: string;
  user_id: any;
  organization_id: any;
  hasAccessData: boolean = false;
  allSelected:boolean = false;
  selectedLabelNames: any = [];
  itemId: any;
 buttonName:any;
  constructor(private _fb: FormBuilder, private router:Router, private routes: ActivatedRoute, private common_service: CommonServiceService,
    private api: ApiserviceService,
  ) {
    this.user_id = sessionStorage.getItem('user_id')
    this.designation_id = this.routes.snapshot.paramMap.get('id')
    this.organization_id = sessionStorage.getItem('organization_id')
    // this.mainMenu = [
    //   {
    //     label: 'Accounts',
    //     icon: 'fa fa-key',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'accounts',
    //     path: 'accounts-config'
    //   },
    //   {
    //     label: 'Roles',
    //     icon: 'fa fa-handshake',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'roles',
    //     path: 'roles-config'
    //   },
    //   {
    //     label: 'Department',
    //     icon: 'fa fa-th-large',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'department',
    //     path: 'department-config'
    //   },
    //   {
    //     label: 'People',
    //     icon: 'fa fa-user-plus',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'people',
    //     path: 'people-config'
    //   },
    //   {
    //     label: 'Leave/Holiday List',
    //     icon: 'fa fa-calendar',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'leave/holiday',
    //     path: `leave/holiday-config`
    //   },
    //   {
    //     label: 'Timesheet',
    //     icon: 'fa fa-clock',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'timesheet',
    //     path: 'timesheet-config'
    //   },
    //   {
    //     label: 'Industry/Sector',
    //     icon: 'fa fa-building',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'industry/sector',
    //     path: 'industry-config'
    //   },
    //   {
    //     label: 'Review',
    //     icon: 'fa fa-sitemap',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'review',
    //     path: 'review'
    //   },
    //   {
    //     label: 'Clients',
    //     icon: 'fa fa-building',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'clients',
    //     path: 'clients-config'
    //   },
    //   // {
    //   //   label:'Project Status',
    //   //   icon:'fa fa-list',
    //   //   type:'radio',
    //   //   class:'form-check-input',
    //   //   labelClass:'form-check-label',
    //   //   checked:false,
    //   //   containerClass:'form-check',
    //   //   controlName:'projectStatus',
    //   //   path:'project-status-config'
    //   // },
    //   {
    //     label: 'Project Task Categories',
    //     icon: 'fa fa-tags',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'projectTaskCategories',
    //     path: 'project-task-config'
    //   },
    //   {
    //     label: 'Projects',
    //     icon: 'fa fa-folder-open',
    //     type: 'radio',
    //     class: 'form-check-input',
    //     labelClass: 'form-check-label',
    //     checked: false,
    //     containerClass: 'form-check',
    //     controlName: 'projects',
    //     path: 'projects'
    //   },
    // ]

  }


  ngOnInit(): void {
    this.selectedLabelNames = [];
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.getDesignationNameFromDesignationId();
    this.rolesAccess();
  }

  getDesignationNameFromDesignationId(){
    this.api.getDesignationListById(this.designation_id).subscribe((res:any)=>{
     this.role= res.designation_name;
      })
   }
  rolesAccess() {
    this.api.userAccess(this.user_id).subscribe(
      (data: any) => {
        // console.log('user access', data,)
        this.mainMenu = data.access_list;
        this.getAccessbilitiesByDesignationId();
      },
      (error: any) => {
        console.log('error', error)
      }
    )
  }

  getAccessbilitiesByDesignationId() {
    this.api.getAccessByDesignationId(`?${'designation'}=${this.designation_id}&${'organization'}=${this.organization_id}`).subscribe(
      (res: any) => {
        console.log(res);
        if (res.length == 0) {
          this.hasAccessData = false;
          this.buttonName = 'Submit';
        } else {
          this.itemId = res[0].id;
          this.buttonName = 'Update Changes'
          this.hasAccessData = true;
          this.mainMenu.forEach((element1: any) => {
            element1['is_checked'] = false;
            res[0].access_list.forEach((element2: any) => {
              if (element1.name == element2) {
                element1['is_checked'] = true;
                this.selectedLabelNames.push(element1.name)
              }
            })
          },
          )
          this.matchingLength();
          // console.log(this.selectedLabelNames)
        }
      },
      (error: any) => {
        console.log('error', error)
      }
    )
  }

  matchingLength(){
    if(this.mainMenu.length==this.selectedLabelNames.length){
      this.allSelected = true;
    } else{
      this.allSelected = false;
    }
  }

  // select single or muitiple checkboxes
  SelectedCheckboxLabels(event: any, label: any) {
    // console.log(label);
    if (event.target.checked == true) {
      if (!this.selectedLabelNames.includes(label)) {
        this.selectedLabelNames.push(label);
      }
    } else {
      this.selectedLabelNames = this.selectedLabelNames.filter(item => item != label)
    }
    this.matchingLength();
    // console.log('selectedLabelNames', this.selectedLabelNames)
    
  }

  // select all checkboxes
  selectAll(event: any) {
    this.selectedLabelNames = []
    this.mainMenu.forEach((element1: any) => {
      if (event.target.checked == true) {
        element1['is_checked'] = true;
        this.selectedLabelNames.push(element1.name);
      } else{
        element1['is_checked'] = false;
        this.selectedLabelNames = []
      }
    })
    console.log( this.selectedLabelNames)
  }

  modifyChanges(text: any) {
    // console.log(text);
    if(this.selectedLabelNames.length==0){
      this.api.showError('Please give access to the designation')
    }
    else{
    let data = {
      designation: this.designation_id,
      organization: this.organization_id,
      access_list: this.selectedLabelNames
    }
    // console.log(data)
    if (text === 'add') {
      this.addAccesstoDesignation(data);
    }
    else {
      this.updateAccesstoDesignation(data);
    }
  }
  }



  addAccesstoDesignation(data: any) {
    this.api.postAccessToDesignation(data).subscribe(
      (res: any) => {
        console.log(res);
        this.api.showSuccess(res.message)
        setTimeout(() => {
          this.router.navigate(['/designation/list'])
        }, 2000);
      },
      (error: any) => {
        console.log(error);
        this.api.showError(error);
      }
    )
  }
  updateAccesstoDesignation(data: any) {
    this.api.putAccessToDesignation(this.itemId, data).subscribe(
      (res: any) => {
        console.log(res);
        this.api.showSuccess(res.message);
        this.ngOnInit();
      },
      (error: any) => {
        console.log(error);
        this.api.showError(error);
      }
    )
  }

}
