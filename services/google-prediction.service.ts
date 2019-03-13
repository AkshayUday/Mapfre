import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { } from 'googlemaps';
/// <reference types="@types/googlemaps" />

@Injectable({
  providedIn: 'root'
})
export class GooglePredictionService {
  autoCompletePrimaryAdd;
  longitude: number = null;
  latitude: number = null;

  constructor() { }

  autoCompleteAddress(value) {
    return new Observable(observer => {
      this.autoCompletePrimaryAdd = new google.maps.places.AutocompleteService();
      this.autoCompletePrimaryAdd.getPlacePredictions(
        {
          input: value,
          location: new google.maps.LatLng(this.latitude, this.longitude),
          radius: 1405,
          types: ['address'],
          componentRestrictions: {
            country: 'us'
          }
        },
        (prediction, status) => {
          const temp = {
            prediction,
            status
          };
          observer.next(temp);
          observer.complete();
        }
      );
    });
  }

  findZipCode(address) {
    return new Observable(observer => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ placeId: address['place_id'] }, (results, status) => {
        if (results) {
          let address_components = results[0]['address_components'];
          address_components = address_components.filter(field => {
            return field['types'][0] === 'postal_code';
          });
          if (address_components.length) {
            observer.next(address_components[0]['long_name']);
          } else {
            observer.error('Postal code not found');
          }
        }
      });
    });
  }

  getLatLong(address, useDefault) {
    if (!useDefault) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': address
      }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.latitude = results[0].geometry.location.lat();
          this.longitude = results[0].geometry.location.lng();
          console.log('Latitude: ' + this.latitude + 'Longitude: ' + this.longitude);
        } else {
          this.latitude = null;
          this.longitude = null;
          console.log('getLatLong Request failed.');
        }
      });
    } else {
      this.latitude = 41.2033216;
      this.longitude = -77.19452469999999;
    }
  }


}
