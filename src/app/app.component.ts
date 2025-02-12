import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import isOnline from 'is-online';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '<app-root>',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Projectace';
 

  connectionStatusMessage!: string;
  connectionStatus!: string;

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
    
  }
 
  async ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
   let vh = window.innerHeight * 0.01;
  //Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
 
  
  
}
