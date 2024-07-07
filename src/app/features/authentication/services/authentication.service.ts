import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILoginUserData } from '../models/ilogin-user-data';
import { GenericServiceService } from 'src/app/core/services/generic-service.service';
import { ILoginReturnData } from '../models/ilogin-return-data';
import { IGetUserByPhoneNumberData } from '../models/iget-user-by-phone-number-data';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //authentication properties
  private url = environment.apiUrl + "/Account";
  //subjects
  private isLoggedInSubject!: BehaviorSubject<ILoginReturnData | null>;
  private userDataByPhoneNumberSubject!: BehaviorSubject<IGetUserByPhoneNumberData | null>;

  constructor(private http: HttpClient,
    private genericService: GenericServiceService<ILoginUserData>
  ) {
    this.initializeSubjects();
    this.getUserDataIfLoggedIn();
  }


  //methods
  initializeSubjects() {
    this.isLoggedInSubject = new BehaviorSubject<ILoginReturnData | null>(null);
    this.userDataByPhoneNumberSubject = new BehaviorSubject<IGetUserByPhoneNumberData | null>(null);
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
    this.emitUserDataByPhoneNumber(null);
    localStorage.removeItem("token");
    localStorage.removeItem("phoneNumber");
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
    this.userDataByPhoneNumberSubject.next(userData);
  }

  //getters
  get loggedInSubject() {
    return this.isLoggedInSubject.asObservable();
  }

  get UserDataByPhoneNumberSubject() {
    return this.userDataByPhoneNumberSubject.asObservable();
  }
}
