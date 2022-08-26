import { DbService, Doc, GetDoc } from '@/services/db/db.service';
import { RandomService } from '@/services/random/random.service';
import { PinyinService } from './../../../../services/pinyin/pinyin.service';
import { TechnologyService } from './../../../../services/technology/technology.service';
import { DataService } from '@/services/data/data.service';
import { Component, OnInit } from '@angular/core';

type data = {
  checked: boolean,
  value: GetDoc,
}

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.scss']
})
export class TechnologyComponent implements OnInit {
  createTechnologyButtonDisabled = false
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
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.technologyService.Stream
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
      this.technologyService.docs()
        .sort((a, b) => b['create_time'] - a['create_time'])
        .forEach(order => this.technologies.push({
          checked: false,
          value: order,
        }));
      this.technologies = this.technologies.slice();
    }, 0);
  }

  createTechnology() {
    this.random.string(4)
      .then(id => {
        this.technologyService
          .get(id)
          .then(() => this.createTechnology())
          .catch(() => {
            this.technologyService
              ?.put({
                id_: id,
                create_time: new Date().getTime(),
                textures: {}
              })
            // .catch(() => this.createOrder())
          })
      })
  }

  change(data: Doc) {
    if (data['edit']) {
      delete data['edit'];
    }
    if (data['change']) {
      delete data['change'];
      this.technologyService
        ?.put(data);
    }
  }

  delete(data: data) {
    data.value['_deleted'] = true;
    this.technologyService
      ?.put(data.value)
  }

  patternSelect(data: Doc) {
    if (data['edit']) {
      delete data['edit']
    }
    this.technologyService
      ?.put(data);
  }

  clearFocus(data: Doc) {
    setTimeout(() => {
      console.log('blur')
      if (data['edit']) {
        delete data['edit']
      }
    }, 200);
  }
}
