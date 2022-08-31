import { ClientService } from '@/services/client/client.service';
import { UtilsService } from '@/services/utils/utils.service';
import { OrderService } from './../../../../services/order/order.service';
import { DataService } from './../../../../services/data/data.service';
import { Component, OnInit } from '@angular/core';
import { DbService, Doc } from '@/services/db/db.service';
import { RandomService } from '@/services/random/random.service';
import { threadId } from 'worker_threads';

interface data {
  checked: boolean
  value: Doc
}

@Component({
  selector: 'app-allorder',
  templateUrl: './allorder.component.html',
  styleUrls: ['./allorder.component.scss']
})
export class AllorderComponent implements OnInit {
  orders: data[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private randomService: RandomService,
    public utilsService: UtilsService,
    public dataService: DataService,
    public clientService: ClientService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.orderService.Stream
        .subscribe(m => {
          if (m._deleted) {
            this.orders.splice(this.orders.findIndex(v => v.value._id == m._id), 1);
          } else {
            const index = this.orders.findIndex(order => order.value._id == m._id)
            if (index != -1) {
              this.orders[index].value = m;
            } else {
              this.orders.unshift({ checked: false, value: m });
            }
          }
          this.orders = this.orders.slice();
          // this.refreshCheckedStatus();
        })
      this.orderService.docs
        .sort((a, b) => b['create_time'] - a['create_time'])
        .forEach(order => {
          this.orders.push({
            checked: false,
            value: order,
          })
        });
      this.orders = this.orders.slice();
      this.loading = false;
    }, 0);
  }
}
