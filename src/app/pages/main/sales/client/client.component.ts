import { UtilsService } from './../../../../services/utils/utils.service';
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
  loading = true;
  clients: PouchDB.Core.ExistingDocument<{ [x: string]: any; }>[] = [];

  constructor(
    private clientService: ClientService,
    public dataService: DataService,
    public pinyinService: PinyinService,
    private randomService: RandomService,
    private dbService: DbService,
    public utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
      this.clientService.pdata()
        .then(m => this.clients = Object.values(m)
          .sort((a, b) => b['create_time'] - a['create_time'])
        )
      this.dbService.db.client.Pipe.subscribe(m => {
        if (m['_deleted']) {
          this.clients.splice(this.clients.findIndex(v => v._id === m._id), 1);
        } else {
          const index = this.clients.findIndex(v => v._id === m._id);
          if (index != -1) {
            this.clients[index] = m;
          } else {
            this.clients.unshift(m)
          }
        }
        this.clients = this.clients.slice();
      })
    }, 0);
  }

  change(data: { [x: string]: any }) {
    if (data['edit']) {
      delete data['edit'];
    }
    if (data['change']) {
      delete data['change'];
      this.dbService.db.client.Local
        ?.put(data);
    }
  }

  createClient() {
    this.randomService.string(4)
      .then(id => {
        this.dbService.db.client.Local
          ?.get(id)
          .then(() => this.createClient())
          .catch(() => {
            this.dbService.db.client.Local
              ?.put({
                _id: id,
                workshop: this.dataService.info.workshop,
                create_time: new Date().getTime(),
                unit_price: {}
              })
            // .catch(() => this.createOrder())
          })
      })
  }

  delete(data: PouchDB.Core.ExistingDocument<{ [x: string]: any; }>) {
    this.dbService.db.client.Local
      ?.put({
        _id: data._id,
        _rev: data._rev,
        _deleted: true
      })
  }
}
