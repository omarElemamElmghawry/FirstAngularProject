import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICities } from '../models/icities';
import { catchError, retry } from 'rxjs';
import { GenericServiceService } from 'src/app/core/services/generic-service.service';
import { IContactAddress } from '../models/icontactaddress';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient,
    private genericService: GenericServiceService<IContactAddress>
  ) {
    
  }

  getAllCityDitracts(cityId: string) {
    return this.http.get<ICities>(`${environment.apiUrl}/City/CityDistricts?cityId=${cityId}`)
    .pipe(
      retry(2),
      catchError(this.genericService.handlingErrors)
    );
  }
}
