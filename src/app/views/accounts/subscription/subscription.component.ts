import { Component, OnInit } from '@angular/core';

import { TrialAlertComponent } from '../trial-alert/trial-alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuyStandardplanComponent } from '../buy-standardplan/buy-standardplan.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { ApiserviceService } from '../../../service/apiservice.service';
import { CommonServiceService } from '../../../service/common-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  subscriptionData: any = [];
  BreadCrumbsTitle:any='Subscription plan';
  monthly: boolean = true; // Default to monthly
  monthlyAmount: any;
  yearlyAmount: any;
  organization_id: string | null;
  mySubscriptionData: any = [];
  planDetails: any;
  constructor(private api:ApiserviceService,
    private common_service : CommonServiceService) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.organization_id = sessionStorage.getItem('organization_id');
    this.getSubscription()
    this.mySubscription()
   
    
  }
  hasEligibleSubscription(): boolean {
    return this.subscriptionData.some(subscription =>
      !subscription.is_active &&
      (subscription.subscription_type_name === 'Free Trial' || subscription.subscription_type_name === 'Standard')
    );
  }
  
  getSubscription(){
    this.api.getData(`${environment.live_url}/${environment.subscription_list}/`).subscribe((res)=>{
      if(res){
        this.subscriptionData = res;
        console.log(this.subscriptionData,"Parent")
      }
    })
   
  }
 
  mySubscription(){
    if (this.organization_id) {
    this.api.getData(`${environment.live_url}/${environment.my_subscription}/?organization=${this.organization_id}`).subscribe((res)=>{
      if(res){
        this.mySubscriptionData = res?.['data']
      }
    })
  }
  }
  onTrailPlanStatus(event){
    if(event){
    this.getSubscription()
    this.mySubscription()
    }
  }
  
  
}
