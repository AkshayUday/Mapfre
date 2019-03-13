import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
_streetName;
  constructor() { }

set streetName(val) {
  this._streetName = val;
}

get streetName() {
  return this._streetName;
}

}
