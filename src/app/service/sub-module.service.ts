import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubModuleService {
 baseurl = environment.live_url;
  constructor(private http: HttpClient, private router: Router) {}

  getAccessList(user_id): Observable<any> {
    return this.http.get(`${this.baseurl}/user-access/${user_id}/`);
  }

  getAccessForActiveUrl(id: number,url?:string): Observable<any> {
    const activeUrl =  url || this.router.url;
    return this.getAccessList(id).pipe(
      map((response: any) => {
        const accessList = response?.access_list || [];

        for (const module of accessList) {
          if (module.url && module.url === activeUrl) {
            return module.access; 
          }
          if (module.children && module.children.length > 0) {
            const matchedChild = module.children.find((child: any) => child.url === activeUrl);
            if (matchedChild) {
              const matchedAccess = module.access.find((subAccess: any) => subAccess.name === matchedChild.name);
              return matchedAccess ? [matchedAccess] : null; 
            }
          }
        }

        return null;
      })
    );
  }
}