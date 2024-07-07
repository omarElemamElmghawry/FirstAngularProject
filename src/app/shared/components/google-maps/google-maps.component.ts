import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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

  polygonOptions: google.maps.PolygonOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  };

  markerPosition?: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    position: this.markerPosition,
    title: 'My Marker',
    gmpDraggable: true,
  };

  constructor() { }
  //life cycle hooks
  ngOnInit(): void {
  }

  //methods
  mapClick(event: google.maps.MapMouseEvent) {
    this.markerPosition!.lat = event.latLng?.lat() || 0;
    this.markerPosition!.lng = event.latLng?.lng() || 0;
  }
}
