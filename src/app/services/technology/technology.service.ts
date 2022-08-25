import { pinyin } from 'pinyin-pro';
import { PinyinService } from '@/services/pinyin/pinyin.service';
import { DataService } from '@/services/data/data.service';
import { DbService } from '@/services/db/db.service';
import { Injectable } from '@angular/core';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  cache: { [x: string]: string } = {};
  options: { [x: string]: (NzSelectOptionInterface & { [x: string]: string })[] } = {};
  init: Promise<void>;

  constructor(
    private db: DbService,
    private dataService: DataService,
    private pinyin: PinyinService,
  ) {
    (window as any)['technology'] = this;
    this.db.db.technology.Pipe
      ?.subscribe({
        next: m => {
          if (m['_deleted']) {
            delete this._technologies[m._id]
          } else {
            this._technologies[m._id] = m
          }
          this.createTree();
        }
      })
    this.init = this.db.db.technology.Local!.find({
      selector: {
        workshop: this.dataService.info.workshop
      }
    }).then(m => {
      for (const i of m.docs) {
        if (i['_deleted']) {
          console.log('deleted true')
        } else {
          this._technologies[i._id] = i
        }
        this.createTree();
      }
    })
  }

  createTree() {
    this.options = { technology: [] };
    Object.keys(this._technologies)
      .filter(k => this._technologies[k]['name'])
      .forEach(k => {
        this.cache[k] = this._technologies[k]['name']
        this.options['technology'].push({
          label: this._technologies[k]['name'],
          value: k,
          pinyin: this.pinyin.firstLetter(this._technologies[k]['name']),
        })
        const textures = this._technologies[k]['textures']
        if (!textures) return;
        this.options[k] = [];
        Object.keys(textures)
          .filter(l => textures[l]['name'])
          .forEach(l => {
            this.cache[k + l] = textures[l]['name'];
            this.options[k].push({
              label: textures[l]['name'],
              value: l,
              pinyin: this.pinyin.firstLetter(textures[l]['name']),
            })
            const colors = textures[l]['colors'];
            if (!colors) return;
            this.options[k + l] = [];
            Object.keys(colors)
              .filter(m => colors[m]['name'])
              .forEach(m => {
                this.cache[k + l + m] = colors[m]['name'];
                this.options[k + l].push({
                  label: colors[m]['name'],
                  value: m,
                  pinyin: this.pinyin.firstLetter(colors[m]['name']),
                })
              })
          })
      })
  }

  private _technologies: { [x: string]: PouchDB.Core.ExistingDocument<{ [x: string]: any; }> } = {}

  get data() {
    return this._technologies
  }

  async pdata() {
    await this.init
    return this._technologies
  }
}
