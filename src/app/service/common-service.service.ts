import { Injectable } from '@angular/core';
import { ApiserviceService } from './apiservice.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  permission: any = new BehaviorSubject('');
  user_id = sessionStorage.getItem('user_id')
  constructor(private api:ApiserviceService) {
    
   }
   private titleSubject = new BehaviorSubject<string>('Dashboard');
   title$ = this.titleSubject.asObservable();
 
   setTitle(title: string) {
     this.titleSubject.next(title);
   }
}
