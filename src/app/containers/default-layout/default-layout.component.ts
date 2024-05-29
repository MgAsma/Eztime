import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { navItems } from '../../views/_nav';
import { navItems1 } from '../../views/_nav1';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
  iconSize = false;
  user_role_Name: any;
  user_name: string;
  public navItems = navItems;
  public nav1 = navItems1;
  currentUrl: any = '';
  currentUrlName: any = '';
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };
  admin: any;
  permission: any;
  sidebarNavItems: any;
  config: string;
  access: any = [];
  user_id: any;
  org_id: string;

  headerNav = [
    {
      link: '/profile',
      page: 'Profile',
      icons: 'bi bi-person'
    },
    // {
    //   link:'../register',
    //   page:'Register',
    //   icons:'bi bi-person-add'
    // },
    {
      link: '/changePassword',
      page: 'Change Password',
      icons: 'bi bi-key'
    },
    {
      link: '/logout',
      page: 'Logout',
      icons: 'bi bi-power'
    }
  ]

  constructor(private ngxService: NgxUiLoaderService,
    private api: ApiserviceService, private modalService: NgbModal,private cdref: ChangeDetectorRef,
    private router: Router) {
      this.config = sessionStorage.getItem('user_role_name');
    
}
  ngOnInit() {
    this.user_role_Name = sessionStorage.getItem('user_role_name');
    let role_id = sessionStorage.getItem('user_role_id');
    this.user_name = sessionStorage.getItem('user_name');
    this.getUserControls(role_id)
    this.ngxService.start();
    setTimeout(() => {
      this.ngxService.stop();
    }, 1000);
    this.ngxService.startBackground("do-background-things");
    this.ngxService.stopBackground("do-background-things");
    this.ngxService.startLoader("loader-01");
    setTimeout(() => {
      this.ngxService.stopLoader("loader-01");
    }, 1000);
    // this.access = JSON.parse(sessionStorage.getItem('user_accessibilty'))
    // //console.log(this.access,"ACCESS")

    //console.log(this.navItems,"ADMIN NAVITEMS-------")
    

  }

  getUserControls(role_id) {
    this.org_id = sessionStorage.getItem('org_id')
    this.api.getUserRoleById(`id=${role_id}&page_number=1&data_per_page=10&pagination=TRUE&organization_id=${this.org_id}`).subscribe(res => {
      if (res) {
        this.permission = res['data'][0].permissions;
        if (this.permission.length > 0) {
          const modifiedData = this.permission.map(permissionObj => {
            const newObj = {};

            Object.keys(permissionObj).forEach((key) => {
              let modifiedKey = key;

              permissionObj[key].forEach(permission => {
                if (permission.includes("VIEW")) {
                  switch (key) {
                    case 'MY_LEAVES':
                      modifiedKey = 'My Leaves';
                      break;
                    case 'LEAVE_MASTER':
                      modifiedKey = 'Leave Master';
                      break;
                    case 'OFFICE_WORKING_DAYS':
                      modifiedKey = 'Office Working Day';
                      break;
                    case 'ADD_ON_LEAVE_REQUEST':
                      modifiedKey = 'Add On Leaves Request';
                      break;
                    case 'APPLIED/APPROVIED_LEAVES':
                      modifiedKey = 'Applied Approved Leaves';
                      break;
                    case 'PEOPLE_TIMESHEET':
                      modifiedKey = 'Timesheets';
                      break;
                    case 'MONTH_APPROVAL_TIMESHEET':
                      modifiedKey = 'Month Timesheet';
                      break;
                    case 'APPROVAL_CONFIGURATION':
                      modifiedKey = 'Approval Configuration';
                      break;
                    case 'DEAD_LINE_CROSSED':
                      modifiedKey = 'Deadline Crossed';
                      break;
                    case 'TODAY_APPROVAL_TIMESHEET':
                      modifiedKey = 'Todays Approvals';
                      break;
                    case 'PROJECTS':
                      modifiedKey = 'Projects';
                      break;
                    case 'PROJECT_STATUS':
                      modifiedKey = 'Project Status';
                      break;
                    case 'PEOPLE_TIMESHEET_CALENDER':
                      modifiedKey = 'Timesheet Calender';
                      break;
                    case 'PROJECT_TASK_CATEGORIES':
                      modifiedKey = 'Project Category ';
                      break;
                    case 'MAIN_CATEGORIES':
                      modifiedKey = 'Main Project Category ';
                      break;
                    case 'SUB_CATEGORIES':
                      modifiedKey = 'Sub Project Category ';
                      break;
                    case 'CLIENTS':
                      modifiedKey = 'Clients';
                      break;
                    case 'TAGS':
                      modifiedKey = 'Tag List';
                      break;
                    case 'PEOPLE':
                      modifiedKey = 'Employees';
                      break;
                    case 'CENTERS':
                      modifiedKey = 'Centers';
                      break;
                    case 'PREFIX/SUFFIX':
                      modifiedKey = 'Prefix/Suffix List';
                      break;
                    case 'ROLES':
                      modifiedKey = 'Role List';
                      break;
                    case 'DEPARTMENT':
                      modifiedKey = 'Department List';
                      break;
                    case 'ACCOUNTS_MENU':
                      modifiedKey = 'Subscription';
                      break;
                    case 'INDUSTRY/SECTOR':
                      modifiedKey = 'Industry/Sector List';
                      break;
                    case 'ORGANIZATION':
                      modifiedKey = 'Organization List';
                      break;
                    case 'REVIEW':
                      modifiedKey = 'Approvals';
                      break;
                      case 'COMPANY':
                        modifiedKey = 'Company';
                        break;

                  }
                }


              })
              newObj[modifiedKey] = permissionObj[key];
              permissionObj[key].forEach(permission => {
                if (permission.includes("CREATE")) {
                  switch (key) {
                    case 'DEPARTMENT':
                      modifiedKey = 'Create Department';
                      break;
                    case 'ROLES':
                      modifiedKey = 'Create Role';
                      break;
                    case 'EMPLOYEE':
                      modifiedKey = 'Create Employee';
                      break;
                    case 'PREFIX/SUFFIX':
                      modifiedKey = 'Create Prefix/Suffix';
                      break;
                    case 'CENTERS':
                      modifiedKey = 'Add Centers';
                      break;
                    case 'TAGS':
                      modifiedKey = 'Add New Tag';
                      break;
                    case 'INDUSTRY/SECTOR':
                      modifiedKey = 'Create Industry/Sector';
                      break;
                    case 'PROJECT_TASK_CATEGORIES':
                      modifiedKey = 'Add New category';
                      break;
                    case 'PROJECTS':
                      modifiedKey = 'Add New Project';
                      break;

                    case 'LEAVE_APPLICATION':
                      modifiedKey = 'Leave Application';
                      break;
                    case 'CLIENTS':
                      modifiedKey = 'Create Client';
                      break;
                    case 'PEOPLE_TIMESHEET':
                      modifiedKey = 'Create new Timesheet';
                      break;
                  }
                }
              })
              newObj[modifiedKey] = permissionObj[key];
              permissionObj[key].forEach(permission => {
                if (permission.includes("ADD")) {
                  switch (key) {
                    case 'ORGANIZATION':
                      modifiedKey = 'Create Organization';
                      break;
                    // Add the remaining cases for ADD here
                  }
                }

              })
              newObj[modifiedKey] = permissionObj[key];
            })
            return newObj;
          })
          const filteredNavItems = this.nav1.map((item) => {
            if (item.children) {
              // Filter out child items that don't have the "VIEW" option
              item.children = item.children.filter((child) => {
                return modifiedData.some((permission) => Object.keys(permission).includes(child.name));
              });

              // Check if any child items remain after filtering
              if (item.children.length > 0) {
                return item;
              } else {
                return null;
              }
            } else {
              // Check if the item name exists in the modifiedData keys
              return modifiedData.some((permission) => Object.keys(permission).includes(item.name)) ? item : null;
            }
          }).filter(Boolean); // Remove null values from the array
          const sidebarOptions = filteredNavItems.map((item) => item.name);
          this.sidebarNavItems = this.nav1.filter((item) => sidebarOptions.includes(item.name));
          this.sidebarNavItems.unshift({
            name: 'Dashboard',
            url: '/dashboards',
            icon: 'bi bi-speedometer',
          });
        }
      }
    })
  }
  getCountDetails() {
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    let id = {
      user_id: this.user_id
    }
  }

  clearStorage(type) {
    if (type['page'] === 'Logout') {
      this.openDialogue()
    }
  }
  openDialogue() {

    const modelRef = this.modalService.open(GenericDeleteComponent, {
      size: <any>'sm'
      ,
      backdrop: true,
      centered: true
    });
    modelRef.componentInstance.title = `Are you sure do you want to logout`;
    modelRef.componentInstance.message = `Logout`;
    modelRef.componentInstance.status.subscribe(resp => {
      if (resp == "ok") {
        this.api.showSuccess('You have been logged out!')
        this.router.navigate(['/login'])
        sessionStorage.clear()
        location.reload();
        modelRef.close();
      }
      else {
        modelRef.close();
      }
    })
  }
  getHeaderNavStyles(type): any {
    switch (type['page']) {
      case 'Logout':
        return 'title-logout'
      case 'Change Password':
        return 'py-1'
    }
  }
  navigateTo(headNavdata:any){
if(headNavdata.page==='Logout'){
  this.openDialogue();
}else{
  this.router.navigate([`${headNavdata.link}`]);
}
  }

  
}
