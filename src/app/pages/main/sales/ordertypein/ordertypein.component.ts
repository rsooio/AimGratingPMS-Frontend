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
  workshop: string | null;
  role: string | null;
  document = document

  constructor(
    private db: DbService,
    private order: OrderService,
    private random: RandomService,
    public dataService: DataService
  ) {
    this.workshop = sessionStorage.getItem('workshop')
    this.role = sessionStorage.getItem('role')
  }

  ngOnInit(): void {
  }

  get dataList() {
    return Object.values(this.order.data)
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
    return this.dataList.filter(v => v['state'] === 0)
  }

  get price() {
    return this.dataList.reduce((prev, curr) => curr['price'] ? prev + curr['price'] : prev, 0);
  }

  delete(id: string) {
    this.db.db.order.Local
      ?.put({
        _id: id,
        _rev: this.order.data[id]._rev,
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
                workshop: this.workshop,
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
