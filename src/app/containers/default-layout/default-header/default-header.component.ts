import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';
import { ApiserviceService } from 'src/app/service/apiservice.service';
import { CommonServiceService } from 'src/app/service/common-service.service';
import { NotificationComponent } from 'src/app/views/pages/notification/notification.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {
  user_role_Name: any;

  @Input() sidebarId: string = "sidebar";
  @Input() pageName: any;
  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  headerNav = [
    {
      link: '/profile',
      page: 'Profile',
      icons: 'bi bi-person-lines'
    },
    // {
    //   link:'../register',
    //   page:'Register',
    //   icons:'bi bi-person-add'
    // },
    {
      link: '/changePassword',
      page: 'Change Password',
      icons: 'fa fa-key'
    },
    // {
    //   link: '/logout',
    //   page: 'Logout',
    //   icons: 'bi bi-power'
    // }
  ]
  user_id: string;
  user_name: string;
  profileImg: any;
  notes: any;
  screenWidth: number;
  orgId: any;
  previousPage: string;


  constructor(private classToggler: ClassToggleService, private modalService: NgbModal,
    private router: Router,
    private api: ApiserviceService, private cdref: ChangeDetectorRef,
    private common_service: CommonServiceService,
   private location:Location) {
    super();
    this.getScreenSize()
  }
  ngOnInit(): void {
    this.user_id = sessionStorage.getItem('user_id');
    this.orgId = sessionStorage.getItem('org_id')
    this.user_role_Name = sessionStorage.getItem('user_role_name');
    this.user_name = sessionStorage.getItem('user_name');
    this.getProfiledata()
    // this.getNotification();
    this.common_service.title$.subscribe(title => {
      this.pageName = title;
      this.cdref.detectChanges();
    });
    this.common_service.subTitle$.subscribe(subtitle =>{
      this.previousPage = subtitle
    })
  }
  getBack(){
    this.location.back()
  }
  getHeaderNavStyles(type): any {
    switch (type['page']) {
      case 'Logout':
        return 'title-logout'
      case 'Change Password':
        return 'py-1'
    }
  }
  clearStorage(type) {
    if (type['page'] === 'Logout') {
      this.openDialogue()
    }
  }
  openDialogue() {
    const modelRef = this.modalService.open(GenericDeleteComponent, {
      size: <any>'sm',
      backdrop: true,
      centered: true
    });
    modelRef.componentInstance.title = `Are you sure do you want to logout`;
    modelRef.componentInstance.message = `Logout`;
    modelRef.componentInstance.status.subscribe(resp => {
      if (resp == "ok") {
        this.api.showSuccess('You have been logged out!')
        this.router.navigate(['/login'])
        sessionStorage.clear();
        location.reload();
        modelRef.close();
      }
      else {
        modelRef.close();
      }
    })
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(_event?: Event) {
    this.screenWidth = window.innerWidth;
  }
  openNotification() {
    if (this.notes?.length > 0) {
      const modelRef = this.modalService.open(NotificationComponent, {
        size: <any>'md',
        backdrop: true,
        centered: this.screenWidth < 1023 ? true : false,
        modalDialogClass: 'c_class'
      });

      modelRef.componentInstance.status.subscribe(resp => {
        if (resp == "ok") {
          //  this.delete(content);
          modelRef.close();
        }
        else {
          modelRef.close();
        }
      })

    } else {
      this.api.showWarning('No new notifications')
    }




  }

  profileDataForSidebar:any = {
    profile_pic:'',
    name:''
  }
  getProfiledata() {
    this.api.getData(`${environment.live_url}/${environment.profile_custom_user}?id=${this.user_id}&page_number=1&data_per_page=10&pagination=TRUE&organization_id=${this.orgId}`).subscribe((res: any) => {
      console.log(res,'PROFILE GET API RESPONSE')
      if (res.result.data) {
        this.profileImg = res?.result?.data[0]?.u_profile_path;
        this.profileDataForSidebar.profile_pic = res.result.data[0]['u_profile_photo'];
        this.profileDataForSidebar.name = res.result.data[0].u_first_name; 
        this.common_service.setProfilePhoto(this.profileDataForSidebar)
      }
    }, (error => {
      this.api.showError(error.error.error.message)
    }))
  }
  getNotification() {
    let params = `${environment.live_url}/${environment.notification_center}?organization_id=${this.orgId}`
    this.api.getData(params).subscribe((res: any) => {
      if (res.result.data) {
        this.notes = res.result.data
      }
    }, ((error: any) => {
      this.api.showError(error.error.error.message)
    }))
  }
}
