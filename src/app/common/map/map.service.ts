import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class MapService {

  private geocoder : any;
  private locationCache: any = {};

  private cacheLocation(location: string, coordinates: any) {
    this.locationCache[location] = coordinates;
  }

  private getCachedLocation(location: string): any {
    return this.locationCache[location];
  }

  private geocodeLocation(location: string): Observable<any> {
    if (!this.geocoder) {
      this.geocoder = new (<any>window).google.maps.Geocoder();
    }

    return new Observable(observer => {
      this.geocoder.geocode({ address: location}, (result, status) => {
        if (status == 'OK') {
          const geometry = result[0].geometry.location;
          const coordinates = { lat: geometry.lat(), lng: geometry.lng() };
          this.cacheLocation(location, coordinates);
          observer.next(coordinates);
        } else {
          observer.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    });
  }

  public getGeoLocation(location: string): Observable<any> {
    const cachedLocation = this.getCachedLocation(location);
    if (cachedLocation) {
      return of(cachedLocation);
    } else {
      return this.geocodeLocation(location);
    }
  }
}