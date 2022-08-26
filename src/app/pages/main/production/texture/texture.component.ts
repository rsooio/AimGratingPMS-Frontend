import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@/services/data/data.service';
import { DbService, Doc, GetDoc } from '@/services/db/db.service';
import { PinyinService } from '@/services/pinyin/pinyin.service';
import { RandomService } from '@/services/random/random.service';
import { TechnologyService } from '@/services/technology/technology.service';
import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs';

interface data {
  value: { [x: string]: any }
  checked: boolean
  key: string
}

@Component({
  selector: 'app-texture',
  templateUrl: './texture.component.html',
  styleUrls: ['./texture.component.scss']
})
export class TextureComponent implements OnInit {
  createTextureButtonDisabled = false
  id: any;
  technology?: GetDoc;
  textureMap: { [x: string]: any } = {};
  textures: data[] = [];

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
    if (!technology) return;
    this.technology = technology
    this.textures = [];
    Object.keys(this.technology['textures'])
      .forEach(k => {
        this.textures.unshift({
          checked: false,
          value: this.technology!['textures'][k],
          key: k
        })
      })
  }

  // get technology(): { [x: string]: any } {
  //   if (this.technologies.data[this.id]) {
  //     return this.technologies.data[this.id]
  //   }
  //   return {}
  // }

  // get dataList(): string[] {
  //   if (this.technology['textures']) {
  //     return Object.keys(this.technology['textures'])
  //   }
  //   return []
  // }

  // dataItem(key: string) {
  //   return this.technology['textures'][key]
  // }

  onBack() {
    this.router.navigate(['/main/production/technologies'])
  }

  createTexture() {
    this.randomService.string(4)
      .then(id => {
        if (this.technology!['textures'][id]) {
          this.createTexture();
        } else {
          this.technology!['textures'][id] = {
            colors: {},
          };
          console.log(this.technology)
          this.technologyService
            .put(this.technology!)
            .catch(() => {
              delete this.technology!['textures'][id];
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
      this.technologyService
        .put(this.technology!);
    }
  }

  delete(key: string) {
    if (this.technology!['textures'][key]) {
      delete this.technology!['textures'][key]
    }
    this.technologyService
      .put(this.technology!);
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
