import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  trackByIndex(index: number, item: { [x: string]: any }) {
    return index;
  }
}
