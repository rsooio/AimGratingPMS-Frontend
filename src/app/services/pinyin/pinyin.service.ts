import { Injectable } from '@angular/core';
import { NzFilterOptionType } from 'ng-zorro-antd/select';
import { pinyin } from 'pinyin-pro';

@Injectable({
  providedIn: 'root'
})
export class PinyinService {

  constructor() { }

  private _pinyinCache: { [x: string]: string } = {};

  firstLetter(str: string): string {
    if (!this._pinyinCache[str]) {
      this._pinyinCache[str] = pinyin(str, { pattern: 'first', toneType: 'none', type: 'array' }).join('');
    }
    return this._pinyinCache[str]
  }

  SearchByPinyin: NzFilterOptionType = (input, option) => {
    return this.firstLetter(option.nzLabel as string).indexOf(input!) != -1;
  }
}
