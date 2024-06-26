import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortPipe} from '../sort/sort.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GenericNorecardsComponent } from './generic-norecards/generic-norecards.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HypenDirective } from './hypen.directive';
import {MatListModule} from '@angular/material/list';
import {MatBadgeModule} from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    SortPipe,
    GenericNorecardsComponent,
    HypenDirective,
 
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    DragDropModule,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatBadgeModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule
  ],
  exports:[
    SortPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    DragDropModule,
    GenericNorecardsComponent,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    HypenDirective,
    MatListModule,
    MatBadgeModule,
    MatCardModule,
    MatIconModule,
    MatRadioModule
   ],
  
})
export class SharedModule { }
