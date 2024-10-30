import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-office-working-days',
  templateUrl: './office-working-days.component.html',
  styleUrls: ['./office-working-days.component.scss']
})
export class OfficeWorkingDaysComponent implements OnInit {
  officeWorkingDaysForm:FormGroup
  BreadCrumbsTitle:any='Working days';
 
  submitted: boolean = false;
  permissions: any = [];
  enable: boolean = false;
  isSelectDisabled = true;
  hours:any = {};
  mins:any ={};
  user_id: any;
  hoursTo:any = {}
  orgId: any;
  days = [
    { name: 'Monday', selected: false, fromTime: null, toTime: null },
    { name: 'Tuesday', selected: false, fromTime: null, toTime: null },
    { name: 'Wednesday', selected: false, fromTime: null, toTime: null },
    { name: 'Thursday', selected: false, fromTime: null, toTime: null },
    { name: 'Friday', selected: false, fromTime: null, toTime: null },
    { name: 'Saturday', selected: false, fromTime: null, toTime: null },
    { name: 'Sunday', selected: false, fromTime: null, toTime: null },
  ];

  times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00','18:00','19:00'];
  constructor(
    private _fb:FormBuilder,
    private api:ApiserviceService,
    private commonService:CommonServiceService,
    private location:Location,
    private common_service:CommonServiceService) { }
    goBack(event)
  {
      event.preventDefault(); // Prevent default back button behavior
  this.location.back();
  
    }
  ngOnInit(): void {
    this.common_service.setTitle(this.BreadCrumbsTitle);
   
    this.user_id = JSON.parse(sessionStorage.getItem('user_id'))
    this.orgId = sessionStorage.getItem('organizationid')
    
    
   
  }
 

  toggleSelectAll(isChecked: boolean) {
    this.days.forEach(day => day.selected = isChecked);
  }

  toggleDaySelection(index: number) {
    const day = this.days[index];
    if (!day.selected) {
      day.fromTime = null;
      day.toTime = null;
    }
  }

  calculateHours(from: string, to: string): number {
    if (from && to) {
      const [fromHour, fromMinutes] = from.split(':').map(Number);
      const [toHour, toMinutes] = to.split(':').map(Number);
      return (toHour + toMinutes / 60) - (fromHour + fromMinutes / 60);
    }
    return 0;
  }
 
  get f(){
    return this.officeWorkingDaysForm.controls
  }
 
 
  
}
