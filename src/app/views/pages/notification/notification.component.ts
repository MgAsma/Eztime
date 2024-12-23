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
  user_id:number;
  page_size: number = 5;
  constructor( private modal:NgbModal,private api:ApiserviceService) {
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
   }
  closeBtn(){
   this.modal.dismissAll()
  }
  ngOnInit(){
    this.getNotification(0)
  }
  getNotification(page_size){
    if(page_size){
      this.page_size = this.page_size + page_size
    }
    
    let params = `${environment.live_url}/${environment.notification}/?user-id=${this.user_id}&page=1&page_size=${this.page_size}`
   
   this.api.getData(params).subscribe((res:any)=>{
      if(res.results){
        this.notes = res.results
      }
    },((error:any)=>{
      this.api.showError(error?.error?.message)
    }))
  }
}
