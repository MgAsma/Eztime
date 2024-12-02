import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { AdminPanelComponent } from '../admin-panel/admin-panel.component';
import { AddAdminComponent } from '../admin-panel/add-admin/add-admin.component';
import { GenericAdminListComponent } from '../generic-admin/generic-admin-list/generic-admin-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminListComponent } from './admin-list/admin-list.component';
import { PaginationComponent } from '../generic-admin/pagination/pagination.component';
import { SearchComponent } from '../generic-admin/search/search.component';
import { GenericAddAdminComponent } from '../generic-admin/generic-add-admin/generic-add-admin.component';
@NgModule({
  declarations: [
    AdminPanelComponent,
    AddAdminComponent,
    AdminListComponent,
    GenericAdminListComponent,
    PaginationComponent,
    SearchComponent,
    GenericAddAdminComponent
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    SharedModule
  ]
})
export class AdminPanelModule { }
