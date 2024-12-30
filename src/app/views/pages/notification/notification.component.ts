import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { error } from 'console';
import { ApiserviceService } from '../../../service/apiservice.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notes:any =[]
  page_size: number = 5;
  user_id: any;
  user_role_name: any;
  totalCount: any;
  
  results = [
    {
      id: 60,
      created_by_id: 176,
      created_to_id: 368,
      text: {
        icon: "bi bi-file-text",
        message: "Your Leave is Approved By nadeem",
        leave_type: "Sick leave",
        leave_status: "Approved",
        redirect_url: "/review",
        leave_description: "Im on Sick"
      },
      created_datetime: "2024-12-24T10:12:07.536318Z"
    },
    {
      id: 59,
      created_by_id: 176,
      created_to_id: 368,
      text: {
        icon: "bi bi-stack",
        message: "#297 is assigned to you",
        task_status: 2,
        project_name: "wetw",
        redirect_url: "/project/list",
        project_description: "First page"
      },
      created_datetime: "2024-12-24T10:10:55.632016Z"
    },
    {
      id: 54,
      created_by_id: 176,
      created_to_id: 368,
      text: {
        icon: "bi bi-stack",
        message: "Project is Created By nadeem",
        project_name: "wetw",
        redirect_url: "/project/list",
        project_status: "To-Do",
        project_description: "First page"
      },
      created_datetime: "2024-12-24T10:10:55.568573Z"
    },
    {
      id: 54,
      created_by_id: 176,
      created_to_id: 368,
      text: {
        icon: "bi bi-stack",
        message: "Project is Created By nadeem",
        project_name: "wetw",
        redirect_url: "/project/list",
        project_status: "To-Do",
        project_description: "First page"
      },
      created_datetime: "2024-12-24T10:10:55.568573Z"
    }
  ];
  

  constructor( private modal:NgbModal,private api:ApiserviceService) {
    this.user_id = (sessionStorage.getItem('user_id'))
    this.user_role_name = (sessionStorage.getItem('user_role_name'))?.toUpperCase()
   }
  closeBtn(){
   this.modal.dismissAll()
  }
  ngOnInit(){
    this.getNotification(this.page_size,'init')
  }
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
           this.notes = res.results
           this.totalCount = res.total_no_of_record
         }
       },((error:any)=>{
         this.api.showError(error?.error?.message)
       }))
    }
   
  }
}
