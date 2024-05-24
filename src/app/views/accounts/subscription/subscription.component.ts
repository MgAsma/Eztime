import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  subscriptionData: any = [];
  BreadCrumbsTitle:any='Subscription plan';

  constructor(private _subscriptionService:ApiserviceService,private common_service : CommonServiceService) { }

  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
    this.getSubscription()
    //console.log(this.subscriptionData,"FFFF")
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

}
