import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericDeleteComponent } from 'src/app/generic-delete/generic-delete.component';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss'],
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit{
  user_role_Name:any;

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  
  headerNav = [
    {
      link:'/profile',
      page:'Profile',
      icons:'bi bi-person-lines-fill'
    },
    // {
    //   link:'../register',
    //   page:'Register',
    //   icons:'bi bi-person-fill-add'
    // },
    {
      link:'/changePassword',
      page:'Change Password',
      icons:'fa fa-key'
    },
    {
      link:'/logout',
      page:'Logout',
      icons:'bi bi-power'
    }
  ]
  user_id: string;
  user_name: string;
  

  constructor(private classToggler: ClassToggleService,private modalService :NgbModal,
    private router:Router) {
    super();
  }
  ngOnInit(): void {
    this.user_id = sessionStorage.getItem('user_id');
    this.user_role_Name = sessionStorage.getItem('user_role_name');
    this.user_name = sessionStorage.getItem('user_name');
  }
  getHeaderNavStyles(type):any{
    switch (type['page']) {
      case 'Logout':
      return 'title-logout'
      case 'Change Password':
        return'py-1'
    }
  }
  clearStorage(type){
    if(type['page'] === 'Logout'){
      this.openDialogue()
     
    }
  }
  openDialogue() {
   
      const modelRef =   this.modalService.open(GenericDeleteComponent, {
        size: <any>'sm'
    ,
        backdrop: true,
        centered:true
      });
      modelRef.componentInstance.title = `Are you sure do you want to logout`;
      modelRef.componentInstance.message = `Logout`;
      modelRef.componentInstance.status.subscribe(resp => {
        if(resp == "ok"){
          this.router.navigate(['/login'])
          sessionStorage.clear()
          location.reload();
         modelRef.close();
        }
        else{
          modelRef.close();
        }
    })
  }
}
