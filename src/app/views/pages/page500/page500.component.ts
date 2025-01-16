import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-page500',
  templateUrl: './page500.component.html',
  styleUrls: ['./page500.component.scss']
})
export class Page500Component {

  user_id: string;

  constructor(
    private location:Location,
    private router:Router) { }
  goBack(){
    this.user_id = sessionStorage.getItem('user_id') || ''
    if(this.user_id){
      this.location.back()
    }else{
      this.router.navigate(['/login'])
    }
  }
}
