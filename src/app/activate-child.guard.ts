import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ActivateChildGuard implements CanActivateChild {
  constructor(private _router: Router) {}

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn: boolean = sessionStorage.getItem('user_id') !== null;

    if (!isLoggedIn) {
      this._router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
