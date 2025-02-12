import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiserviceService } from '../../../service/apiservice.service';
import { environment } from '../../../../environments/environment';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notes:any =[]
  page_size: number = 6;
  user_id: any;
  user_role_name: any;
  totalCount: any;
  
 
  
  seenNotifications$: any;
  displayedNotifications$: any;
  disabledView: boolean;
  constructor( 
    private modal:NgbModal,
    private api:ApiserviceService,
    private notificationService: NotificationService) {
    this.user_id = (sessionStorage.getItem('user_id'))
    this.user_role_name = (sessionStorage.getItem('user_role_name'))?.toUpperCase()
    this.notificationService.fetchAllNotifications();
    this.displayedNotifications$ = this.notificationService.displayedNotifications$;
   }
  closeBtn(){
    this.loadMore()
   this.modal.dismissAll()
  }
  // ngOnInit(){
  //   this.getNotification(this.page_size,'init')
  // }
  getNotification(page_size,type){
    if(type == 'viewmore'){
      this.page_size = this.page_size + page_size; // Ensure page_size does not exceed totalCount
    }
    if(this.page_size > this.totalCount + 5){
      this.api.showWarning('You have reached the end of the notifications')
    }else{
      let params = `${environment.live_url}/${environment.notification}/?user-id=${this.user_id}&page=1&page_size=${this.page_size}`
   
      this.api.getData(params).subscribe((res:any)=>{
         if(res.results){
          // this.notes = res.results
           this.totalCount = res.total_no_of_record
         }
       },((error:any)=>{
         this.api.showError(error?.error?.message)
       }))
    }
   
  }
 

  ngOnInit(): void {
    this.notificationService.fetchAllNotifications();
    this.notificationService.displayedNotifications$.subscribe((data) => {
      this.displayedNotifications$ = data;
    });
  }
  
  loadMore(): void {
    setTimeout(() => {
      this.notificationService.markNewlyLoadedAsSeen()
      this.notificationService.loadMoreNotifications();
      this.notificationService.disabledView.subscribe((data) => {
        this.disabledView = data;
      })
    }, 500);
  }
  
}
