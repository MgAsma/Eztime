import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.component.html',
  styleUrls: ['./no-internet.component.scss']
})
export class NoInternetComponent implements OnInit {
  user_id: string;

  constructor(
    private router:Router) { }

  ngOnInit(): void {
  }
  goBack(){
    this.router.navigate(['/login'])
  }
}
