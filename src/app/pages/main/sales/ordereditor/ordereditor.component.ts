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


@Component({
  selector: 'app-ordereditor',
  templateUrl: './ordereditor.component.html',
  styleUrls: ['./ordereditor.component.scss']
})
export class OrdereditorComponent implements OnInit {
  id: string = '';
  createProductSetButtonDisabled = false
  order?: GetDoc;
  productSets: { key: string, value: { [x: string]: any } }[] = [];
  date?: string;

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
    public utilsService: UtilsService,
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
      this.fetchData(this.orderService.doc(this.id))
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
    if (this.order == undefined) return;
    this.random.string(2)
      .then(id => {
        if (this.order!['product_set'][id]) {
          this.createProductSet();
        } else {
          this.order!['product_set'][id] = {
            create_time: new Date().getTime(),
            price: 0,
            area: 0,
            products: [],
          };
          this.orderService
            .put(this.order!)
            .catch(() => {
              delete this.order!['product_set'][id];
              this.createProductSet();
            })
        }
      })
  }

  onBack() {
    this.router.navigate(['..'], { relativeTo: this.route })
  }

  delete(id: string) {
    if (this.order == undefined) return;
    if (this.order['product_set'][id]) {
      delete this.order['product_set'][id]
      this.orderService.put(this.order)
    }
  }

  update(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit'];
    }
    if (data['change']) {
      delete data['change'];
      this.orderService.put(this.order!);
    }
  }

  select(data: { [x: string]: any }, key: string, value: Event) {
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
}
