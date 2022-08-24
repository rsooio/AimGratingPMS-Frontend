import { DbService } from '@/services/db/db.service';
import { RandomService } from '@/services/random/random.service';
import { PinyinService } from './../../../../services/pinyin/pinyin.service';
import { TechnologyService } from './../../../../services/technology/technology.service';
import { DataService } from '@/services/data/data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.scss']
})
export class TechnologyComponent implements OnInit {
  createTechnologyButtonDisabled = false

  patterns = [
    '和差', '比例'
  ]

  constructor(
    public data: DataService,
    private technology: TechnologyService,
    public pinyin: PinyinService,
    private random: RandomService,
    private db: DbService,
  ) {

  }

  get dataList(): any[] {
    return Object.keys(this.technology.data)
      .sort((a, b) => this.dataItem(b)['create_time'] - this.dataItem(a)['create_time'])
  }

  dataItem(key: string) {
    return this.technology.data[key]
  }

  ngOnInit(): void {
  }

  createTechnology() {
    this.random.string(4)
      .then(id => {
        this.db.db.technology.Local
          ?.get(id)
          .then(() => this.createTechnology())
          .catch(() => {
            this.db.db.technology.Local
              ?.put({
                _id: id,
                workshop: this.data.info.workshop,
                create_time: new Date().getTime(),
                textures: {}
              })
            // .catch(() => this.createOrder())
          })
      })
  }

  change(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit'];
    }
    if (data['change']) {
      delete data['change'];
      this.db.db.technology.Local
        ?.put(data);
    }
  }

  delete(key: string) {
    this.db.db.technology.Local
      ?.put({
        _id: key,
        _rev: this.dataItem(key)._rev,
        _deleted: true
      })
  }

  patternSelect(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit']
    }
    this.db.db.technology.Local
      ?.put(data);
  }

  clearFocus(data: { [x: string]: any }) {
    setTimeout(() => {
      console.log('blur')
      if (data['edit']) {
        delete data['edit']
      }
    }, 200);
  }
}
