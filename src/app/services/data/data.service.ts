import { min, Observable } from 'rxjs';
import { AirGratingDatabase } from './../../schemas/RxDB.d';
import { DbService } from './../db/db.service';
import { Injectable } from '@angular/core';

interface temp {
  name: string | null
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  info!: {
    workshop: string | null,
    role: string | null
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

  constructor(
    private dbService: DbService
  ) {
    this.refreshInfo();
    (window as any)['data'] = this;
  }

  get db() {
    return this.dbService
  }

  refreshInfo() {
    this.info = {
      workshop: sessionStorage.getItem('workshop'),
      role: sessionStorage.getItem('role')
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
