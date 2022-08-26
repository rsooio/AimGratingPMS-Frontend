import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '@/services/client/client.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UtilsService } from './../../../../services/utils/utils.service';
import { DataService } from '@/services/data/data.service';
import { DbService, Doc, GetDoc } from '@/services/db/db.service';
import { OrderService } from '@/services/order/order.service';
import { RandomService } from '@/services/random/random.service';
import { Component, OnInit } from '@angular/core';
import { ceil } from '@delon/util';
import { filter, timer } from 'rxjs';

type data = { value: GetDoc, checked: boolean };

@Component({
  selector: 'app-ordertypein',
  templateUrl: './ordertypein.component.html',
  styleUrls: ['./ordertypein.component.scss']
})
export class OrdertypeinComponent implements OnInit {
  document = document
  loading: boolean = true;
  orders: data[] = [];
  checked: boolean = false;
  indeterminate: boolean = false;

  refreshCheckedStatus(): void {
    this.checked = this.orders.length != 0 && this.orders.every(order => order.checked);
    this.indeterminate = !this.checked && this.orders.some(order => order.checked);
  }

  onItemChecked(data: data, check: boolean) {
    data.checked = check;
    this.refreshCheckedStatus();
  }

  onAllChecked(check: boolean) {
    this.orders.forEach(order => order.checked = check);
    this.refreshCheckedStatus();
  }

  edit(data: data) {
    // this.router.navigate([data.value.id], { relativeTo: this.route })
  }

  constructor(
    private db: DbService,
    private orderService: OrderService,
    private random: RandomService,
    public dataService: DataService,
    public utilsService: UtilsService,
    private modal: NzModalService,
    public clientService: ClientService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    (window as any).debug = this;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.orderService.Stream
        .pipe(filter(m => m._deleted || this.filter(m)))
        .subscribe(m => {
          if (m._deleted) {
            this.orders.splice(this.orders.findIndex(v => v.value._id == m._id), 1);
          } else {
            const index = this.orders.findIndex(order => order.value._id == m._id)
            if (index != -1) {
              this.orders[index].value = m;
            } else {
              this.orders.unshift({ checked: false, value: m });
              this.orders = this.orders.sort((a, b) => b.value['create_time'] - a.value['create_time']);
            }
          }
          this.orders = this.orders.slice();
          this.refreshCheckedStatus();
        })
      this.orderService.docs()
        .filter(this.filter)
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
    timer(new Date(new Date(new Date().toLocaleDateString()).getTime() + 104400000), 86400000)
      .subscribe(() => this.orders = this.orders.filter(m => this.filter(m.value)))
  }

  filter(v: GetDoc) {
    if (v['state'] === 0) {
      return true;
    }
    if (v['state'] === 1 && v['typein_time']) {
      const dateStamp = new Date(new Date().toLocaleDateString()).getTime() + 18000000;
      return v['typein_time'] >= dateStamp;
    }
    if (v['state'] === 2) {
      const index = this.orders.findIndex(m => m.value._id === v._id);
      if (index != -1) {
        this.orders.splice(index, 1);
      }
    }
    return false;
  }

  get editList() {
    return this.orders.filter(v => v.value['state'] === 0)
  }

  get price() {
    return this.orders.reduce((prev, curr) => curr.value['price'] ? prev + curr.value['price'] : prev, 0);
  }

  delete(data: data) {
    data.value._deleted = true
    this.orderService.put(data.value)
  }

  bulkDelete() {
    const checkedOrders = this.orders.filter(order => order.checked);
    const content = this.checked ? '全部的' : '这 ' + checkedOrders.length + ' 个'
    this.modal.confirm({
      nzTitle: '删除订单',
      nzContent: `<b style="color: red;">确定要删除${content}订单吗？</b>`,
      nzOkText: '确认',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => checkedOrders.forEach(order => this.delete(order)),
      nzCancelText: '取消',
    });
  }

  typein(data: data) {
    data.value['state'] = 1;
    data.value['typein_time'] = new Date().getTime();
    this.orderService.put(data.value)
  }

  typeout(data: data) {
    data.value['state'] = 0;
    if (data.value['typein_time']) {
      delete data.value['typein_time'];
    }
    this.orderService.put(data.value)
  }

  bulkTypein() {
    const checkedOrders = this.orders.filter(order => order.checked);
    const content = this.checked ? '全部的' : '这 ' + checkedOrders.length + ' 个'
    this.modal.confirm({
      nzTitle: '录入订单',
      nzContent: `<b style="color: red;">确定要录入${content}订单吗？</b>`,
      nzOkText: '确认',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => checkedOrders.forEach(order => this.typein(order)),
      nzCancelText: '取消',
    });
    checkedOrders.forEach(order => order.checked = false);
  }

  createOrder() {
    this.random.string(5)
      .then(id => {
        this.orderService
          .get(id)
          .then(() => this.createOrder())
          .catch(() => {
            this.orderService
              .put({
                id_: id,
                create_time: new Date().getTime(),
                state: 0,
                product_set: {}
              })
            // .catch(() => this.createOrder())
          })
      })
  }
}
