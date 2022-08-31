import { GetDoc } from '@/services/db/db.service';
import { OrderService } from '@/services/order/order.service';
import { ScheduleService } from '@/services/schedule/schedule.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';

interface data {
  checked: boolean
  value: GetDoc
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

  constructor(
    private Router: Router,
    private Route: ActivatedRoute,
    private scheduleService: ScheduleService,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    this.Route.params.subscribe(m => this.id = m['id'])
    setTimeout(() => {
      this.orderService.Stream
        .pipe(filter(m => m['state'] == 1 || m['staate'] == 2))
        .subscribe(m => {
          let index = this.orders.findIndex(n => n.value._id = m._id)
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
          this.orders = this.orders.slice()
        })
      this.orderService.docs
        .filter(m => m['state'] == 1)
        .sort((a, b) => b['create_time'] - a['create_time'])
        .forEach(m => this.orders.push({
          checked: false,
          value: m
        }))
      this.orders = this.orders.slice()
      this.loading = false;
    }, 0);
  }
}