import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@/services/data/data.service';
import { DbService } from '@/services/db/db.service';
import { PinyinService } from '@/services/pinyin/pinyin.service';
import { RandomService } from '@/services/random/random.service';
import { TechnologyService } from '@/services/technology/technology.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-texture',
  templateUrl: './texture.component.html',
  styleUrls: ['./texture.component.scss']
})
export class TextureComponent implements OnInit {
  createTextureButtonDisabled = false
  id: any;

  patterns = [
    '和差', '比例'
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public data: DataService,
    private technologies: TechnologyService,
    public pinyin: PinyinService,
    private random: RandomService,
    private db: DbService,
  ) {
    this.route.params.subscribe({
      next: m => {
        this.id = m['id']
      }
    })
  }

  get technology(): { [x: string]: any } {
    if (this.technologies.data[this.id]) {
      return this.technologies.data[this.id]
    }
    return {}
  }

  get dataList(): string[] {
    if (this.technology['textures']) {
      return Object.keys(this.technology['textures'])
    }
    return []
  }

  dataItem(key: string) {
    return this.technology['textures'][key]
  }

  ngOnInit(): void {
  }

  onBack() {
    this.router.navigate(['/main/production/technologies'])
  }

  createTexture() {
    this.random.string(4)
      .then(id => {
        if (this.dataItem(id)) {
          this.createTexture();
        } else {
          this.technology['textures'][id] = {
            colors: {},
          };
          console.log(this.technology)
          this.db.db.technology.Local
            ?.put(this.technology)
            .catch(() => {
              delete this.technology['textures'][id];
              this.createTexture();
            })
        }
      })
  }

  change(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit'];
    }
    if (data['change']) {
      delete data['change'];
      this.db.db.technology.Local
        ?.put(this.technology);
    }
  }

  delete(key: string) {
    if (this.technology['texture'][key]) {
      delete this.technology['texture'][key]
    }
    this.db.db.technology.Local
      ?.put(this.technology);
  }

  patternSelect(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit']
    }
    this.db.db.technology.Local
      ?.put(this.technology);
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
