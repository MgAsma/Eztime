import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-page504',
  templateUrl: './page504.component.html',
  styleUrls: ['./page504.component.scss']
})
export class Page504Component implements OnInit {

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
 ngOnInit(): void {
   
 }
}
