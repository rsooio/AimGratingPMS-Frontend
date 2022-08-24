import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathService {

  constructor() { }

  static round(num: number, digit: number) {
    const placeholder = Math.pow(10, digit);
    return Math.round((num + Number.EPSILON) * placeholder) / placeholder;
  }
}
