import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.component.html',
  styleUrls: ['./no-internet.component.scss']
})
export class NoInternetComponent implements OnInit {
  user_id: string;

  constructor(
    private location:Location,
    private router:Router) { }

  ngOnInit(): void {
  }
  goBack(){
    this.user_id = sessionStorage.getItem('user_id') || ''
    if(this.user_id){
      this.location.back()
    }else{
      this.router.navigate(['/login'])
    }
  }
}
