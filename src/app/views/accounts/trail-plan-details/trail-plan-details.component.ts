import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiceService } from '../../../service/common-service.service';
import { BuyStandardplanComponent } from '../buy-standardplan/buy-standardplan.component';
import { ExistStandardPlanComponent } from '../exist-standard-plan/exist-standard-plan.component';
import { StandardSubscriptionComponent } from '../standard-subscription/standard-subscription.component';
import { environment } from 'src/environments/environment';
import { ApiserviceService } from 'src/app/service/apiservice.service';

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
  subscriptionData: any;
  constructor(
    private common_service:CommonServiceService,
    private dialog:MatDialog,
    private api:ApiserviceService
  ) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.getSubscription();
  }
  getSubscription(){
      this.api.getData(`${environment.live_url}/${environment.subscription_list}/`).subscribe((res)=>{
        if(res){
          this.subscriptionData = res;
          this.subscriptionData?.forEach((item: any) => {
            if(item.name == 'Standard'){
              item['subscription_deatils'].forEach((item: any) => {
                if(item.yearly_or_monthly_name === 'Monthly'){
                  this.monthlyAmount = item.amount
                }else if(item.yearly_or_monthly_name === 'Yearly'){
                  this.yearlyAmount = item.amount
                  this.discount = item.discount
                }
              })
              
          }
          })
        }
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
