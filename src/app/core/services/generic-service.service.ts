import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericServiceService<entity> {
  httpOptions = {
    headers: new HttpHeaders({
    })
  }

  handlingErrors(err: Error) {
    return throwError(()=> new Error(err.message))
  }

  constructor(private http: HttpClient) { 

  }

  //methods
  addHeaders(key: string, value: string) {
    this.httpOptions.headers.append(key, value);
  }

  getAll<T>(subUrl: string): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/${subUrl}`, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handlingErrors)
    );
  } 

  insert<T>(subUrl: string, entity: T): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/${subUrl}`, entity, this.httpOptions)
    .pipe(
      retry(2),
      catchError(this.handlingErrors)
    );
  }
}
