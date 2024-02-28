import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { error } from 'console';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notes:any =[]
  orgId: string;
  constructor( private modal:NgbModal,private api:ApiserviceService) {
    this.orgId = sessionStorage.getItem('org_id')
   }
  closeBtn(){
   this.modal.dismissAll()
  }
  ngOnInit(){
    this.getNotification()
  }
  getNotification(){
    let params = `${environment.live_url}/${environment.notification_center}?organization_id=${this.orgId}`
   
   this.api.getData(params).subscribe((res:any)=>{
      if(res.result.data){
        this.notes = res.result.data
      }
    },((error:any)=>{
      this.api.showError(error.error.error.message)
    }))
  }
}
