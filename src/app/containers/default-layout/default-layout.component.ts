import { Component } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { navItems } from '../../views/_nav';
import { navItems1 } from '../../views/_nav1';
import { ApiserviceService } from 'src/app/service/apiservice.service';

@Component({
  selector:'app-default-layout',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
  iconSize = false
  public navItems = navItems;
  public nav1 = navItems1;
 
  
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
 

  constructor(private ngxService: NgxUiLoaderService,
    private api:ApiserviceService) {}
  ngOnInit(){
    this.config = sessionStorage.getItem('user_role_name')
    let role_id = sessionStorage.getItem('user_role_id')
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
  
 getUserControls(role_id){
  this.org_id = sessionStorage.getItem('org_id')
  this.api.getUserRoleById(`id=${role_id}&page_number=1&data_per_page=10&pagination=TRUE&organization_id=${this.org_id}`).subscribe(res => {
    if (res) {
      this.permission = res['data'][0].permissions;
      if(this.permission.length > 0){
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
                      modifiedKey = 'Project List';
                    break;
                    case 'PROJECT_STATUS':
                    modifiedKey = 'Project Status';
                    break;
                    case 'PEOPLE_TIMESHEET_CALENDER':
                    modifiedKey = 'Timesheet Calender';
                    break;
                    case 'PROJECT_TASK_CATEGORIES':
                    modifiedKey = 'Category List';
                    break;
                    case 'MAIN_CATEGORIES':
                      modifiedKey = 'Main Category List';
                    break;
                    case 'SUB_CATEGORIES':
                      modifiedKey = 'Sub Category List';
                    break;
                    case 'CLIENTS':
                      modifiedKey = 'Client List';
                    break;
                    case 'TAGS':
                      modifiedKey = 'Tag List';
                    break;
                    case 'PEOPLE':
                      modifiedKey = 'People List';
                    break;
                    case 'CENTERS':
                      modifiedKey = 'Centers List';
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
                    case 'ACCOUNTS_MENU' :
                      modifiedKey = 'Subscription';
                    break;
                    case 'INDUSTRY/SECTOR' :
                      modifiedKey = 'Industry/Sector List';
                    break;
                    case 'ORGANIZATION':
                      modifiedKey = 'Organization List';
                    break;
                    case 'REVIEW':
                      modifiedKey = 'Review';
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
                          case 'PEOPLE':
                            modifiedKey = 'Create People';
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
 getCountDetails(){
  this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
  let id ={
    user_id:this.user_id
  }
}
}
