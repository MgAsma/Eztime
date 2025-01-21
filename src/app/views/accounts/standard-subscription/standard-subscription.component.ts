import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../environments/environment';
import { ApiserviceService } from '../../../service/apiservice.service';
import { CommonServiceService } from '../../../service/common-service.service';
import { BuyStandardplanComponent } from '../buy-standardplan/buy-standardplan.component';

@Component({
  selector: 'app-standard-subscription',
  templateUrl: './standard-subscription.component.html',
  styleUrls: ['./standard-subscription.component.scss']
})
export class StandardSubscriptionComponent implements OnInit {

  subscriptionData: any = [];
  monthly: boolean = true; // Default to monthly
  monthlyAmount: any;
  yearlyAmount: any;
  organization_id: string | null;
  discount: any;
  constructor(
    private api:ApiserviceService,
    private common_service : CommonServiceService,
    private dialog: MatDialog
  ) { }

   ngOnInit(): void {
      this.organization_id = sessionStorage.getItem('organization_id');
      this.getSubscription();
      this.getPeopleCount(`?organization_id=${this.organization_id}&page=${1}&page_size=${10}`)
      //console.log(this.subscriptionData,"FFFF")
    }
    setPaymentOption(option: boolean): void {
      this.monthly = option;
    }
    close(){
      this.dialog.closeAll()
    }
    getSubscription() {
      this.api.getData(`${environment.live_url}/${environment.subscription_list}/`).subscribe((res: any) => {
        if (res) {
          this.subscriptionData = res;
    
          // Iterate through subscription data
          this.subscriptionData.forEach((subscription) => {
            if (subscription.name === 'Standard' && subscription.plan_details) {
              subscription.plan_details.forEach((item) => {
                // Check for Monthly or Yearly plans and assign amounts accordingly
                if (item.yearly_or_monthly_name === 'Monthly') {
                  this.monthlyAmount = item.amount;
                } else if (item.yearly_or_monthly_name === 'Yearly') {
                  this.yearlyAmount = item.amount;
                  this.discount = item.discount;
                }
              });
            }
          });
        }
      });
    }
    buyStandardPlan() {
      const dialogRef = this.dialog.open(BuyStandardplanComponent, {
        data: { 'totalPeopleCount':this.totalPeopleCount,selectedValue: this.monthly},
        panelClass: 'custom-dialog'
      });
      dialogRef.disableClose=true
    }

    roundAmount(amount: number): number {
      return Math.round(amount);
    }

    totalPeopleCount:number
  getPeopleCount(params:any) {
    this.api.getData(`${environment.live_url}/${environment.allEmployee}/${params}`).subscribe((data: any) => {
      // console.log(data)
      if( data?.['total_no_of_record']===0){
        this.totalPeopleCount = 1;
      } else{
        this.totalPeopleCount = data?.['total_no_of_record']+1;
      }
    }, ((error) => {
      this.api.showError(error.error.error.message)
    })
    )
  }
}
