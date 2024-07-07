import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../models/token';
import { environment } from 'src/environments/environment';

@Injectable()
export class SetMainRequestDataInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the authentication token from localStorage or any other source
    let tokenCode = localStorage.getItem('token');
    let authToken: Token | null = null;
    if (tokenCode) {
      authToken = new Token(JSON.parse(localStorage.getItem('token')!));
    }
    
    // Modify the request to add language, authentication token, and source
    const lang = 'en'; // Replace with actual language or retrieve dynamically      
    let modifiedReq = request.clone({
      setHeaders: {
        Authorization: `${authToken}`, // Set authorization header
        'source': '2' // Set source header
      }
    });

    if (request.url.includes(environment.apiUrl)) {
      if (!request.url.includes('/en/')) {
        const newUrl = request.url.replace('/api/', `/${lang}/api/`); // Adjust path as needed
        modifiedReq = request.clone({ url: newUrl });
      }
    }
    
    // Pass the modified request to the next handler
    return next.handle(modifiedReq);
  }

}
