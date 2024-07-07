import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILoginUserData } from '../models/ilogin-user-data';
import { GenericServiceService } from 'src/app/core/services/generic-service.service';
import { ILoginReturnData } from '../models/ilogin-return-data';
import { IGetUserByPhoneNumberData } from '../models/iget-user-by-phone-number-data';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //authentication properties
  private url = environment.apiUrl + "/Account";
  //subjects
  private isLoggedInSubject!: BehaviorSubject<ILoginReturnData | null>;

  constructor(private http: HttpClient,
    private genericService: GenericServiceService<ILoginUserData>,
    private router: Router
  ) {
    this.initializeSubjects();
    this.getUserDataIfLoggedIn();
  }


  //methods
  initializeSubjects() {
    this.isLoggedInSubject = new BehaviorSubject<ILoginReturnData | null>(null);
  }
  getUserDataIfLoggedIn() {
    if (this.isLoggedIn()) {
      this.getUserByPhoneNumber(localStorage.getItem("phoneNumber")!).subscribe({
        next: (userData: IGetUserByPhoneNumberData) => {
          this.emitUserDataByPhoneNumber(userData);
          localStorage.setItem("phoneNumber", userData.data.phoneNumber);
        },
        error: (err: Error) => {
          console.log(err)
        }
      })
    }
  }

  isLoggedIn() {
    return JSON.parse(localStorage.getItem("token")!) != null ? true : false;
  }

  loginIn(loginUserData: ILoginUserData): Observable<ILoginReturnData> {
    this.genericService.addHeaders("Content-Type", "application/json");
    return this.http.post<ILoginReturnData>(`${this.url}/Login`, loginUserData, this.genericService.httpOptions)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }

  setUserData(userData: ILoginReturnData) {
    this.emitUserData(userData);
    localStorage.setItem("token", JSON.stringify(userData.data.token));
    localStorage.setItem("phoneNumber", userData.data.user.phoneNumber);
  }

  logout(){ 
    this.emitUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
    this.router.navigate(['/authentication/login']);
  }

  getUserByPhoneNumber(phoneNumber: string): Observable<IGetUserByPhoneNumberData> {
    console.log(`${this.url}/GetUserByPhoneNumber?phoneNumber=${phoneNumber}`)
    return this.http.get<IGetUserByPhoneNumberData>(`${this.url}/GetUserByPhoneNumber?phoneNumber=${phoneNumber}`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }

  emitUserData(userData: ILoginReturnData | null) {
    this.isLoggedInSubject.next(userData);
  }

  emitUserDataByPhoneNumber(userData: IGetUserByPhoneNumberData | null) {
    this.emitUserData(this.IGetUserByPhoneNumberDataToIReturnLoginData(userData));
  }

  IGetUserByPhoneNumberDataToIReturnLoginData(userData: IGetUserByPhoneNumberData | null): ILoginReturnData {
    let originalUserData: ILoginReturnData = {
      data: {
        token: "",
        user: {...userData?.data!},
        twoFactorAuthEnabled: false
      },
      status: userData?.status!,
      code: userData?.code!,
      message: userData?.message!,
      location: userData?.location!
    };

    return originalUserData
  }

  //getters
  get loggedInSubject() {
    return this.isLoggedInSubject.asObservable();
  }
}
