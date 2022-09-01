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
  private _initSubscription: Subscription;

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
    this._initSubscription = this.dbService.find(this.type)
      .subscribe({
        next: m => this.add(m),
        error: e => this.Stream.error(e),
      })
  }

  get isInit() {
    return this._initSubscription.closed;
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
      this.get(id).then(m => doc = m);
    }
  }

  async bulkChange(ids: string[], convert: (m: GetDoc) => Doc) {
    
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
