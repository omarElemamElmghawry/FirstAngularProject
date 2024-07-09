import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ILoginReturnData } from 'src/app/features/authentication/models/ilogin-return-data';
import { AuthenticationService } from 'src/app/features/authentication/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class IsUserGuard implements CanActivate {
  constructor(private authService: AuthenticationService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.loggedInSubject.pipe(
        map((res: ILoginReturnData | null) => {
          console.log(res?.data?.user?.crmUserId);
          if (res?.data?.user?.crmUserId) {
            return true;
          } else {
            this.router.navigate(['/authentication/login']);
            return false;
          }
        })
      );
  }
  
}
