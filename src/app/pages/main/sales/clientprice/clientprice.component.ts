import { UtilsService } from './../../../../services/utils/utils.service';
import { ClientService } from './../../../../services/client/client.service';
import { DataService } from '@/services/data/data.service';
import { DbService, Doc, GetDoc } from '@/services/db/db.service';
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
  prices: { [x: string]: any } = {};
  client?: GetDoc;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private randomService: RandomService,
    public technologyService: TechnologyService,
    private clientService: ClientService,
    public dataService: DataService,
    public pinyinService: PinyinService,
    public utilsService: UtilsService,
  ) { }

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
      this.clientService.Stream
        .pipe(filter(m => m.id_ == this.clientId))
        .subscribe(m => this.fetchData(m))
      this.fetchData(this.clientService.item(this.clientId))
    }, 0);
  }

  fetchData(client: GetDoc) {
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

  // getTechnologyByKey(key: string): Doc {
  //   if (this.client && this.client['uhit_price'] && this.client['uhit_price'][key]) {
  //     return this.client['uhit_price'][key]
  //   }
  //   return {}
  // }

  update() {
    this.hidden = ''
    if (this.change) {
      this.change = false
      this.clientService.put(this.client!)
    }
    console.log(this.prices)
  }
}
