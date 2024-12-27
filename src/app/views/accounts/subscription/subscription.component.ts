import { Component, OnInit } from '@angular/core';

import { TrialAlertComponent } from '../trial-alert/trial-alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuyStandardplanComponent } from '../buy-standardplan/buy-standardplan.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { error } from 'console';
import { ApiserviceService } from '../../../service/apiservice.service';
import { CommonServiceService } from '../../../service/common-service.service';

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
  constructor(private api:ApiserviceService,
    private common_service : CommonServiceService,
    private modalService:NgbModal,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.organization_id = sessionStorage.getItem('organization_id');
    this.getSubscription()
    //console.log(this.subscriptionData,"FFFF")
  }
  setPaymentOption(option: boolean): void {
    this.monthly = option;
  }
  getSubscription(){
    this.api.getData(`${environment.live_url}/${environment.subscription_list}/`).subscribe((res)=>{
      if(res){
        this.subscriptionData = res
        if(res?.['subscription_deatils']['yearly_or_monthly_name'] === 'Monthly' ){
          this.monthlyAmount =res?.['subscription_deatils']['amount']
        }else{
          this.yearlyAmount =res?.['subscription_deatils']['amount']
        }
        
      }
     
    })
   
  }
 openDialogue() {
    const modelRef = this.modalService.open(TrialAlertComponent, {
      size: <any>'sm',
      backdrop: true,
      centered: true
    });
    modelRef.componentInstance.title = `Are you sure you want to activate the free trial plan`;
    modelRef.componentInstance.message = `Free Trial Plan`;
    modelRef.componentInstance.status.subscribe(resp => {
      if (resp == "ok") {
        this.getTrailPlan()
        modelRef.close();
      }
      else {
        modelRef.close();
      }
    })
  }
  getTrailPlan(){
    const data = {
        organization: this.organization_id,
        subscription_type: 4
    }
    this.api.postData(`${environment.live_url}/${environment.my_subscription}/`,data).subscribe((res:any)=>{
      if(res['result']){
       this.api.showSuccess('You have successfully activated your free trail plan')
      }
    })
  }
  buyStandardPlan() {
    const dialogRef = this.dialog.open(BuyStandardplanComponent, {
      // data: { message: 'Hello from the parent component!' },
      panelClass: 'custom-dialog'
    });
    dialogRef.disableClose=true
  }
}
