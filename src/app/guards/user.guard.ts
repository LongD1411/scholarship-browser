import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { SweetAlertService } from '../service/sweet.alert.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(private router: Router, private alert: SweetAlertService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('access_token');

    if (token && this.hasRole(token)) {
      return true;
    } else {
      this.router.navigate(['/']);
    }
    return false;
  }

  private hasRole(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.scope && (payload.scope.includes('ROLE_USER') || payload.scope.includes('ROLE_ADMIN'));
    } catch (error) {
      return false;
    }
  }
}
