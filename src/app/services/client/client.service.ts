import { filter, Subject } from 'rxjs';
import { PinyinService } from './../pinyin/pinyin.service';
import { DbService, Doc, GetDoc } from '@/services/db/db.service';
import { TechnologyService } from '@/services/technology/technology.service';
import { Injectable } from '@angular/core';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  type = 'client';
  Stream: Subject<GetDoc> = new Subject<GetDoc>();
  options: (NzSelectOptionInterface & { [x: string]: string })[] = [];
  cache: { [x: string]: string } = {};
  private _docs: { [x: string]: GetDoc } = {}

  constructor(
    private dbService: DbService,
    private technologies: TechnologyService,
    private pinyin: PinyinService
  ) {
    (window as any)['client'] = this;
    this.dbService.Stream
      .pipe(filter(m => m.type_ === this.type))
      .subscribe({
        next: m => {
          this.add(m);
          this.transfer();
        },
        error: e => this.Stream.error(e),
        complete: () => this.Stream.complete(),
      })
    this.dbService.find(this.type)
      .subscribe({
        next: m => this.add(m),
        error: e => this.Stream.error(e),
        complete: () => this.transfer(),
      })
  }

  async add(data: GetDoc) {
    this.Stream.next(data);
    if (data['_deleted']) {
      delete this._docs[data._id]
    } else {
      this._docs[data._id] = data
    }
  }

  transfer() {
    this.options = [];
    Object.values(this._docs)
      .filter(v => v['name'])
      .forEach(v => {
        this.options.push({
          label: v['name'],
          value: v.id_!,
          pinyin: this.pinyin.firstLetter(v['name'])
        })
        this.cache[v.id_!] = v['name'];
      })
  }

  async put(data: Doc, options?: PouchDB.Core.PutOptions) {
    return this.dbService.put(this.type, data, options);
  }

  async get(docId: string, options?: PouchDB.Core.GetOptions) {
    return this.dbService.get(this.type, docId, options);
  }

  item(id: string) {
    return this._docs[this.type + '/' + id]
  }

  data() {
    return Object.values(this._docs);
  }

  unit_price(clientKey: string, technologyKey: string, textureKey?: string, colorKey?: string, type?: string) {
    const client = this.item(clientKey);
    if (!client || !client['unit_price']) return 0;
    const prices = client['unit_price']
    if (textureKey) {
      if (type && prices[technologyKey + textureKey + colorKey + '-' + type]) {
        return prices[technologyKey + textureKey + colorKey];
      }
      if (colorKey && prices[technologyKey + textureKey + colorKey + '-默认']) {
        return prices[technologyKey + textureKey + colorKey + '-默认'];
      }
      if (type && prices[technologyKey + textureKey + '-' + type]) {
        return prices[technologyKey + textureKey + '-默认'];
      }
      if (prices[technologyKey + textureKey + '-默认']) {
        return prices[technologyKey + textureKey];
      }
    }
    if (type && prices[technologyKey + '-' + type]) {
      return prices[technologyKey];
    }
    if (prices[technologyKey + '-默认']) {
      return prices[technologyKey + '-默认'];
    }
    if (!prices['default']) return 0;
    const technology = this.technologies.doc(technologyKey)
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
