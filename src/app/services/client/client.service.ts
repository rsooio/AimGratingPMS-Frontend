import { PinyinService } from './../pinyin/pinyin.service';
import { DbService } from '@/services/db/db.service';
import { TechnologyService } from '@/services/technology/technology.service';
import { Injectable } from '@angular/core';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  options: (NzSelectOptionInterface & { [x: string]: string })[] = [];
  cache: { [x: string]: string } = {};

  constructor(
    private db: DbService,
    private technologies: TechnologyService,
    private pinyin: PinyinService
  ) {
    (window as any)['client'] = this;
    this.db.db.client.Pipe
      ?.subscribe({
        next: m => {
          if (m['_deleted']) {
            delete this._clients[m._id]
          } else {
            this._clients[m._id] = m
          }
          this.transfer()
        }
      })
    this.db.db.client.Local?.find({
      selector: {
        workshop: 'a'
      }
    }).then(m => {
      for (const i of m.docs) {
        if (i['_deleted']) {
          console.log('deleted true')
        } else {
          this._clients[i._id] = i
        }
        this.transfer()
      }
    })
  }

  transfer() {
    this.options = [];
    Object.keys(this._clients)
      .filter(k => this._clients[k]['name'])
      .forEach(k => {
        this.options.push({
          label: this._clients[k]['name'],
          value: k,
          pinyin: this.pinyin.firstLetter(this._clients[k]['name'])
        })
        this.cache[k] = this._clients[k]['name'];
      })
  }

  private _clients: { [x: string]: PouchDB.Core.ExistingDocument<{ [x: string]: any; }> } = {}

  get data() {
    return this._clients
  }

  unit_price(clientKey: string, technologyKey: string, textureKey?: string, colorKey?: string) {
    if (!this._clients[clientKey] || !this._clients[clientKey]['unit_price']) return 0;
    const prices = this._clients[clientKey]['unit_price']
    if (textureKey) {
      if (colorKey && prices[technologyKey + textureKey + colorKey]) {
        return prices[technologyKey + textureKey + colorKey];
      }
      if (prices[technologyKey + textureKey]) {
        return prices[technologyKey + textureKey];
      }
    }
    if (prices[technologyKey]) {
      return prices[technologyKey];
    }
    if (!prices['default']) return 0;
    const technology = this.technologies.data[technologyKey]
    if (textureKey) {
      const texture = technology['textures'][textureKey]
      if (colorKey) {
        const color = texture['colors'][colorKey]
        if (color['pattern'] && color['factor']) {
          if (color['pattern'] == '和差') {
            return prices['default'] + color['factor'];
          }
          if (color['pattern'] == '比例') {
            return prices['default'] * color['factor'];
          }
        }
      }
      if (texture['pattern'] && texture['factor']) {
        if (texture['pattern'] == '和差') {
          return prices['default'] + texture['factor'];
        }
        if (texture['pattern'] == '比例') {
          return prices['default'] * texture['factor'];
        }
      }
    }
    if (technology['pattern'] && technology['factor']) {
      if (technology['pattern'] == '和差') {
        return prices['default'] + technology['factor'];
      }
      if (technology['pattern'] == '比例') {
        return prices['default'] * technology['factor'];
      }
    }
    return prices['default'];
  }
}
