import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonServiceService } from '../../../service/common-service.service';
import { BuyStandardplanComponent } from '../buy-standardplan/buy-standardplan.component';
import { ExistStandardPlanComponent } from '../exist-standard-plan/exist-standard-plan.component';
import { StandardSubscriptionComponent } from '../standard-subscription/standard-subscription.component';
import { ApiserviceService } from '../../../service/apiservice.service';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';


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
  organizationId: string | null;
  constructor(
    private common_service:CommonServiceService,
    private dialog:MatDialog,
    private api:ApiserviceService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.organizationId = sessionStorage.getItem('organization_id');
    this.getSubscription();
    this.getTrialPlanDetails();
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
  getTrialPlanDetails(){
    this.api.getData(`${environment.live_url}/${environment.trial_plan_details}/?organization=${this.organizationId}&page=1&page_size=10`).subscribe((res)=>{
      if (res && res?.['results']) {
        this.planDetails = res?.['results'].map((item: any, index: number) => ({
          slNo: index + 1,
          plan: item.subscribed_organization__subscription_type__name,
          users: item.subscribed_organization__added_users,
          totalAmount: item.total_amount,
          startDate: this.datePipe.transform(item.subscribed_organization__start_date, 'dd/MM/yyyy'),
          endDate: this.datePipe.transform(item.subscribed_organization__expiry_date, 'dd/MM/yyyy')
        }));
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
