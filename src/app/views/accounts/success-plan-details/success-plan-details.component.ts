import { Component, Input, OnInit } from '@angular/core';
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
  @Input()data:any;
  @Input()my_subscription:any;
  @Input()selectedPlanDetails:any;
  monthlyAmount: any;
  yearlyAmount: any;
  discount: any;
  isLoading: boolean = true;
  transactionData: any;
  tableSize = 5;
  tableSizes = [5,10,25,50,100];
  page: any;
  count: any;
  organizationId: string;
  mySubscriptionData: any;
  constructor(
    private common_service:CommonServiceService,
    private dialog:MatDialog,
    private api:ApiserviceService
  ) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.organizationId = sessionStorage.getItem('organization_id');
    this.getSubscription(this.data);
     let query = `page=${1}&page_size=${this.tableSize}`
    this.getTransactionHistory(query)
    this.mySubscriptionData = this.my_subscription
  }
  ngOnChanges(){
    this.mySubscriptionData = this.my_subscription
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
  getSubscription(event) {
    // Iterate through subscription data
    event?.forEach((subscription) => {
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
onTableDataChange(event:any){
  this.page = event;
  let query = `page=${this.page}&page_size=${this.tableSize}`
 
  this.getTransactionHistory(query)
}  
onTableSizeChange(event:any): void {
  if(event){
   
  this.tableSize = Number(event.value);
  let query = `page=${1}&page_size=${this.tableSize}`
  
  this.getTransactionHistory(query)
  }
} 

      getTransactionHistory(query){
        if(this.organizationId){
        this.api.getData(`${environment.live_url}/${environment.transaction_history}/?organization=${this.organizationId}&${query}`).subscribe((res)=>{
          if (res && res?.['results']) {
            this.transactionData = res?.['results']?.map((item, index) => ({
              slNo: index + 1,
              plan: item.subscribed_organization__subscription_type__name,
              term: item.terms,
              perUser: 'NA',
              users: item.subscribed_organization__added_users || 'NA',
              totalAmount: item.total_amount,
              startDate: new Date(item.subscribed_organization__start_date).toLocaleDateString(),
              endDate: new Date(item.subscribed_organization__expiry_date).toLocaleDateString(),
            }));
          
          this.isLoading = false; // Stop loading state
            this.count = res?.['total_no_of_record']
          }
        })
      }
      }
}
