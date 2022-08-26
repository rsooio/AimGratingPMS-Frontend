import { min, Observable } from 'rxjs';
import { AirGratingDatabase } from './../../schemas/RxDB.d';
import { DbService } from './../db/db.service';
import { Injectable } from '@angular/core';
import { NzSelectOptionInterface } from 'ng-zorro-antd/select';

interface temp {
  name: string | null
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  info!: {
    workshop: string | null,
    role: string | null,
    enterpriseCode: string | null,
    enterprise: string | null,
  };

  ORDER_STATE: { [key: number]: string } = {
    99: '已取消',
    0: '录入中',
    1: '待排期',
    2: '生产中',
    3: '已生产',
    4: '已入库',
    5: '已出库',
    6: '已结清',
  }

  AIR_GRATING_TYPE: string[] = [
    '出风口',
    '回风口',
    '检修口'
  ]

  AirGratingOptions: NzSelectOptionInterface[] = [];

  constructor(
  ) {
    this.refreshInfo();
    (window as any)['data'] = this;
    this.AIR_GRATING_TYPE.forEach(v => this.AirGratingOptions.push({
      label: v,
      value: v,
    }))
  }

  refreshInfo() {
    this.info = {
      workshop: sessionStorage.getItem('workshop'),
      role: sessionStorage.getItem('role'),
      enterpriseCode: sessionStorage.getItem('enterpriseCode'),
      enterprise: sessionStorage.getItem('enterprise'),
    };
  }

  getPageSize(minus: number, lineHeight: number) {
    return Math.floor((document.body.offsetHeight - minus) / lineHeight);
  }

  toLower(str: string) {
    let strList: string[] = []
    for (let i of str) {
      if ('A' <= i || i <= 'Z') {
        strList.push('+')
        i = i.toLowerCase()
      }
      strList.push(i)
    }
    return strList.join('')
  }

  toUpper(str: string) {
    let strList: string[] = []
    let upper = false
    for (let i of str) {
      if (i == '+') {
        upper = true
      } else {
        strList.push(i.toUpperCase())
        upper = false
      }
    }
    return strList.join('')
  }
}
