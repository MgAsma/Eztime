import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})
export class Page404Component {
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
