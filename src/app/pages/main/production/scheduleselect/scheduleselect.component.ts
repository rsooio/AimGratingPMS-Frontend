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
    private orderService: OrderService,
    private randomService: RandomService,
    public dataService: DataService,
    public utilsService: UtilsService,
    public clientService: ClientService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    (window as any).debug = this;
  }

  ngOnInit(): void {
    this.route.params.subscribe(m => (this.id = m['id']));
    setTimeout(() => {
      this.orderService.Stream.pipe(filter(m => m['state'] == 1 || m['staate'] == 2)).subscribe(m => {
        let index = this.orders.findIndex(n => n.value._id === m._id);
        if (m._deleted || m['state'] == 2) {
          if (index != -1) {
            this.orders.splice(index, 1);
          }
        } else {
          if (index != -1) {
            this.orders[index].value = m;
          } else {
            index = this.orders.findIndex(n => n.value['create_time'] < m['create_time']);
            if (index != -1) {
              this.orders.splice(index, 0, { checked: false, value: m });
            } else {
              this.orders.push({ checked: false, value: m });
            }
          }
        }
        this.orders = this.orders.slice();
      });
      this.orderService.docs
        .filter(m => m['state'] == 1)
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
    if (this.id == 'new') this.selectNew();
    else this.selectById();
  }

  selectNew() {
    const orders: string[] = this.checkedOrder.reduce((list, curr) => list.splice(-1, 0, curr.value.id_), [] as string[]);
    this.randomService.string(4).then(id => {
      this.scheduleService
        .get(id)
        .then(() => this.selectNew())
        .catch(() => {
          this.scheduleService.put({
            id_: id,
            orders: orders,
            create_time: new Date().getTime()
          }).then()
        });
    });
  }

  selectById() {}
}
