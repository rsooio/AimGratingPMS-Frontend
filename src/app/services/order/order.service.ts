import { GetDoc } from '@/services/db/db.service';
import { DataService } from '@/services/data/data.service';
import { Observable, filter, Subject, Observer, Subscription } from 'rxjs';
import { DbService, Doc } from './../db/db.service';
import { Injectable } from '@angular/core';
import { MathService } from '@/services/math/math.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  type = 'order';
  Stream: Subject<GetDoc> = new Subject<GetDoc>();
  private _docs: { [x: string]: GetDoc } = {}

  STATE: { [key: number]: string } = {
    99: '已取消',
    0: '录入中',
    1: '待排期',
    2: '待生产',
    3: '生产中',
    4: '已生产',
    5: '已入库',
    6: '已出库',
    7: '已结清',
  }

  constructor(
    private dbService: DbService,
    private dataService: DataService,
  ) {
    (window as any)['order'] = this;
    this.dbService.Stream
      .pipe(filter(m => m.type_ === this.type))
      .subscribe({
        next: m => this.add(m),
        error: e => this.Stream.error(e),
        complete: () => {
          this.Stream.complete()
        }
      })
    this.dbService.find(this.type)
      .subscribe({
        next: m => this.add(m),
        error: e => this.Stream.error(e),
      })
  }

  async add(data: GetDoc) {
    this.Stream.next(data);
    if (data['_deleted']) {
      delete this._docs[data._id!]
    } else {
      this._docs[data._id] = data
    }
  }

  async put(data: Doc, options?: PouchDB.Core.PutOptions) {
    return this.dbService.put(this.type, data, options);
  }

  async get(docId: string, options?: PouchDB.Core.GetOptions) {
    return this.dbService.get(this.type, docId, options);
  }

  async change(id: string, convert: (m: GetDoc) => void) {
    let doc = this.doc(id)
    if (!doc) {
      this.dbService.change(this.type, id, convert);
    }
    convert(doc);
    this.put(doc)
      .catch(() => this.dbService.change(this.type, id, convert));
  }

  async bulkChange(ids: string[], convert: (m: GetDoc) => void) {
    ids.forEach(id => this.change(id, convert));
  }

  doc(id: string) {
    return this._docs[this.type + '/' + id]
  }

  get docs() {
    return Object.values(this._docs);
  }

  calcProduct(data: { [x: string]: any }, price?: boolean, area = true) {
    if (area || price) {
      const quentity = data['quentity'] ? data['quentity'] : 1
      if (area) {
        const singlePrice = (data['length'] + 5) * (data['width'] + 5)/ 10000;
        data['area'] = (singlePrice < 0.1 ? 0.1 : MathService.round(singlePrice, 2)) * quentity;
      }
      if (price) {
        data['price'] = MathService.round(data['area'] * data['unit_price'], 2);
      }
    }
  }

  calcOrder(data: { [x: string]: any }, price?: boolean, area = true) {
    if (area) {
      data['area'] = MathService.round(Object.values<{ [x: string]: any }>(data['products'])
        .reduce((prev, curr) => curr['area'] ? prev + curr['area'] : prev, 0), 2);
    }
    if (price) {
      data['price'] = MathService.round(Object.values<{ [x: string]: any }>(data['products'])
        .reduce((prev, curr) => curr['price'] ? prev + curr['price'] : prev, 0), 2);
    }
  }

  ordersPrice(orders: string[]) {
    return orders.reduce((price, id) => {
      const doc = this.doc(id);
      if (!doc || !doc['price']) return price;
      return price + doc['price'];
    }, 0)
  }

  ordersArea(orders: string[]) {
    return orders.reduce((area, id) => {
      const doc = this.doc(id);
      if (!doc || !doc['area']) return area;
      return area + doc['area'];
    }, 0)
  }
}
