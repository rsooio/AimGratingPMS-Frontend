import { DataService } from '@/services/data/data.service';
import { GetDoc, DbService, Doc } from '@/services/db/db.service';
import { Injectable } from '@angular/core';
import { Subject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  type = 'schedule';
  Stream: Subject<GetDoc> = new Subject<GetDoc>();
  private _docs: { [x: string]: GetDoc } = {}

  constructor(
    private dbService: DbService,
    private dataService: DataService,
  ) {
    (window as any)['schedule'] = this;
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

  doc(id: string) {
    return this._docs[this.type + '/' + id]
  }

  docs() {
    return Object.values(this._docs);
  }
}
