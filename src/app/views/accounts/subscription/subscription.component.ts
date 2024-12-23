import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { TrialAlertComponent } from '../trial-alert/trial-alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuyStandardplanComponent } from '../buy-standardplan/buy-standardplan.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  subscriptionData: any = [];
  BreadCrumbsTitle:any='Subscription plan';
  monthly: boolean = true; // Default to monthly
  constructor(private _subscriptionService:ApiserviceService,
    private common_service : CommonServiceService,
    private modalService:NgbModal,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.getSubscription()
    //console.log(this.subscriptionData,"FFFF")
  }
  setPaymentOption(option: boolean): void {
    this.monthly = option;
  }
  getSubscription(){
    this._subscriptionService.getSubscription().subscribe((res)=>{
      if(res){
        this.subscriptionData = res
        //console.log(this.subscriptionData)
      }
      else{
        //console.log("ERROR")
      }
    })
   
  }
 openDialogue() {
    const modelRef = this.modalService.open(TrialAlertComponent, {
      size: <any>'sm',
      backdrop: true,
      centered: true
    });
    modelRef.componentInstance.title = `Are you sure you want to opt for the free trial plan`;
    modelRef.componentInstance.message = `Free Trial Plan`;
    modelRef.componentInstance.status.subscribe(resp => {
      if (resp == "ok") {
        modelRef.close();
      }
      else {
        modelRef.close();
      }
    })
  }
  // buyStandardPlan(){
  //   const modelRef = this.modalService.open(BuyStandardplanComponent, {
  //     size: <any>'md',
  //     backdrop: true,
  //     centered: true,
  //     modalDialogClass: 'buystandardplan'
  //   });
  //   // modelRef.componentInstance.title = `Are you sure you want to opt for the free trial plan`;
  //   // modelRef.componentInstance.message = `Free Trial Plan`;
  //   modelRef.componentInstance.status.subscribe(resp => {
  //     if (resp == "ok") {
  //       modelRef.close();
  //     }
  //     else {
  //       modelRef.close();
  //     }
  //   })
  // }
 

  buyStandardPlan() {
    const dialogRef = this.dialog.open(BuyStandardplanComponent, {
      // data: { message: 'Hello from the parent component!' },
      panelClass: 'custom-dialog'
    });
    dialogRef.disableClose=true
  }
}
