import { UtilsService } from '@/services/utils/utils.service';
import { DataService } from './../data/data.service';
import { stafferCollection, StafferDocType } from './../../schemas/staffer';
import { enterpriseCollection, EnterpriseDocument } from './../../schemas/enterprise';
import { IS_SERVER_SIDE_RENDERING, SYNC_ENDPOINT } from './shared';
import { Injectable, isDevMode, OnInit } from '@angular/core';
import PouchDB from 'pouchdb-browser';
import PouchAuth from 'pouchdb-authentication'
import PouchFind from 'pouchdb-find'
import { of, Observable, Subscriber, Subject } from 'rxjs';
import { temporaryAllocator } from '@angular/compiler/src/render3/view/util';
import { chdir } from 'process';
PouchDB.plugin(PouchAuth)
PouchDB.plugin(PouchFind)


interface connect {
  Local: PouchDB.Database<{ [x: string]: any; }> | null;
  Remote: PouchDB.Database<{ [x: string]: any; }> | null;
  Socket: PouchDB.Replication.Sync<{ [x: string]: any; }> | null;
  Changes: PouchDB.Core.Changes<{ [x: string]: any }> | null;
  Pipe: Subject<{ [x: string]: any; } & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta>;
  name: string
}

interface connects {
  order: connect
  client: connect
  staffer: connect
  technology: connect
  production: connect
  enterprise: connect
}

export interface Doc {
  [x: string]: any
  id_: string
  type_?: string
  _deleted?: boolean
  _id?: string
  _rev?: string
}

export interface GetDoc extends PouchDB.Core.IdMeta, PouchDB.Core.GetMeta {
  [x: string]: any
  id_: string
  type_: string
  _deleted?: boolean
};

function nullConnection(name: string): connect {
  return {
    Local: null,
    Remote: null,
    Socket: null,
    Changes: null,
    Pipe: new Subject<{ [x: string]: any; } & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta>(),
    name: name
  }
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  enterprise: connect = nullConnection('enterprise');
  Local: PouchDB.Database<Doc> | null = null;
  Remote: PouchDB.Database<Doc> | null = null;
  Connection: PouchDB.Replication.Sync<Doc> | null = null;
  Changes: PouchDB.Core.Changes<Doc> | null = null;
  Stream: Subject<GetDoc> = new Subject<GetDoc>();

  constructor(
    private dataService: DataService,
    private utilsService: UtilsService,
  ) {
    this.enterprise.Local = new PouchDB<Doc>('enterprise');
    this.enterprise.Remote = new PouchDB<Doc>(SYNC_ENDPOINT + 'enterprise');
    this.enterprise.Socket = this.enterprise.Local.sync(this.enterprise.Remote, {
      live: true,
      retry: true,
    }).on('change', m => console.log('enterprise', m))
      .on('complete', () => console.log('complete'))
      .on('error', e => console.log(e));
    this.reload();
    (<any>window)['dbs'] = this;
  }

  private reload() {
    const info = this.dataService.info;
    if (info.workshop && info.role && info.enterpriseCode) {
      this.connect(info.enterpriseCode, info.workshop, info.role)
    }
  }

  private filterOptions(options: PouchDB.Replication.SyncOptions, workshop: string, role: string) {
    // if (role != 'boss') {
    //   options.filter = 'filter/workshop_filter'
    //   options.query_params = { workshop: workshop }
    // }
    return options
  }

  async connect(enterprise: string, workshop: string, role: string) {
    if (this.Connection) this.Connection.cancel()
    this.Local = new PouchDB<Doc>(enterprise);
    this.Remote = new PouchDB<Doc>(SYNC_ENDPOINT + enterprise);
    this.Connection = this.Local.sync(this.Remote, this.filterOptions({
      live: true,
      retry: true,
    }, workshop, role))
    this.Changes = this.Local.changes({ live: true, since: 'now' })
    console.log(enterprise, 'connected.')
    this.Changes
      ?.on('change', m => {
        console.log(enterprise, 'changed.')
        if (m.deleted) {
          this.Stream.next({
            _deleted: true,
            _id: m.id,
            _rev: m.changes[0].rev,
            type_: m.id.split('/')[0],
            id_: '',
          })
        } else {
          this.Local?.get(m.id)
            .then(m => {
              this.Stream.next(m as GetDoc);
            })
            .catch(e => this.Stream.error(e))
        }
      })
      .on('error', e => {
        this.Stream.error(e)
      })
      .on('complete', f => {
        console.log('unsubscribe')
        this.Stream.complete()
      })
  }

  async put(type: string, data: Doc, options?: PouchDB.Core.PutOptions) {
    if (!this.Local) throw new Error('database not establish');
    if (!this.dataService.info.workshop) throw new Error('login info loss');
    data['workshop_'] = this.dataService.info.workshop;
    data.type_ = type;
    if (!data._id) data._id = data.type_ + '/' + data.id_;
    return this.Local.put(data, options || {});
  }

  async get(type: string, docId: string, options?: PouchDB.Core.GetOptions) {
    if (!this.Local) throw new Error('database not establish');
    return this.Local.get(type + '/' + docId, options || {})
  }

  find(type: string, request?: PouchDB.Find.FindRequest<Doc>) {
    return new Observable<GetDoc>(o => {
      if (!this.Local) {
        o.error(new Error('database not establish'));
        o.complete();
      } else {
        if (!request) request = { selector: {} };
        request.selector['type_'] = type;
        if (this.dataService.info.role != 'boss') {
          request.selector['workshop'] = this.dataService.info.workshop;
        }
        this.Local.find(request)
          .then(m => {
            m.docs.forEach(v => {
              o.next(v as GetDoc);
            })
          })
          .finally(() => o.complete())
      }
    })
  }

  // async connect() {
  //   let workshop = localStorage.getItem('workshop')
  //   if (!workshop) throw ('not login')


  //   if (this.stafferLocal && this.stafferRemote) this.stafferSync = this.stafferLocal
  //     .sync(this.stafferRemote, {
  //       live: true,
  //       retry: true,
  //       filter: '_design/filter/workshop_filter',
  //       query_params: { workshop: workshop }
  //     })
  //     .on('change', m => console.log('staffer', m))
  //     .on('complete', () => console.log('complete'))
  //     .on('error', e => console.log(e));
  // }

  // login = (username: string, password: string) =>
  //   this.authBath<PouchDB.Authentication.LoginResponse>(o => {
  //     remoteDbs[0].logIn(username, password)
  //       .then(m => o.next(m))
  //       .catch(e => o.error(e))
  //   })

  // getSession = () =>
  //   this.authBath<PouchDB.Authentication.SessionResponse>(o => {
  //     remoteDbs[0].getSession()
  //       .then(m => o.next(m))
  //       .catch(e => o.error(e))
  //   })

  // putUser = (username: string, data: PouchDB.Authentication.PutUserOptions) =>
  //   this.authBath(o => {
  //     remoteDbs[0].putUser(username, data)
  //       .then(m => o.next(m))
  //       .catch(e => o.error(e))
  //   })

  // logout() {
  //   return new Observable<PouchDB.Core.BasicResponse>(o => {
  //     for (let i of remoteDbs) {
  //       i.logOut()
  //         .then(m => o.next(m))
  //         .catch(e => o.error(e))
  //     }
  //   })
  // }
}
