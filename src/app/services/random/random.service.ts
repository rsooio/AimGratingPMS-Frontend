import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomService {

  constructor() { }

  async string(length: number) {
    const char_set = '0123456789abcdefghijklmnopqrstuvwxyz';
    let str = '';
    const proc: Array<Promise<string>> = []
    for (let i = 0; i < length; i++) {
      proc.push(((async () => char_set[Math.floor.call(this, Math.random.call(this) * 36)])()))
    }
    await Promise.all(proc).then(m => str = m.join(''))
    return str;
  }
}
