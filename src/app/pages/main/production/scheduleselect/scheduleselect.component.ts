import { ClientService } from './../../../../services/client/client.service';
import { UtilsService } from './../../../../services/utils/utils.service';
import { DataService } from './../../../../services/data/data.service';
import { GetDoc } from '@/services/db/db.service';
import { OrderService } from '@/services/order/order.service';
import { ScheduleService } from '@/services/schedule/schedule.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import { RandomService } from '@/services/random/random.service';

interface data {
  checked: boolean;
  value: GetDoc;
}

@Component({
  selector: 'app-scheduleselect',
  templateUrl: './scheduleselect.component.html',
  styleUrls: ['./scheduleselect.component.scss']
})
export class ScheduleselectComponent implements OnInit {
  id?: string;
  orders: data[] = [];
  loading: boolean = true;
  checked: boolean = false;
  indeterminate: boolean = false;

  constructor(
    private scheduleService: ScheduleService,
    public orderService: OrderService,
    private randomService: RandomService,
    public dataService: DataService,
    public utilsService: UtilsService,
    public clientService: ClientService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(m => {
      console.log('id change')
      this.id = m['id'];
    });
    setTimeout(() => {
      this.orderService.Stream
        .pipe(filter(m => m['state'] == 1 || m['state'] == 2))
        .subscribe(m => {
          const index = this.orders.findIndex(n => n.value._id === m._id);
          if (m._deleted || m['state'] == 2) {
            if (index != -1) {
              this.orders.splice(index, 1);
            }
          } else {
            if (index != -1) {
              this.orders[index].value = m;
            } else {
              const index = this.orders.findIndex(n => n.value['create_time'] < m['create_time']);
              if (index != -1) {
                this.orders.splice(index, 0, { checked: false, value: m });
              } else {
                this.orders.push({ checked: false, value: m });
              }
            }
          }
          this.orders = this.orders.slice();
          this.refreshCheckedStatus();
        });
      this.orderService.docs
        .filter(m => m['state'] == 1 && !m['schedule'])
        .sort((a, b) => b['create_time'] - a['create_time'])
        .forEach(m =>
          this.orders.push({
            checked: false,
            value: m
          })
        );
      this.orders = this.orders.slice();
      this.loading = false;
    }, 0);
  }

  get checkedOrder() {
    return this.orders.filter(m => m.checked);
  }

  get checkedArea() {
    return this.checkedOrder.reduce((area, curr) => area + (curr.value['width'] || 0) * (curr.value['length'] || 0), 0);
  }

  refreshCheckedStatus(): void {
    this.checked = this.orders.length != 0 && this.orders.every(order => order.checked);
    this.indeterminate = !this.checked && this.orders.some(order => order.checked);
  }

  onItemChecked(data: data, check: boolean) {
    data.checked = check;
    this.refreshCheckedStatus();
  }

  onAllChecked(check: boolean) {
    this.orders.forEach(order => (order.checked = check));
    this.refreshCheckedStatus();
  }

  select() {
    let orders: string[] = [];
    this.checkedOrder.forEach(m => orders.push(m.value.id_));
    if (this.id == 'new') this.selectNew(orders);
    else this.selectById(orders);
  }

  selectNew(orders: string[]) {
    this.randomService.string(4).then(id => {
      this.scheduleService
        .get(id)
        .then(() => this.selectNew(orders))
        .catch(() => {
          this.scheduleService
            .put({
              id_: id,
              state: 0,
              orders: orders,
              price: this.orderService.ordersPrice(orders),
              area: this.orderService.ordersArea(orders),
              create_time: new Date().getTime()
            })
            .then(() => this.done(orders, id));
        });
    });
  }

  selectById(orders: string[]) {
    let doc = this.scheduleService.doc(this.id!);
    if (!doc) return;
    (doc['orders'] as string[]).push(...orders);
    doc['area'] = this.orderService.ordersArea(orders);
    doc['price'] = this.orderService.ordersPrice(orders);
    console.log(doc)
    this.scheduleService.put(doc).then(() => this.done(orders, this.id!));
  }

  async done(orders: string[], id: string) {
    this.orderService.bulkChange(orders, m => {
      m['schedule'] = id;
      m['state'] = 2;
      m['schedule_time'] = new Date().getTime();
    });
    this.router.navigate(['../../' + id], {relativeTo: this.route});
  }
}
