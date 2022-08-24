import { DataService } from '@/services/data/data.service';
import { DbService } from '@/services/db/db.service';
import { PinyinService } from '@/services/pinyin/pinyin.service';
import { RandomService } from '@/services/random/random.service';
import { TechnologyService } from '@/services/technology/technology.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {
  id: any;
  textureId: any;
  createColorButtonDisabled = false;

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
        this.textureId = m['texture']
      }
    })
  }

  get technology(): { [x: string]: any } {
    if (this.technologies.data[this.id]) {
      return this.technologies.data[this.id]
    }
    return {}
  }

  get texture(): { [x: string]: any } {
    if (this.technology['textures'] && this.technology['textures'][this.textureId]) {
      return this.technology['textures'][this.textureId]
    }
    return {}
  }

  get dataList(): string[] {
    if (this.texture['colors']) {
      return Object.keys(this.texture['colors'])
    }
    return []
  }

  dataItem(key: string): { [x: string]: any } {
    return this.texture['colors'][key]
  }

  ngOnInit(): void {
  }

  onBack() {
    this.router.navigate(['/main/production/technologies', this.id])
  }

  createColor() {
    this.random.string(4)
      .then(id => {
        if (this.dataItem(id)) {
          this.createColor();
        } else {
          this.texture['colors'][id] = {};
          this.db.db.technology.Local
            ?.put(this.technology)
            .catch(() => {
              delete this.texture['colors'][id];
              this.createColor();
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
    if (this.dataItem(key)) {
      delete this.texture['colors'][key]
      this.db.db.technology.Local
        ?.put(this.technology);
    }
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
