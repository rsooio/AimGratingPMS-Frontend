import { UtilsService } from '@/services/utils/utils.service';
import { DataService } from '@/services/data/data.service';
import { GetDoc } from '@/services/db/db.service';
import { ScheduleService } from './../../../../services/schedule/schedule.service';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '@/services/order/order.service';

interface data {
  checked: boolean
  value: GetDoc
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  schedules: data[] = [];
  loading: boolean = false;
  checked = false;
  indeterminate = false;

  constructor(
    public scheduleService: ScheduleService,
    public dataService: DataService,
    public utilsService: UtilsService,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.scheduleService.Stream
        .subscribe(m => {
          if (m._deleted) {
            this.schedules.splice(this.schedules.findIndex(v => v.value._id == m._id), 1);
          } else {
            const index = this.schedules.findIndex(order => order.value._id == m._id)
            if (index != -1) {
              this.schedules[index].value = m;
            } else {
              const index = this.schedules.findIndex(n => n.value['create_time'] < m['create_time']);
              if (index != -1) {
                this.schedules.splice(index, 0, {checked: false, value: m});
              } else {
                this.schedules.push({checked: false, value: m});
              }
            }
          }
          this.schedules = this.schedules.slice();
          this.refreshCheckedStatus();
        })
      this.scheduleService.docs
        .sort((a, b) => b['create_time'] - a['create_time'])
        .forEach(order => {
          this.schedules.push({
            checked: false,
            value: order,
          })
        });
      this.schedules = this.schedules.slice();
      this.loading = false;
    }, 0);
  }

  get schedulesWaiting() {
    return this.schedules.filter(m => m.value['state'] === 0);
  }

  get schedulesDoing() {
    return this.schedules.filter(m => m.value['state'] === 1);
  }

  get schedulesDone() {
    return this.schedules.filter(m => m.value['state'] === 1);
  }

  onAllChecked(check: boolean) {
    this.schedules.forEach(m => m.checked = check);
    this.refreshCheckedStatus();
  }

  onItemChecked(data: data, check: boolean) {
    data.checked = check;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.schedules.length != 0 && this.schedules.every(m => m.checked);
    this.indeterminate = !this.checked && this.schedules.some(m => m.checked);
  }

  delete(data: data) {
    if (data.value['state'] != 0) return;
    (data.value['orders'] as string[]).forEach(m => {
      const doc = this.orderService.doc(m);
      doc['state'] = 1;
      delete doc['schedule'];
      delete doc['schedule_time'];
      this.orderService.put(doc);
    })
    data.value._deleted = true
    this.scheduleService.put(data.value)
  }
}
