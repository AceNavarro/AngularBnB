import { Component, Input, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { MapService } from './map.service';

@Component({
  selector: 'bnb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @Input() location: string;

  @Input() locationSubject: Subject<any>;

  lat: number;
  lng: number;
  isLocationError: boolean = false;

  constructor(private mapService: MapService,
              private detectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.locationSubject) {
      this.locationSubject.subscribe(
        (result: string) => {
          this.getLocation(result);
        });
    }
  }

  ngOnDestroy() {
    if (this.locationSubject) {
      this.locationSubject.unsubscribe();
    }
  }

  getLocation(strLocation: string) {
    this.mapService.getGeoLocation(strLocation)
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

  mapReadyHandler() {
    this.getLocation(this.location);
  }
}
