import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {
    (window as any).utils = this;
  }

  trackByIndex(index: number, item: { [x: string]: any }) {
    return index;
  }

  encode(str: string) {
    let arr = str.split('');
    arr.forEach((v, i) => {
      const point = v.codePointAt(0);
      if (!point) throw new Error('unallowed string')
      arr[i] = point.toString(36);
    })
    return 'v0_' + arr.join('_');
  }

  decode(str: string) {
    let arr = str.split('_');
    arr.shift();
    arr.forEach((v, i) => {
      arr[i] = String.fromCodePoint(parseInt(v, 36))
    })
    return arr.join('');
  }

  // encode(str: string) {
  //   let ret = '';
  //   let x = Buffer.from(str)
  //   Buffer.from(str).forEach(m => ret += m.toString(16))
  //   return ret;
  // }

  // decode(str: string) {
  //   let num: number = parseInt(str, 16);
  //   let arr: number[] = [];
  //   for (let i = 0; i < str.length; i += 2) {
  //     arr.push(parseInt(str.substring(i, i + 2), 16));
  //   }
  //   return Buffer.of(...arr).toString()
  // }
}
