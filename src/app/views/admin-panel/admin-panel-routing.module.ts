import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminListComponent } from './admin-list/admin-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    children: [
      // { path: '', redirectTo: 'manage-admin', pathMatch: 'full' }, // Default child route
      { path: 'manage-admin', component:AdminListComponent},
      { path: 'add-admin', component: AddAdminComponent }, // Add admin route
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
