import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from '../../../service/apiservice.service';
import { CommonServiceService } from '../../../service/common-service.service';
import { environment } from '../../../../environments/environment';
import { RazorpayService } from '../../../service/razorpay.service';

@Component({
  selector: 'app-roles-access',
  templateUrl: './roles-access.component.html',
  styleUrls: ['./roles-access.component.scss']
})
export class RolesAccessComponent implements OnInit {
  // @Output() allChildrens = new EventEmitter<any>();
  BreadCrumbsTitle: any = 'Roles Accessibilty';
  rolesAccessForm: FormGroup
  designation_id: any;
  mainMenu: any = []
  show = true;
  role: string;
  user_id: any;
  organization_id: any;
  hasAccessData: boolean = false;
  allSelected: boolean = false;
  selectedLabelNames: any = [];
  itemId: any;
  buttonName: any;
  constructor(private _fb: FormBuilder, private router: Router, private routes: ActivatedRoute, private common_service: CommonServiceService,
    private api: ApiserviceService, private razorpay: RazorpayService
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
    this.allrolesList();
  }

  razorpayTest() {
    let data = {
      'total_amount': 200
    }
    this.api.getRazorpayFromData(data).subscribe(
      (res: any) => {
        console.log(res)
        this.openRazorpay(res);
      },
      (error: any) => {
        console.log('error', error)
      }
    )
  }

  openRazorpay(data: any) {
    console.log(data, 'data')
    const options: any = {
      key: environment.Razorpay_test_key,
      amount: data.amount,
      currency: 'INR',
      name: 'Project Ace',
      description: '',
      image: '/assets/images/logo.png',
      order_id: data.razor_pay_order_id,
      modal: {
        escape: false,
      },
      theme: {
        color: '#0e2732',
      },
      handler: (response: any, error: any) => {
        if (response) {
          //console.log('response',response)
          const reqData: any = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          // this.trainingService.slotPlaceOrderConfirmation(reqData).subscribe(
          //   (res:any)=>{
          //    //console.log('slot booked',res)
          //     this.toasterService.showSuccess(res?.message);
          //     this.pilotSlotSelectorFrom.reset();
          //     // this.ngOnInit();
          //     setTimeout(() => {
          //       this.ngZone.run(() => {
          //         this.router.navigate(['/inner/partner/pilot-management/add-batch-students']);
          //       });
          //     }, 1000);
          //   },
          //   (error:any)=>{
          //    //console.log('error',error)
          //   }
          // )
          //  Api Call
        }
        if (error) {
          console.log('Error', error);
          // this.toasterService.showError('Transaction Failed.');
        }
      },
    };
    options.modal.ondismiss = () => {
      this.api.showError('Transaction cancelled.');
    };
    this.razorpay.initiatePayment(options);
  }


  getDesignationNameFromDesignationId() {
    this.api.getDesignationListById(this.designation_id).subscribe((res: any) => {
      this.role = res.designation_name;
    })
  }

  // side bar module list
  allrolesList() {
    this.api.userAccess(this.user_id).subscribe(
      (data: any) => {
        console.log('all list', data,)
        this.mainMenu = data.access_list;
        this.getAccessbilitiesByDesignationId();
      },
      (error: any) => {
        console.log('error', error)
      }
    )
  }
  // get access given data
  getAccessbilitiesByDesignationId() {
    this.api.getAccessByDesignationId(`?designation=${this.designation_id}&organization=${this.organization_id}`).subscribe(
      (res: any) => {
        // console.log(res, 'sub modules')
        this.receiveDataFromChild(res[0])
      }, 
      (error)=>{
        console.log(error)
      }
    )

  }

// getting data from child
  receiveDataFromChild(data: any) {
    // console.log('from child', data)
    this.mainMenu.forEach((access: any) => {
      const moduleMatch = data.access_list.find((module_name: any) => module_name.name === access.name);
      if (moduleMatch) {
        access['access_given'] = true;
      }
      if (!moduleMatch) {
        access['access_given'] = false;
      }
    });
    // console.log(this.mainMenu, 'this.mainMenu')
  }

  allChildrens: any = []
  passingChildrenToTabel(data: any) {
    console.log(data)
    let access_data = {
      'name': data.name,
      'access': data.access,
    }
    this.allChildrens = access_data;
  }
}
