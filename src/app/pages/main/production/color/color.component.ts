import { DataService } from '@/services/data/data.service';
import { DbService, Doc, GetDoc } from '@/services/db/db.service';
import { PinyinService } from '@/services/pinyin/pinyin.service';
import { RandomService } from '@/services/random/random.service';
import { TechnologyService } from '@/services/technology/technology.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';

interface data {
  value: { [x: string]: any }
  checked: boolean
  key: string
}

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {
  id: any;
  textureId: any;
  createColorButtonDisabled = false;
  technology?: GetDoc;
  texture: { [x: string]: any } = {};
  colors: data[] = [];

  patterns = [
    '和差', '比例'
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dataService: DataService,
    private technologyService: TechnologyService,
    public pinyinService: PinyinService,
    private randomService: RandomService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: m => {
        this.id = m['id']
        this.textureId = m['texture']
      }
    })
    setTimeout(() => {
      this.technologyService.Stream
        .pipe(filter(m => m.id_ == this.id))
        .subscribe(m => this.fetchData(m))
      this.fetchData(this.technologyService.doc(this.id))
    }, 0);
  }

  fetchData(technology: GetDoc) {
    if (!technology) return
    this.technology = technology
    this.texture = this.technology['textures'][this.textureId]
    this.colors = [];
    Object.keys(this.texture['colors'])
      .forEach(k => {
        this.colors.unshift({
          checked: false,
          value: this.texture['colors'][k],
          key: k
        })
      })
    this.colors = this.colors.slice()
  }

  // get technology(): { [x: string]: any } {
  //   if (this.technologies.data[this.id]) {
  //     return this.technologies.data[this.id]
  //   }
  //   return {}
  // }

  // get texture(): { [x: string]: any } {
  //   if (this.technology['textures'] && this.technology['textures'][this.textureId]) {
  //     return this.technology['textures'][this.textureId]
  //   }
  //   return {}
  // }

  // get dataList(): string[] {
  //   if (this.texture['colors']) {
  //     return Object.keys(this.texture['colors'])
  //   }
  //   return []
  // }

  // dataItem(key: string): { [x: string]: any } {
  //   return this.texture['colors'][key]
  // }

  onBack() {
    this.router.navigate(['/main/production/technologies', this.id])
  }

  createColor() {
    this.randomService.string(4)
      .then(id => {
        if (this.texture['colors'][id]) {
          this.createColor();
        } else {
          this.texture['colors'][id] = {};
          this.technologyService
            .put(this.technology!)
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
      this.technologyService
        .put(this.technology!);
    }
  }

  delete(key: string) {
    if (this.texture['colors'][key]) {
      delete this.texture['colors'][key]
      this.technologyService
        .put(this.technology!);
    }
  }

  patternSelect(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit']
    }
    this.technologyService
      .put(this.technology!);
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
