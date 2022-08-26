import { pinyin } from 'pinyin-pro';
import { PinyinService } from '@/services/pinyin/pinyin.service';
import { DataService } from '@/services/data/data.service';
import { DbService, Doc, GetDoc } from '@/services/db/db.service';
import { Injectable } from '@angular/core';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { Subject, filter, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  type = 'technology';
  Stream: Subject<GetDoc> = new Subject<GetDoc>();
  cache: { [x: string]: string } = {};
  options: { [x: string]: (NzSelectOptionInterface & { [x: string]: string })[] } = {};
  private _docs: { [x: string]: GetDoc } = {}

  constructor(
    private dbService: DbService,
    private dataService: DataService,
    private pinyin: PinyinService,
  ) {
    (window as any)['technology'] = this;
    this.dbService.Stream
      .pipe(filter(m => m.type_ === this.type))
      .subscribe({
        next: m => {
          this.add(m);
          this.createTree();
        },
        error: e => this.Stream.error(e),
        complete: () => this.Stream.unsubscribe()
      })
    this.dbService.find(this.type)
      .subscribe({
        next: m => this.add(m),
        error: e => this.Stream.error(e),
        complete: () => this.createTree(),
      })
  }

  async add(data: GetDoc) {
    if (data['_deleted']) {
      delete this._docs[data._id!]
    } else {
      this._docs[data._id!] = data
    }
    this.Stream.next(data);
  }

  createTree() {
    this.options = { technology: [] };
    Object.values(this._docs)
      .filter(v => v['name'])
      .forEach(v => {
        this.cache[v.id_!] = v['name']
        this.options['technology'].push({
          label: v['name'],
          value: v.id_!,
          pinyin: this.pinyin.firstLetter(v['name']),
        })
        const textures = v['textures']
        if (!textures) return;
        this.options[v.id_!] = [];
        Object.keys(textures)
          .filter(l => textures[l]['name'])
          .forEach(l => {
            this.cache[v.id_! + l] = textures[l]['name'];
            this.options[v.id_!].push({
              label: textures[l]['name'],
              value: l,
              pinyin: this.pinyin.firstLetter(textures[l]['name']),
            })
            const colors = textures[l]['colors'];
            if (!colors) return;
            this.options[v.id_! + l] = [];
            Object.keys(colors)
              .filter(m => colors[m]['name'])
              .forEach(m => {
                this.cache[v.id_! + l + m] = colors[m]['name'];
                this.options[v.id_! + l].push({
                  label: colors[m]['name'],
                  value: m,
                  pinyin: this.pinyin.firstLetter(colors[m]['name']),
                })
              })
          })
      })
  }

  async put(data: Doc, options?: PouchDB.Core.PutOptions) {
    return this.dbService.put(this.type, data, options);
  }

  async get(docId: string, options?: PouchDB.Core.GetOptions) {
    return this.dbService.get(this.type, docId, options);
  }

  doc(id: string) {
    return this._docs[this.type + '/' + id]
  }

  docs() {
    return Object.values(this._docs)
  }
}
