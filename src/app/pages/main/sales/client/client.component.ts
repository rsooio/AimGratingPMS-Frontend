import { ClientService } from './../../../../services/client/client.service';
import { DataService } from '@/services/data/data.service';
import { DbService } from '@/services/db/db.service';
import { PinyinService } from '@/services/pinyin/pinyin.service';
import { RandomService } from '@/services/random/random.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  createClientButtonDisabled = false

  constructor(
    private client: ClientService,
    public data: DataService,
    public pinyin: PinyinService,
    private random: RandomService,
    private db: DbService,
  ) { }

  get dataList() {
    return Object.keys(this.client.data)
      .sort((a, b) => this.dataItem(b)['create_time'] - this.dataItem(a)['create_time'])
  }

  dataItem(key: string) {
    return this.client.data[key]
  }

  ngOnInit(): void {
  }

  change(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit'];
    }
    if (data['change']) {
      delete data['change'];
      this.db.db.client.Local
        ?.put(data);
    }
  }

  createClient() {
    this.random.string(4)
      .then(id => {
        this.db.db.client.Local
          ?.get(id)
          .then(() => this.createClient())
          .catch(() => {
            this.db.db.client.Local
              ?.put({
                _id: id,
                workshop: this.data.info.workshop,
                create_time: new Date().getTime(),
                unit_price: {}
              })
            // .catch(() => this.createOrder())
          })
      })
  }

  delete(key: string) {
    this.db.db.client.Local
      ?.put({
        _id: key,
        _rev: this.dataItem(key)._rev,
        _deleted: true
      })
  }
}
