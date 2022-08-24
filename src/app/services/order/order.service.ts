import { Observable } from 'rxjs';
import { DbService } from './../db/db.service';
import { Injectable } from '@angular/core';
import { MathService } from '@/services/math/math.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  init: Promise<void>;

  constructor(
    private db: DbService,
  ) {
    (window as any)['order'] = this;
    this.db.db.order.Pipe
      ?.subscribe({
        next: m => {
          if (m['_deleted']) {
            delete this._orders[m._id]
          } else {
            this._orders[m._id] = m
          }
        }
      })
    this.init = this.db.db.order.Local!.find({
      selector: {
        workshop: 'a'
      }
    }).then(m => {
      for (const i of m.docs) {
        if (i['_deleted']) {
          console.log('deleted true')
        } else {
          this._orders[i._id] = i
        }
      }
    })
  }

  private _orders: { [x: string]: PouchDB.Core.ExistingDocument<{ [x: string]: any; }> } = {}

  get data() {
    return this._orders
  }

  async pdata() {
    await this.init;
    return this._orders;
  }

  calcProduct(data: { [x: string]: any }, price?: boolean, area = true) {
    if (area || price) {
      const quentity = data['quentity'] ? data['quentity'] : 1
      if (area) {
        data['area'] = MathService.round((data['length'] + 5) * (data['width'] + 5) * quentity / 10000, 2);
      }
      if (price) {
        data['price'] = MathService.round(data['area'] * data['unit_price'], 2);
      }
    }
  }

  calcProductSet(data: { [x: string]: any }, price?: boolean, area = true) {
    if (area) {
      data['area'] = MathService.round(data['products']
        .reduce((prev: number, curr: { [x: string]: any; }) =>
          curr['area'] ? prev + curr['area'] : prev, 0), 2);
    }
    if (price) {
      data['price'] = MathService.round(data['products']
        .reduce((prev: number, curr: { [x: string]: any; }) =>
          curr['price'] ? prev + curr['price'] : prev, 0), 2);
    }
  }

  calcOrder(data: { [x: string]: any }, price?: boolean, area = true) {
    if (area) {
      data['area'] = MathService.round(Object.values<{ [x: string]: any }>(data['product_set'])
        .reduce((prev, curr) => curr['area'] ? prev + curr['area'] : prev, 0), 2);
    }
    if (price) {
      data['price'] = MathService.round(Object.values<{ [x: string]: any }>(data['product_set'])
        .reduce((prev, curr) => curr['price'] ? prev + curr['price'] : prev, 0), 2);
    }
  }
}
