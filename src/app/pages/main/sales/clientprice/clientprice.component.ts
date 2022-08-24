import { ClientService } from './../../../../services/client/client.service';
import { DataService } from '@/services/data/data.service';
import { DbService } from '@/services/db/db.service';
import { PinyinService } from '@/services/pinyin/pinyin.service';
import { RandomService } from '@/services/random/random.service';
import { TechnologyService } from '@/services/technology/technology.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-clientprice',
  templateUrl: './clientprice.component.html',
  styleUrls: ['./clientprice.component.scss']
})
export class ClientpriceComponent implements OnInit {
  clientId: any;
  expandSet = new Set<string>();
  hidden = '';
  change = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public data: DataService,
    private technologies: TechnologyService,
    private clients: ClientService,
    public pinyin: PinyinService,
    private random: RandomService,
    private db: DbService,
  ) {
    this.route.params.subscribe({
      next: m => {
        this.clientId = m['client']
      }
    })
  }

  ngOnInit(): void {
  }

  onBack() {
    this.router.navigate(['..'], { relativeTo: this.route })
  }

  onExpandChange(key: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(key);
    } else {
      this.expandSet.delete(key);
    }
  }

  get client(): { [x: string]: any } {
    if (this.clients.data[this.clientId]) {
      return this.clients.data[this.clientId]
    }
    return {}
  }

  get priceList(): { [x: string]: any } {
    if (this.client['unit_price']) {
      return this.client['unit_price']
    }
    return {}
  }

  get technologyList(): string[] {
    const technologies = Object.keys(this.technologies.data)
      .sort((a, b) => this.technologies.data[b]['create_time'] - this.technologies.data[a]['create_time'])
    return technologies
  }

  technologyItem(key: string) {
    return this.technologies.data[key]
  }

  textureList(technologyKey: string) {
    if (this.technologies.data[technologyKey]['textures']) {
      return Object.keys(this.technologies.data[technologyKey]['textures'])
    }
    return []
  }

  textureItem(technologyKey: string, textureKey: string) {
    return this.technologyItem(technologyKey)['textures'][textureKey]
  }

  colorList(technologyKey: string, textureKey: string) {
    if (this.technologies.data[technologyKey]['textures'][textureKey]['colors']) {
      return Object.keys(this.technologies.data[technologyKey]['textures'][textureKey]['colors'])
    }
    return []
  }

  colorItem(technologyKey: string, textureKey: string, colorKey: string) {
    return this.textureItem(technologyKey, textureKey)['colors'][colorKey]
  }

  getTechnologyByKey(key: string): { [x: string]: any } {
    if (this.client['uhit_price'] && this.client['uhit_price'][key]) {
      return this.client['uhit_price'][key]
    }
    return {}
  }

  update() {
    this.hidden = ''
    if (this.change) {
      this.change = false
      this.db.db.client.Local
        ?.put(this.client)
    }
  }
}
