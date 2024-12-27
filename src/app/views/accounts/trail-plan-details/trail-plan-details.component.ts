import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiceService } from '../../../service/common-service.service';
import { BuyStandardplanComponent } from '../buy-standardplan/buy-standardplan.component';
import { ExistStandardPlanComponent } from '../exist-standard-plan/exist-standard-plan.component';

@Component({
  selector: 'app-trail-plan-details',
  templateUrl: './trail-plan-details.component.html',
  styleUrls: ['./trail-plan-details.component.scss']
})
export class TrailPlanDetailsComponent implements OnInit {
BreadCrumbsTitle:any='Subscription plan';
  monthly: boolean = true;
  constructor(
    private common_service:CommonServiceService,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
  }
  setPaymentOption(option: boolean): void {
    this.monthly = option;
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
