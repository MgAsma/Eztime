import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { ForgotPasswordComponent } from './views/pages/forgot-password/forgot-password.component';
import { OtpComponent } from './views/pages/otp/otp.component';
import { ChangePasswordComponent } from './views/pages/change-password/change-password.component';
import { CreateRoleComponent } from './views/pages/create-role/create-role.component';
import { ForgotChangeComponent } from './views/pages/forgot-change/forgot-change.component';
import { ActivateChildGuard } from './activate-child.guard'
import { AuthGuard } from './auth.guard'
import { OrgAuthGuard } from './org-auth.guard';
import { NotificationComponent } from './views/pages/notification/notification.component';



const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // {
  //   path:'role',
  //   component:CreateRoleComponent
  // },
  // {
  //   path: '',
  //   redirectTo: 'role',
  //   pathMatch: 'full'
  // },
 
  // {
  //   path: 'dashboards',
  //   loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
  // },

  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivateChild:[ActivateChildGuard],
    children: [
      {
        path: 'dashboards', loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'department', loadChildren: () => import('./views/department/department.module').then(m => m.DepartmentModule)
      },
      {
        path: 'accounts', loadChildren: () => import('./views/accounts/accounts.module').then(m => m.AccountsModule)
      },
      {
        path:'generic',loadChildren:() => import('./generic-delete/generic-delete.module').then(m =>m.GenericDeleteModule)}
      ,
      {
        path: 'role',
        loadChildren: () => import('./views/roles/roles.module').then(m => m.RolesModule)
      },
      {
        path:'people', loadChildren:() => import ('./views/people/people.module').then( m => m.PeopleModule)
      },
      {
        path:'leave',loadChildren:()=> import('./views/leave-holiday-list/leave-holiday-list.module').then(m => m.LeaveHolidayListModule)
      },

      {
        path:'industry',loadChildren:()=> import('./views/industry-sector/industry-sector.module').then(m => m.IndustrySectorModule)
      },
      {
        path:'client', loadChildren:()=> import('./views/client/client.module').then(m => m.ClientModule)
      },
      {
        path:'status',loadChildren:()=>import('./views/project-status/project-status.module').then( m => m.ProjectStatusModule)
      },
      {
        path:'task', loadChildren:() => import('./views/task-category/task-category.module').then( m => m.TaskCategoryModule)
      },
      {
        path:'project', loadChildren:()=> import('./views/project/project.module').then(m => m.ProjectModule)
      },
      {
        path: 'review', loadChildren:()=> import('./views/review/review.module').then((m)=>m.ReviewModule)
      },
      {
        path:'approvalTimesheet', loadChildren:()=> import('./views/approval-timesheet/approval-timesheet.module').then(m => m.ApprovalTimesheetModule)
      },
      {
        path:'myTimesheet', loadChildren:()=>import('./views/my-timesheet/my-timesheet.module').then(m => m.MyTimesheetModule)
      },
      {
        path:'profile',loadChildren:()=>import('./views/profile/profile.module').then(m =>m.ProfileModule)
      },
      {
        path:'organization',canActivate:[OrgAuthGuard],loadChildren:()=>import('./views/organization/organization.module').then(m => m.OrganizationModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
      
    ],
    
  },
  
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  
  {
    path: 'register',canActivate:[AuthGuard],
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
    data: {
      title: 'Forgot Password Page'
    },
    
  },
  {
    path: 'forgotChange',
    component: ForgotChangeComponent,
    data: {
      title: 'Forgot Change Page'
    }
  },
  {
    path: 'otp',
    component: OtpComponent,
    data: {
      title: 'Otp Page'
    }
  },
  // {
  //   path: 'notification',canActivate:[AuthGuard],
  //   component: NotificationComponent,
  //   data: {
  //     title: 'Notification Page'
  //   }
 // },
  {
    path: 'changePassword',canActivate:[AuthGuard],
    component: ChangePasswordComponent,
    data: {
      title: 'Change Password Page'
    },
    
  }
    // { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      relativeLinkResolution: 'legacy',
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
