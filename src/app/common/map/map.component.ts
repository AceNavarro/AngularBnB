import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'bnb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  @Input() location: string;

  lat: number;
  lng: number;
  isLocationError: boolean = false;

  constructor(private mapService: MapService,
              private detectorRef: ChangeDetectorRef) { }

  mapReadyHandler() {
    this.mapService.getGeoLocation(this.location)
      .subscribe(result => {
        this.lat = result.lat;
        this.lng = result.lng;
        this.detectorRef.detectChanges();
       }, err => {
        this.isLocationError = true;
        this.detectorRef.detectChanges();
        console.error(err)
       });
  }
}
