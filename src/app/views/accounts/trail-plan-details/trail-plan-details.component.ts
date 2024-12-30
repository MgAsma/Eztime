import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiceService } from '../../../service/common-service.service';
import { BuyStandardplanComponent } from '../buy-standardplan/buy-standardplan.component';
import { ExistStandardPlanComponent } from '../exist-standard-plan/exist-standard-plan.component';
import { StandardSubscriptionComponent } from '../standard-subscription/standard-subscription.component';

@Component({
  selector: 'app-trail-plan-details',
  templateUrl: './trail-plan-details.component.html',
  styleUrls: ['./trail-plan-details.component.scss']
})
export class TrailPlanDetailsComponent implements OnInit {
BreadCrumbsTitle:any='Subscription plan';
  monthly: boolean = true;
  planDetails: any;
  monthlyAmount: any;
  yearlyAmount: any;
  discount: any;
  constructor(
    private common_service:CommonServiceService,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.common_service.subscription_details.subscribe((res)=>{
      this.planDetails = res;
      console.log(res,"DETAILS")
      res?.forEach((item: any,i) => {
        console.log(item,"item")
        if(item.name == 'Standard'){
          item['subscription_deatils'].forEach((item: any,i) => {
            if(item.yearly_or_monthly_name === 'Monthly'){
              this.monthlyAmount = item.amount
            }if(item.yearly_or_monthly_name === 'Yearly'){
              this.yearlyAmount = item.amount
              this.discount = item.discount
            }
          })
          
      }
      })
    
    })
  
  }
  setPaymentOption(option: boolean): void {
    this.monthly = option;
  }
  cancelSubscription(){}
  addNewUser(){
    const dialogRef = this.dialog.open(ExistStandardPlanComponent, {
      data: {planDetails:this.planDetails},
      panelClass: 'custom-dialog'
    });
    dialogRef.disableClose=true
  }
  renewSubscription(){
    const dialogRef = this.dialog.open(BuyStandardplanComponent, {
      data: {planDetails:this.planDetails},
      panelClass: 'custom-dialog'
    });
    dialogRef.disableClose=true
     
  }
  openStandardPlan(){
    const dialogRef = this.dialog.open(StandardSubscriptionComponent, {
      // data: {planDetails:this.planDetails},
      panelClass: 'custom-dialog'
    });
    dialogRef.disableClose=true
     
  }
}
