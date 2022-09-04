import { Doc } from '@/services/db/db.service';
import { UtilsService } from './../../../../services/utils/utils.service';
import { ClientService } from './../../../../services/client/client.service';
import { DataService } from '@/services/data/data.service';
import { TechnologyService } from './../../../../services/technology/technology.service';
import { MathService } from './../../../../services/math/math.service';
import { pinyin } from 'pinyin-pro';
import { PinyinService } from './../../../../services/pinyin/pinyin.service';
import { DbService } from './../../../../services/db/db.service';
import { OrderService } from './../../../../services/order/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { filter, Observable, Subscriber } from 'rxjs';
import { NzFilterOptionType, NzOptionComponent, NzSelectOptionInterface } from 'ng-zorro-antd/select';
import { NzTableComponent } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-producteditor',
  templateUrl: './producteditor.component.html',
  styleUrls: ['./producteditor.component.scss']
})
export class ProducteditorComponent implements OnInit {
  id?: string;
  createProductButtonDisabled = false;
  order?: Doc;
  productSet: { [x: string]: any } = {};
  products: { [x: string]: any }[] = [];
  document = document
  productSets: { [x: string]: any } = {};


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private db: DbService,
    public pinyin: PinyinService,
    public technologies: TechnologyService,
    public dataService: DataService,
    private clientService: ClientService,
    public utilsService: UtilsService,
  ) { }

  async ngOnInit() {
    this.route.params.subscribe({
      next: m => {
        this.id = m['id']
      }
    });
    setTimeout(() => {
      this.orderService.Stream
        .pipe(filter(m => m.id_ == this.id))
        .subscribe(m => this.fetchData(m))
      this.fetchData(this.orderService.doc(this.id!))
    }, 0);
  }

  fetchData(order: Doc) {
    if (!order) return;
    this.order = order
    const products = order['products']
    if (!products) return;
    this.products = products;
  }

  onBack() {
    this.router.navigate(['..'], { relativeTo: this.route })
  }

  createProduct() {
    let insert: { [x: string]: any } = {};
    const sets = Object.values(this.productSets).sort((a, b) => b['create_time'] - a['create_time'])
    let last: { [x: string]: any } = {};
    if (this.products.length) {
      last = this.products.slice(-1)[0];
    } else if (sets.length) {
      for (const set of sets) {
        if (set['products'] && set['products'].length) {
          last = set['products'].slice(-1)[0];
          break;
        }
      }
    }
    if (last['technology']) insert['technology'] = last['technology'];
    if (last['texture']) insert['texture'] = last['texture'];
    if (last['color']) insert['color'] = last['color'];
    if (last['type'] === '出风口') insert['type'] = '回风口';
    else if (last['type'] === '回风口') insert['type'] = '出风口';
    else if (last['type']) insert['type'] = last['type'];
    if (last['unit_price']) insert['unit_price'] = last['unit_price'];
    this.products.push(insert);
    this.orderService
      .put(this.order!)
    // .catch(() => {
    //   this.productSet.pop();
    //   this.createProduct();
    // })
  }

  select(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit']
    }
    data['unit_price'] = this.clientService.unit_price(this.order!['client'], data['technology'], data['texture'], data['color'], data['type'])
    this.orderService.calcProduct(data, true, false)
    this.orderService.calcOrder(this.order!, true, false)
    this.orderService.put(this.order!);
  }

  selectClear(data: { [x: string]: any }, keys: string[]) {
    for (const k of keys) {
      if (data[k]) delete data[k];
    }
  }

  clearFocus(data: { [x: string]: any }) {
    setTimeout(() => {
      if (data['edit']) {
        delete data['edit']
      }
    }, 200);
  }

  change(data: { [x: string]: any }, update: boolean = true) {
    if (data['edit']) {
      delete data['edit'];
    }
    if (data['change']) {
      delete data['change'];
      if (data['length'] && data['width']) {
        const isCalcPrice = data['unit_price'] && update
        this.orderService.calcProduct(data, isCalcPrice);
        this.orderService.calcOrder(this.order!, isCalcPrice);
      }
      this.orderService.put(this.order!);
    }
  }

  delete(data: { [x: string]: any }) {
    const index = this.products.indexOf(data);
    if (index != -1) {
      this.products.splice(index, 1);
      this.orderService.calcProduct(data, true);
      this.orderService.calcOrder(this.order!, true);
      this.orderService.put(this.order!);
    }
  }
}
