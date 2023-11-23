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
  notes:any =[
   
  ]
  constructor( private modal:NgbModal,private api:ApiserviceService) { }
  closeBtn(){
   this.modal.dismissAll()
  }
  ngOnInit(): void {
    this.getNotification()
  }
  getNotification(){
    this.api.getData(`${environment.live_url}/${environment.notification_center}`).subscribe((res:any)=>{
      if(res.result.data){
        this.notes = res.result.data
      }
    },((error:any)=>{
      this.api.showError(error.error.error.message)
    }))
  }
}
