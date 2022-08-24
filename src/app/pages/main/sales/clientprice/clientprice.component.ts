import { UtilsService } from './../../../../services/utils/utils.service';
import { ClientService } from './../../../../services/client/client.service';
import { DataService } from '@/services/data/data.service';
import { DbService } from '@/services/db/db.service';
import { PinyinService } from '@/services/pinyin/pinyin.service';
import { RandomService } from '@/services/random/random.service';
import { TechnologyService } from '@/services/technology/technology.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';

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
  loading = true;
  prices: { [x: string]: any } = {};
  client: { [x: string]: any; } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private randomService: RandomService,
    public technologyService: TechnologyService,
    private clientService: ClientService,
    private dbService: DbService,
    public dataService: DataService,
    public pinyinService: PinyinService,
    public utilsService: UtilsService,
  ) {
    (window as any)['clientprice'] = this;
  }

  get types() {
    return ['默认', ...this.dataService.AIR_GRATING_TYPE]
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: m => {
        this.clientId = m['client']
      }
    })
    setTimeout(() => {
      this.loading = false;
      this.clientService.pdata()
        .then(m => this.fetchData(m[this.clientId]))
      this.dbService.db.order.Pipe
        ?.pipe(filter(m => m._id == this.clientId))
        .subscribe(m => this.fetchData(m))
    }, 0);
  }

  fetchData(client: { [x: string]: any }) {
    if (!client || !client['unit_price']) return;
    this.client = client;
    this.prices = client['unit_price'];
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

  get _client(): { [x: string]: any } {
    if (this.clientService.data[this.clientId]) {
      return this.clientService.data[this.clientId]
    }
    return {}
  }

  get _priceList(): { [x: string]: any } {
    if (this.client['unit_price']) {
      return this.client['unit_price']
    }
    return {}
  }

  get technologyList(): string[] {
    const technologies = Object.keys(this.technologyService.data)
      .sort((a, b) => this.technologyService.data[b]['create_time'] - this.technologyService.data[a]['create_time'])
    return technologies
  }

  technologyItem(key: string) {
    return this.technologyService.data[key]
  }

  textureList(technologyKey: string) {
    if (this.technologyService.data[technologyKey]['textures']) {
      return Object.keys(this.technologyService.data[technologyKey]['textures'])
    }
    return []
  }

  textureItem(technologyKey: string, textureKey: string) {
    return this.technologyItem(technologyKey)['textures'][textureKey]
  }

  colorList(technologyKey: string, textureKey: string) {
    if (this.technologyService.data[technologyKey]['textures'][textureKey]['colors']) {
      return Object.keys(this.technologyService.data[technologyKey]['textures'][textureKey]['colors'])
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
      this.dbService.db.client.Local
        ?.put(this.client)
    }
  }
}
