import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationComponent } from './organization.component';
import { OrganizationRoutingModule } from './organization-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateOrganizationComponent } from './create-organization/create-organization.component';
import { UpdateOrganizationComponent } from './update-organization/update-organization.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { SharedModule } from "../../shared/shared.module";
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        OrganizationComponent,
        CreateOrganizationComponent,
        UpdateOrganizationComponent,
        OrganizationListComponent
    ],
    imports: [
        CommonModule,
        OrganizationRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgxPaginationModule,
        Ng2SearchPipeModule,
        NgbTooltipModule
    ]
})

export class OrganizationModule{}