import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from 'src/app/service/apiservice.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  subscriptionData: any = [];

  constructor(private _subscriptionService:ApiserviceService) { }

  ngOnInit(): void {
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
