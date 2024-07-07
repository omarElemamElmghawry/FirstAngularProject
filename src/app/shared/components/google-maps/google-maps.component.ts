import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeoCodingService } from 'src/app/core/services/geo-coding.service';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {
  //map properties
  center: google.maps.LatLngLiteral = { lat: 24.5807, lng: 46.630343 }; // Default center
  zoom = 13; // Default zoom
  @Input() polygonPaths: google.maps.LatLngLiteral[] = [];
  mapError = false;
  private saudiArabiaBounds = {
    minLat: 15.0,
    maxLat: 32.0,
    minLng: 34.0,
    maxLng: 56.0
  };

  polygonOptions: google.maps.PolygonOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  };

  markerPosition?: google.maps.LatLngLiteral;
  markerOptions: google.maps.MarkerOptions = {
    position: this.markerPosition,
    title: 'My Marker'
  };

  constructor(private geocodingService: GeoCodingService) {

  }

  //life cycle hooks
  ngOnInit(): void {
  }

  //methods
  getCityName(lat: number, lng: number) {
    this.geocodingService.getCityName(lat, lng).subscribe({
      next: (response: any) => {
        console.log(response);
        const results = response.results;
        if (results.length > 0) {
          const addressComponents = results[0].address_components;
          const city = addressComponents.find((component:any) =>
            component.types.includes('locality') ||
            component.types.includes('administrative_area_level_1')
          );
          if (city) {
            console.log('City:', city.long_name);
          } else {
            console.error('City not found in response');
          }
        } else {
          console.error('No results found for the given coordinates');
        }
      },
      error: (error: any) => {
        console.error('Error fetching city name:', error);
      }
    })
  }
  mapClick(event: google.maps.MapMouseEvent) {
    this.polygonPaths = [
      { lat: 32.154301, lng: 35.529152 }, // Define the coordinates of Saudi Arabia boundary points
      { lat: 32.154301, lng: 55.666255 },
      { lat: 15.615467, lng: 55.666255 },
      { lat: 15.615467, lng: 34.574171 },
      { lat: 32.154301, lng: 35.529152 }
    ];
    const latLng = event.latLng?.toJSON() || { lat: 0, lng: 0 };
    if (!this.isInsideSaudiArabia(latLng.lat, latLng.lng)) {
      this.mapError = true; // Set error state to true for shaking effect
      setTimeout(() => this.mapError = false, 1000); // Reset error state after 1 second
    } else {
      this.mapError = false; // Reset error state after 1 second
      this.markerPosition = latLng;
      this.getCityName(this.markerPosition.lat, this.markerPosition.lng);
    }
  }

  private isInsideSaudiArabia(lat: number, lng: number): boolean {
    

    return lat >= this.saudiArabiaBounds.minLat &&
           lat <= this.saudiArabiaBounds.maxLat &&
           lng >= this.saudiArabiaBounds.minLng &&
           lng <= this.saudiArabiaBounds.maxLng;
  }
}
