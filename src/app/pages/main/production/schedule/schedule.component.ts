import { UtilsService } from '@/services/utils/utils.service';
import { DataService } from '@/services/data/data.service';
import { GetDoc } from '@/services/db/db.service';
import { ScheduleService } from './../../../../services/schedule/schedule.service';
import { Component, OnInit } from '@angular/core';

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
    private scheduleService: ScheduleService,
    public dataService: DataService,
    public utilsService: UtilsService,
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
              this.schedules.unshift({ checked: false, value: m });
            }
          }
          this.schedules = this.schedules.slice();
          // this.refreshCheckedStatus();
        })
      this.scheduleService.docs()
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
}
