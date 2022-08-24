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
  db: connects = {
    order: nullConnection('order'),
    client: nullConnection('client'),
    staffer: nullConnection('staffer'),
    technology: nullConnection('technology'),
    production: nullConnection('production'),
    enterprise: nullConnection('enterprise')
  }

  constructor() {
    this.db.enterprise.Local = new PouchDB<{ [key in string]: any }>('enterprise');
    this.db.enterprise.Remote = new PouchDB<{ [key in string]: any }>(SYNC_ENDPOINT + 'enterprise');
    this.db.enterprise.Socket = this.db.enterprise.Local.sync(this.db.enterprise.Remote, {
      live: true,
      retry: true,
    }).on('change', m => console.log('enterprise', m))
      .on('complete', () => console.log('complete'))
      .on('error', e => console.log(e));
    this.reload();
    (<any>window)['dbs'] = this;
  }

  private reload() {
    let enterprise = sessionStorage.getItem('enterprise');
    let workshop = sessionStorage.getItem('workshop')
    let role = sessionStorage.getItem('role')
    if (workshop && role && enterprise) {
      this.connect(enterprise, workshop, role)
    }
  }

  private filterOptions(options: PouchDB.Replication.SyncOptions, workshop: string, role: string) {
    // if (role != 'boss') {
    //   options.filter = 'filter/workshop_filter'
    //   options.query_params = { workshop: workshop }
    // }
    return options
  }

  private _connect(connect: connect, enterprise: string, workshop: string, role: string) {
    if (connect.Socket) connect.Socket.cancel()
    connect.Local = new PouchDB<{ [key in string]: any }>(enterprise + '-' + connect.name);
    connect.Remote = new PouchDB<{ [key in string]: any }>(SYNC_ENDPOINT + enterprise + '-' + connect.name);
    connect.Socket = connect.Local.sync(connect.Remote, this.filterOptions({
      live: true,
      retry: true,
    }, workshop, role))
    connect.Changes = connect.Local.changes({ live: true, since: 'now' })
    console.log(connect.name, 'connected.')
    connect.Changes
      ?.on('change', m => {
        connect.Local?.get(m.id)
          .then(m => {
            connect.Pipe.next(m);
            console.log(connect.name, 'changed.')
          })
          .catch(e => connect.Pipe.error(e))
      })
      .on('error', e => {
        connect.Pipe.error(e)
      })
      .on('complete', f => {
        connect.Pipe.unsubscribe()
      })
  }


  async connect(enterprise: string, workshop: string, role: string) {
    this._connect(this.db.staffer, enterprise, workshop, role)
    this._connect(this.db.order, enterprise, workshop, role)
    this._connect(this.db.technology, enterprise, workshop, role)
    this._connect(this.db.client, enterprise, workshop, role)
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
