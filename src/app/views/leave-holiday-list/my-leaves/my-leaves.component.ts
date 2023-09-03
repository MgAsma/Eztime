import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-leaves',
  templateUrl: './my-leaves.component.html',
  styleUrls: ['./my-leaves.component.scss']
})
export class MyLeavesComponent implements OnInit {
  leaveBalence: any = [];
  leaveDetails: any = [];

  constructor(
    private api:ApiserviceService,
    private location:Location) { }
  goBack(event){
    event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
  }
  ngOnInit(): void {
    this.getAllleaveData();
  }

  getAllleaveData(){
    let params = {
      pagination:"FALSE"
    }
    let user_id = sessionStorage.getItem('user_id')
    this.api.getData(`${environment.live_url}/${environment.users_leave_details}?user_id=${user_id}&method=VIEW&menu=MY_LEAVES&module=LEAVE/HOLIDAY_LIST&page_number=1&data_per_page=2&pagination=${params.pagination}`).subscribe(
      (res:any)=>{
      // this.leaveBalence = res.result.leave_balance
      // this.leaveDetails = res.result.data
      this.leaveBalence = res.result.leave_balance.data
      this.leaveDetails = res.result.leave_details.data
     
    },
    error=>{
     this.api.showError(error.error.error.message)
    }
    )

  }

}
