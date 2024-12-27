import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../../../service/common-service.service';
import { BuyStandardplanComponent } from '../buy-standardplan/buy-standardplan.component';
import { MatDialog } from '@angular/material/dialog';
import { ExistStandardPlanComponent } from '../exist-standard-plan/exist-standard-plan.component';

@Component({
  selector: 'app-success-plan-details',
  templateUrl: './success-plan-details.component.html',
  styleUrls: ['./success-plan-details.component.scss']
})
export class SuccessPlanDetailsComponent implements OnInit {
  BreadCrumbsTitle:any='Subscription plan';
  constructor(
    private common_service:CommonServiceService,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
  }
  cancelSubscription(){}
  addNewUser(){
    const dialogRef = this.dialog.open(ExistStandardPlanComponent, {
      // data: { message: 'Hello from the parent component!' },
      panelClass: 'custom-dialog'
    });
    dialogRef.disableClose=true
  }
  renewSubscription(){
    const dialogRef = this.dialog.open(BuyStandardplanComponent, {
      // data: { message: 'Hello from the parent component!' },
      panelClass: 'custom-dialog'
    });
    dialogRef.disableClose=true
     
  }
}
