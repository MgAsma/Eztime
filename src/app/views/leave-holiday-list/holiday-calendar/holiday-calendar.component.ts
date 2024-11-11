import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-holiday-calendar',
  templateUrl: './holiday-calendar.component.html',
  styleUrls: ['./holiday-calendar.component.scss']
})
export class HolidayCalendarComponent implements OnInit {
  file: any;
  fileUpload;
  formData:any;
  organization_id: string;
  holidays: any = [];
  constructor(
    private api:ApiserviceService
  ) { }

  ngOnInit(): void {
    this.organization_id = sessionStorage.getItem('organization_id')
    this.getHolidayList()
  }
  
  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.file = input.files[0];

      // Validate file type (optional)
      if (this.file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
          this.file.type === "application/vnd.ms-excel") {
        this.selectedFile = this.file;
        console.log('Selected file:', this.file);
      } else {
        console.error('Invalid file type. Only Excel files are allowed.');
        this.selectedFile = null; // Reset if file type is invalid
      }
    }
  }
  submit(){
    this.formData = new FormData();

 if (this.file) {
    this.formData.set('file',this.file);
    this.formData.set('organization_id',this.organization_id)
 }
 this.api.postData(`${environment.live_url}/${environment.holiday_calender}/`,this.formData).subscribe((res:any)=>{
  if(res){
    this.api.showSuccess(`Holiday list uploaded successfully!`)
  }
 },(error:any)=>{
  this.api.showError(error?.error.message)
 })
  }
  getHolidayList(){
    this.api.getData(`${environment.live_url}/${environment.holiday_calender}/`).subscribe((res:any)=>{
      if(res){
        this.holidays = res
      }
     },(error:any)=>{
      this.api.showError(error?.error.message)
     })
  }
}
