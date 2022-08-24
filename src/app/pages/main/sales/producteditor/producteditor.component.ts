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
  id: any;
  setid: any;
  createProductButtonDisabled = false;
  order: { [x: string]: any } = {};
  productSet: { [x: string]: any } = {};
  products: { [x: string]: any }[] = [];
  loading = true;
  document = document


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
  ) {
    (window as any)['debug'] = this;
  }

  fetchData(order: { [x: string]: any }) {
    if (!order) return;
    this.order = order
    const productSets = order['product_set'];
    if (!productSets) return;
    const productSet = productSets[this.setid];
    if (!productSet) return;
    this.productSet = productSet;
    const products = productSet['products']
    if (!products) return;
    this.products = products;
  }

  // get technologyList(): string[] {
  //   return Object.keys(this.technologies.tree);
  // }

  // get order(): { [x: string]: any } {
  //   return this.orderService.data[this.id] ? this.orderService.data[this.id] : {}
  // }

  // get productSet(): { [x: string]: any } {
  //   if (this.order['product_set']) {
  //     return this.order['product_set'][this.setid] ? this.order['product_set'][this.setid] : {}
  //   }
  //   return {}
  // }

  // get products(): { [x: string]: any }[] {
  //   return this.productSet['products'] ? this.productSet['products'] : []
  // }

  // textureList(data: { [x: string]: any }) {
  //   if (!this.technologies.cache[data['technology']]) return [];
  //   return Object.keys(this.technologies.tree[data['technology']])
  // }

  // colorList(data: { [x: string]: any }) {
  //   if (!this.technologies.cache[data['technology'] + data['texture']]) return [];
  //   return this.technologies.tree[data['technology']][data['texture']];
  // }

  async ngOnInit() {
    this.route.params.subscribe({
      next: m => {
        this.id = m['id']
        this.setid = m['setid']
      }
    });
    setTimeout(() => {
      this.loading = false;
      this.orderService.pdata()
        .then(m => this.fetchData(m[this.id]))
      this.db.db.order.Pipe
        ?.pipe(filter(m => m._id == this.id))
        .subscribe(m => this.fetchData(m))
    }, 0);
  }

  async ngAfterViewInit() {
  }

  onBack() {
    this.router.navigate(['..'], { relativeTo: this.route })
  }

  createProduct() {
    let insert: { [x: string]: any } = {};
    if (this.products.length) {
      const last = this.products.slice(-1)[0];
      if (last['technology']) insert['technology'] = last['technology'];
      if (last['texture']) insert['texture'] = last['texture'];
      if (last['color']) insert['color'] = last['color'];
      if (last['type'] === '出风口') insert['type'] = '回风口';
      else if (last['type'] === '回风口') insert['type'] = '出风口';
      else if (last['type']) insert['type'] = last['type'];
      if (last['unit_price']) insert['unit_price'] = last['unit_price'];
    }
    this.products.push(insert);
    this.db.db.order.Local
      ?.put(this.order)
    // .catch(() => {
    //   this.productSet.pop();
    //   this.createProduct();
    // })
  }

  select(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit']
    }
    data['unit_price'] = this.clientService.unit_price(this.order['client'], data['technology'], data['texture'], data['color'])
    // data['price'] = MathService.round(data['area'] * data['unit_price'], 2);
    this.orderService.calcProduct(data, true, false)
    this.orderService.calcProductSet(this.order['product_set'][this.setid], true, false)
    this.orderService.calcOrder(this.order, true, false)
    // this.order['product_set'][this.setid]['price'] = MathService.round(this.products
    //   .reduce((prev, curr) => curr['price'] ? prev + curr['price'] : prev, 0), 2);
    // this.order['price'] = MathService.round(Object.values<{ [x: string]: any }>(this.order['product_set'])
    //   .reduce((prev, curr) => curr['price'] ? prev + curr['price'] : prev, 0), 2);
    this.db.db.order.Local
      ?.put(this.order);
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
        this.orderService.calcProductSet(this.order['product_set'][this.setid], isCalcPrice);
        this.orderService.calcOrder(this.order, isCalcPrice);
      }
      this.db.db.order.Local
        ?.put(this.order);
    }
  }

  delete(data: { [x: string]: any }) {
    const index = this.products.indexOf(data);
    if (index != -1) {
      this.products.splice(index, 1);
      this.db.db.order.Local
        ?.put(this.order);
    }
  }


}
