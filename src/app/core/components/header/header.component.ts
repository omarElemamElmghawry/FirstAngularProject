import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IGetUserByPhoneNumberData } from 'src/app/features/authentication/models/iget-user-by-phone-number-data';
import { ILoginReturnData } from 'src/app/features/authentication/models/ilogin-return-data';
import { AuthenticationService } from 'src/app/features/authentication/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  //properties
  userData: ILoginReturnData | null = null;

  constructor(public authService: AuthenticationService) { }

  //subscription properties
  subscriptions: Subscription[] = [];

  //life cycle hooks
  ngOnInit(): void {
    this.subscribeToGetUserDataObservables();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  //methods
  subscribeToGetUserDataObservables() {
    this.authService.loggedInSubject.subscribe((res: ILoginReturnData | null) => {
      this.userData = res;
      console.log(this.userData);
    })
  }
  logOut() {
    this.authService.logout();
  }

}
