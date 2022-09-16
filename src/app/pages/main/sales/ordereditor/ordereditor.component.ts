import { UtilsService } from '@/services/utils/utils.service';
import { ClientService } from '@/services/client/client.service';
import { PinyinService } from '@/services/pinyin/pinyin.service';
import { RandomService } from '@/services/random/random.service';
import { DbService, Doc, GetDoc } from '@/services/db/db.service';
import { DataService } from '@/services/data/data.service';
import { OrderService } from '@/services/order/order.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TechnologyService } from '@/services/technology/technology.service';

interface product {
  key: string
  value: { [x: string]: any }
}

@Component({
  selector: 'app-ordereditor',
  templateUrl: './ordereditor.component.html',
  styleUrls: ['./ordereditor.component.scss']
})
export class OrdereditorComponent implements OnInit {
  id?: string;
  order?: GetDoc;
  products: product[] = [];
  date?: string;
  checkedSet: Set<string> = new Set<string>();

  get clients() {
    return Object.values(this.clientService.data)
      .filter(v => v['name'])
  }

  constructor(
    private db: DbService,
    public dataService: DataService,
    public orderService: OrderService,
    private random: RandomService,
    private route: ActivatedRoute,
    private router: Router,
    public pinyin: PinyinService,
    public clientService: ClientService,
    public utilsService: UtilsService,
    public technologyService: TechnologyService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: m => {
        this.id = m['id']
      }
    })
    setTimeout(() => {
      this.orderService.Stream
        .pipe(filter(m => m.id_ == this.id))
        .subscribe(m => this.fetchData(m))
      this.fetchData(this.orderService.doc(this.id!))
    }, 0);
  }

  fetchData(order: GetDoc) {
    if (!order) return;
    this.order = order
    if (this.order['date']) {
      const date = new Date(this.order['date'])
      this.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    } else {
      this.date = undefined
    }
    const products = order['products'];
    this.products = [];
    Object.keys(products)
      .sort((a, b) => products[b]['create_time'] - products[a]['create_time'])
      .forEach(k => this.products.push({ key: k, value: products[k] }));
    this.products = this.products.slice();
  }

  createProduct(insert?: { [x: string]: any }) {
    if (this.order == undefined) return;
    if (!insert) {
      insert = {};
      if (this.products.length) {
        let last: { [x: string]: any } = {};
        last = this.products[0].value;
        if (last['technology']) insert['technology'] = last['technology'];
        if (last['texture']) insert['texture'] = last['texture'];
        if (last['color']) insert['color'] = last['color'];
        if (last['type'] === '出风口') insert['type'] = '回风口';
        else if (last['type'] === '回风口') insert['type'] = '出风口';
        else if (last['type']) insert['type'] = last['type'];
        if (last['unit_price']) insert['unit_price'] = last['unit_price'];
      }
    }
    this.random.string(3)
      .then(id => {
        if (this.order!['products'][id]) {
          this.createProduct(insert);
        } else {
          insert!['create_time'] = new Date().getTime();
          this.order!['products'][id] = insert;
          this.orderService
            .put(this.order!)
            .catch(() => {
              delete this.order!['products'][id];
              this.createProduct(insert);
            })
        }
      })
  }

  onBack() {
    this.router.navigate(['..'], { relativeTo: this.route })
  }

  orderUpdate(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit'];
    }
    if (data['change']) {
      delete data['change'];
      this.orderService.put(this.order!);
    }
  }

  orderSelect(data: { [x: string]: any }, key: string, value: Event) {
    if (data['edit']) {
      delete data['edit']
    }
    data[key] = value
    this.orderService.put(this.order!);
  }

  clearFocus(data: { [x: string]: any }) {
    setTimeout(() => {
      if (data['edit']) {
        delete data['edit']
      }
    }, 200);
  }

  productSelect(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit']
    }
    data['unit_price'] = this.clientService.unit_price(this.order!['client'], data['technology'], data['texture'], data['color'], data['type'])
    this.orderService.calcProduct(data, true, false)
    this.orderService.calcOrder(this.order!, true, false)
    this.orderService.put(this.order!);
  }

  selectClear(product: product, keys: string[]) {
    for (const k of keys) {
      if (product.value[k]) delete product.value[k];
    }
  }

  productChange(product: product, update: boolean = true) {
    if (product.value['edit']) {
      delete product.value['edit'];
    }
    if (product.value['change']) {
      delete product.value['change'];
      if (product.value['length'] && product.value['width'] && product.value['unit_price']) {
        this.orderService.calcProduct(product.value, update);
      }
        this.orderService.calcOrder(this.order!, true);
      this.orderService.put(this.order!);
    }
  }

  productDelete(product: product) {
    if (this.order!['products'][product.key]) {
      delete this.order!['products'][product.key];
    }
    this.orderService.calcProduct(product.value, true);
    this.orderService.calcOrder(this.order!, true);
    this.orderService.put(this.order!);
  }
}
