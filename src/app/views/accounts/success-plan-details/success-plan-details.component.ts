import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../../../service/common-service.service';
import { BuyStandardplanComponent } from '../buy-standardplan/buy-standardplan.component';
import { MatDialog } from '@angular/material/dialog';
import { ExistStandardPlanComponent } from '../exist-standard-plan/exist-standard-plan.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-success-plan-details',
  templateUrl: './success-plan-details.component.html',
  styleUrls: ['./success-plan-details.component.scss']
})
export class SuccessPlanDetailsComponent implements OnInit {
  BreadCrumbsTitle:any='Subscription plan';
  subscriptionData: Object;
  constructor(
    private common_service:CommonServiceService,
    private dialog:MatDialog,
    private api:ApiserviceService
  ) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
  }
  
  cancelSubscription(){}
  addNewUser(){
    const dialogRef = this.dialog.open(ExistStandardPlanComponent, {
      data: { message: 'Hello from the parent component!' },
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
