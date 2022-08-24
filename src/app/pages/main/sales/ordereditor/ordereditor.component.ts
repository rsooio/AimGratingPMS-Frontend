import { ClientService } from './../../../../services/client/client.service';
import { PinyinService } from './../../../../services/pinyin/pinyin.service';
import { RandomService } from './../../../../services/random/random.service';
import { DbService } from './../../../../services/db/db.service';
import { DataService } from '@/services/data/data.service';
import { OrderService } from '@/services/order/order.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'app-ordereditor',
  templateUrl: './ordereditor.component.html',
  styleUrls: ['./ordereditor.component.scss']
})
export class OrdereditorComponent implements OnInit {
  id: string = '';
  createProductSetButtonDisabled = false
  loading = true;
  order: { [x: string]: any; } = {};
  productSets: { key: string, value: { [x: string]: any; } }[] = [];

  get clients() {
    return Object.values(this.clientService.data)
      .filter(v => v['name'])
  }

  constructor(
    private db: DbService,
    public dataService: DataService,
    private orderService: OrderService,
    private random: RandomService,
    private route: ActivatedRoute,
    private router: Router,
    public pinyin: PinyinService,
    public clientService: ClientService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: m => {
        this.id = m['id']
      }
    })
    setTimeout(() => {
      this.loading = false;
      this.orderService.pdata()
        .then(m => this.fetchData(m[this.id]))
      this.db.db.order.Pipe
        ?.pipe(filter(m => m._id == this.id))
        .subscribe(m => this.fetchData(m))
    }, 0);
  }

  fetchData(order: { [x: string]: any }) {
    if (!order) return;
    this.order = order
    const productSets = order['product_set'];
    if (!productSets) return;
    this.productSets = [];
    Object.keys(productSets)
      .forEach(k => {
        this.productSets.unshift({
          key: k,
          value: productSets[k],
        })
      })
  }

  createProductSet() {
    this.random.string(2)
      .then(id => {
        if (this.order['product_set'][id]) {
          this.createProductSet();
        } else {
          this.order['product_set'][id] = {
            create_time: new Date().getTime(),
            price: 0,
            area: 0,
            products: [],
          };
          this.db.db.order.Local
            ?.put(this.order)
            .catch(() => {
              delete this.order['product_set'][id];
              this.createProductSet();
            })
        }
      })
  }

  onBack() {
    this.router.navigate(['..'], { relativeTo: this.route })
  }

  delete(id: string) {
    if (this.order['product_set'][id]) {
      delete this.order['product_set'][id]
      this.db.db.order.Local
        ?.put(this.order)
    }
  }

  update(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit'];
    }
    if (data['change']) {
      delete data['change'];
      this.db.db.order.Local
        ?.put(this.order);
    }
  }

  select(data: { [x: string]: any }, value: Event) {
    if (data['edit']) {
      delete data['edit']
    }
    data['client'] = value
    this.db.db.order.Local
      ?.put(this.order);
  }

  clearFocus(data: { [x: string]: any }) {
    setTimeout(() => {
      if (data['edit']) {
        delete data['edit']
      }
    }, 200);
  }
}
