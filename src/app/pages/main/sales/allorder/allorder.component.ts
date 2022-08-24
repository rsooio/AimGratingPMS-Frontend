import { OrderService } from './../../../../services/order/order.service';
import { DataService } from './../../../../services/data/data.service';
import { Component, OnInit } from '@angular/core';
import { DbService } from '@/services/db/db.service';
import { RandomService } from '@/services/random/random.service';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-allorder',
  templateUrl: './allorder.component.html',
  styleUrls: ['./allorder.component.scss']
})
export class AllorderComponent implements OnInit {
  workshop: string | null;
  role: string | null;


  constructor(
    private db: DbService,
    private order: OrderService,
    private random: RandomService
  ) {
    this.workshop = sessionStorage.getItem('workshop')
    this.role = sessionStorage.getItem('role')
  }

  ngOnInit(): void {
  }

  get dataList() {
    return Object.values(this.order.data)
      .sort((a, b) => b['create_time'] - a['create_time'])
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
                state: '录入中',
                product_set: {}
              })
            // .catch(() => this.createOrder())
          })
      })
  }
}
