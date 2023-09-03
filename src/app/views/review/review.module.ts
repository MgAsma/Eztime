import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewRoutingModule } from './review-routing.module';
import { ReviewComponent } from './review.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ManagerReviewComponent } from './manager-review/manager-review.component'
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
@NgModule({
  declarations: [
    ReviewComponent,
    ManagerReviewComponent
  ],
  imports: [
    CommonModule,
    ReviewRoutingModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule
  ]
})
export class ReviewModule { }
