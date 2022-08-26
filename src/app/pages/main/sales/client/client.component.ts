import { UtilsService } from './../../../../services/utils/utils.service';
import { ClientService } from './../../../../services/client/client.service';
import { DataService } from '@/services/data/data.service';
import { DbService, Doc } from '@/services/db/db.service';
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
  clients: Doc[] = [];

  constructor(
    private clientService: ClientService,
    public dataService: DataService,
    public pinyinService: PinyinService,
    private randomService: RandomService,
    public utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.clientService.Stream.subscribe(m => {
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
      this.clients = this.clientService.data()
        .sort((a, b) => b['create_time'] - a['create_time'])
      this.loading = false;
    }, 0);
  }

  change(data: Doc) {
    if (data['edit']) {
      delete data['edit'];
    }
    if (data['change']) {
      delete data['change'];
      this.clientService.put(data);
    }
  }

  createClient() {
    this.randomService.string(4)
      .then(id => {
        this.clientService
          .get(id)
          .then(() => this.createClient())
          .catch(() => {
            this.clientService
              .put({
                id_: id,
                create_time: new Date().getTime(),
                unit_price: {}
              })
            // .catch(() => this.createOrder())
          })
      })
  }

  delete(data: Doc) {
    this.clientService
      .put({
        id_: data.id_,
        _id: data._id,
        _rev: data['_rev'],
        _deleted: true
      })
  }
}
