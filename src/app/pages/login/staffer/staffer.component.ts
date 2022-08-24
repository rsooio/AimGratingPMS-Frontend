import { DbService } from './../../../services/db/db.service';
import { StafferService } from '../../../services/api/staffer/staffer.service';
import { DataService } from './../../../services/data/data.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzStatus } from 'ng-zorro-antd/core/types';
import { SYNC_ENDPOINT } from '@/services/db/shared';
import PouchDB from 'pouchdb-browser';

@Component({
  selector: 'app-staffer',
  templateUrl: './staffer.component.html',
  styleUrls: ['./staffer.component.scss']
})
export class StafferComponent implements OnInit {

  constructor(
    private router: Router,
    public db: DbService,
    private staffer: StafferService,
    private data: DataService
  ) { }

  ngOnInit(): void {
    this.enterprise = sessionStorage.getItem('enterprise')
  }

  enterprise: string | null = null;
  username: string | null = null;
  password: string | null = null;
  status: NzStatus = "";
  checked: boolean = false;
  passwordInputType: string = "password"
  disable: boolean = false
  errorMessage = ''

  async login() {
    if (!this.username || !this.password || !this.enterprise) return
    this.disable = true

    await this.db.db.enterprise.Remote
      ?.logIn(this.username, this.password)
      .catch(e => console.log(e))
      .then(async m => {
        await new PouchDB<{ [key in string]: any }>(this.enterprise + '-staffer')
          .get(this.username as string)
          .then(m => this.success(m))
          .catch(async e => {
            await new PouchDB<{ [key in string]: any }>(SYNC_ENDPOINT + this.enterprise + '-staffer')
              .get(this.username as string)
              .catch(e => console.log(e))
              .then(m => {
                if (m) this.success(m)
                else console.log('e')
              })
          })
      })
    this.disable = false
  }

  async success(m: { [x: string]: any; } & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta) {
    if (m['workshop'] && m['role'] && this.enterprise) {
      sessionStorage.setItem('workshop', m['workshop'])
      sessionStorage.setItem('role', m['role'])
      this.data.refreshInfo();
      this.db.connect(this.enterprise, m['workshop'], m['role'])
      this.router.navigate(['/main/dashboard'])
    }
  }

  failed() {

  }

  error() {

  }
}
