import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeoCodingService {

  private geocodeApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {}

  getCityName(lat: number, lng: number): Observable<any> {
    const url = `${this.geocodeApiUrl}?latlng=${lat},${lng}&key=${environment.googleMapKey}&region=EG&language=${environment.lang}`;
    return this.http.get(url);
  }
}
