import { UtilsService } from './../../../../services/utils/utils.service';
import { DataService } from '@/services/data/data.service';
import { DbService } from '@/services/db/db.service';
import { OrderService } from '@/services/order/order.service';
import { RandomService } from '@/services/random/random.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ordertypein',
  templateUrl: './ordertypein.component.html',
  styleUrls: ['./ordertypein.component.scss']
})
export class OrdertypeinComponent implements OnInit {
  document = document
  loading: boolean = true;
  orders: { [x: string]: any }[] = [];

  constructor(
    private db: DbService,
    private orderService: OrderService,
    private random: RandomService,
    public dataService: DataService,
    public utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
      this.orderService.pdata()
        .then(m => this.orders = Object.values(m)
          .filter(this.filter)
          .sort((a, b) => b['create_time'] - a['create_time'])
        )
      this.db.db.order.Pipe.subscribe(m => {
        if (m['_deleted']) {
          this.orders.splice(this.orders.findIndex(v => v['_id'] === m['_id']), 1);
        } else {
          this.orders.unshift(m);
        }
        this.orders = this.orders.slice();
      })
    }, 0);
  }

  filter(v: { [x: string]: any }) {
    if (v['state'] === 0) {
      return true;
    }
    if (v['state'] === 1 && v['typein_time']) {
      const dateStamp = new Date(new Date().toLocaleDateString()).getTime() + 18000000;
      return v['typein_time'] > dateStamp;
    }
    return false;
  }

  get _dataList() {
    return Object.values(this.orderService.data)
      .filter(v => {
        if (v['state'] === 0) {
          return true;
        }
        if (v['state'] === 1 && v['typein_time']) {
          const dateStamp = new Date(new Date().toLocaleDateString()).getTime() + 18000000;
          return v['typein_time'] > dateStamp;
        }
        return false;
      })
      .sort((a, b) => b['create_time'] - a['create_time'])
  }

  get editList() {
    return this.orders.filter(v => v['state'] === 0)
  }

  get price() {
    return this.orders.reduce((prev, curr) => curr['price'] ? prev + curr['price'] : prev, 0);
  }

  delete(id: string) {
    this.db.db.order.Local
      ?.put({
        _id: id,
        _rev: this.orderService.data[id]._rev,
        _deleted: true
      })
  }

  createOrder() {
    this.random.string(5)
      .then(id => {
        this.db.db.order.Local
          ?.get(id)
          .then(() => this.createOrder())
          .catch(() => {
            this.db.db.order.Local
              ?.put({
                _id: id,
                workshop: this.dataService.info.workshop,
                create_time: new Date().getTime(),
                area: 0,
                price: 0,
                state: 0,
                product_set: {}
              })
            // .catch(() => this.createOrder())
          })
      })
  }
}
