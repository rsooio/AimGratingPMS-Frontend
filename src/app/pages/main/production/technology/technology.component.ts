import { DbService } from '@/services/db/db.service';
import { RandomService } from '@/services/random/random.service';
import { PinyinService } from './../../../../services/pinyin/pinyin.service';
import { TechnologyService } from './../../../../services/technology/technology.service';
import { DataService } from '@/services/data/data.service';
import { Component, OnInit } from '@angular/core';

type data = {
  checked: boolean,
  value: PouchDB.Core.ExistingDocument<{ [x: string]: any }>,
}

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.scss']
})
export class TechnologyComponent implements OnInit {
  createTechnologyButtonDisabled = false
  loading = true;
  technologies: data[] = [];

  patterns = [
    '和差', '比例'
  ]

  constructor(
    public data: DataService,
    private technologyService: TechnologyService,
    public pinyin: PinyinService,
    private random: RandomService,
    private db: DbService,
  ) {

  }

  // get dataList(): any[] {
  //   return Object.keys(this.technology.data)
  //     .sort((a, b) => this.dataItem(b)['create_time'] - this.dataItem(a)['create_time'])
  // }

  // dataItem(key: string) {
  //   return this.technology.data[key]
  // }

  ngOnInit(): void {
    setTimeout(() => {
      this.technologyService.pdata()
        .then(m => {
          Object.values(m)
            .sort((a, b) => b['create_time'] - a['create_time'])
            .forEach(order => this.technologies.push({
              checked: false,
              value: order,
            }));
          this.technologies = this.technologies.slice();
          this.loading = false;
        })
      this.db.db.technology.Pipe
        .subscribe(m => {
          if (m['_deleted']) {
            this.technologies.splice(this.technologies.findIndex(v => v.value._id === m._id), 1);
          } else {
            const index = this.technologies.findIndex(v => v.value._id === m._id)
            if (index != -1) {
              this.technologies[index].value = m;
            } else {
              this.technologies.unshift({ checked: false, value: m });
            }
          }
          this.technologies = this.technologies.slice();
          // this.refreshCheckedStatus();
        })
    }, 0);
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

  delete(data: data) {
    data.value['_deleted'] = true;
    this.db.db.technology.Local
      ?.put(data.value)
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
