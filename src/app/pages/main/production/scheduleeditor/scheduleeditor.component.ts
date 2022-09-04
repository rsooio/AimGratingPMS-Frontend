import { ClientService } from '@/services/client/client.service';
import { DataService } from '@/services/data/data.service';
import { GetDoc } from '@/services/db/db.service';
import { OrderService } from '@/services/order/order.service';
import { ScheduleService } from '@/services/schedule/schedule.service';
import { UtilsService } from '@/services/utils/utils.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, first } from 'rxjs';

interface data {
  checked: boolean
  value: GetDoc
}

@Component({
  selector: 'app-scheduleeditor',
  templateUrl: './scheduleeditor.component.html',
  styleUrls: ['./scheduleeditor.component.scss']
})
export class ScheduleeditorComponent implements OnInit {
  id?: string;
  schedule?: GetDoc;
  orders: data[] = [];
  loading = true;
  checked: boolean = false;
  indeterminate: boolean = false;
  keys: Set<string> = new Set<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scheduleService: ScheduleService,
    public orderService: OrderService,
    public dataService: DataService,
    public utilsService: UtilsService,
    public clientService: ClientService,
  ) {
    (window as any).debug = this
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.route.params.subscribe(m => this.id = m['id'])
      this.orderService.Stream
        .pipe(filter(m => this.keys.has(m.id_)))
        .subscribe(m => this.insertOrder(m));
      this.scheduleService.Stream
        .pipe(filter(m => m.id_ === this.id))
        .subscribe(m => {
          this.schedule = m;
          this.fetchData(m);
        });
      this.fetchData(this.scheduleService.doc(this.id!));
    }, 0);
  }

  fetchData(data: GetDoc) {
    console.log(data)
    if (!data) return;
    const keys: string[] = data['orders'];
    console.log(keys)
    if (keys.length === 0) {
      this.loading = false;
      return;
    }
    const keySet: Set<string> = new Set<string>(data['orders']);
    this.orders
      .map(m => m.value.id_)
      .filter(k => !keySet.has(k))
      .forEach(k => this.orders.splice(this.orders.findIndex(m => m.value.id_ === k), 1));
    keys
      .filter(k => !this.keys.has(k))
      .forEach(k => this.insertOrder(this.orderService.doc(k)));
    this.keys = keySet;
    this.orders = this.orders.slice();
    this.refreshCheckedStatus();
  }

  insertOrder(order: GetDoc) {
    if (!order) return;
    const index = this.orders.findIndex(m => m.value.id_ === order.id_)
    if (index != -1) {
      this.orders[index].value = order;
    } else {
      const index = this.orders.findIndex(m => {
        const v = m.value;
        return v['schedule_time'] < order['schedule_time'] && v['create_time'] < order['schedule_time'];
      })
      if (index != -1) {
        this.orders.splice(index, 0, { checked: false, value: order });
      } else {
        this.orders.push({ checked: false, value: order });
      }
    }
    this.orders = this.orders.slice();
    this.refreshCheckedStatus();
    this.loading = false;
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
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

  delete(data: data) {
    data.value['state'] = 1;
    delete data.value['schedule'];
    delete data.value['schedule_time'];
    this.orderService.put(data.value);
  }

  bulkDelete() {
    if (!this.checked && !this.indeterminate) return;
    this.orders.filter(m => m.checked).forEach(data => {
      data.value['state'] = 1;
      delete data.value['schedule'];
      delete data.value['schedule_time'];
      this.orderService.put(data.value);
      let orders: string[] = this.schedule!['orders']; 
      const index = orders.findIndex(m => m == data.value.id_);
      if (index != -1) orders.splice(index, 1);
    })
    this.scheduleService.put(this.schedule!);
  }
}
