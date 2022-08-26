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
    public dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    console.log('test')
  }

  username: string | null = null;
  password: string | null = null;
  status: NzStatus = "";
  checked: boolean = false;
  passwordInputType: string = "password"
  disable: boolean = false
  errorMessage = ''

  async login() {
    if (!this.username || !this.password) return
    this.disable = true

    await this.db.enterprise.Remote
      ?.logIn(this.dataService.info.enterprise + '-' + this.username, this.password)
      .catch(e => console.log(e))
      .then(async m => {
        if (!m) {
          this.failed();
          return;
        }
        await new PouchDB<{ [key in string]: any }>(this.dataService.info.enterpriseCode!)
          .get('staffer/' + this.username!)
          .then(m => this.success(m))
          .catch(async e => {
            await new PouchDB<{ [key in string]: any }>(SYNC_ENDPOINT + this.dataService.info.enterpriseCode!)
              .get('staffer/' + this.username!)
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
    if (m['workshop'] && m['role']) {
      sessionStorage.setItem('workshop', m['workshop'])
      sessionStorage.setItem('role', m['role'])
      this.dataService.refreshInfo();
      this.db.connect(this.dataService.info.enterpriseCode!, m['workshop'], m['role'])
      this.router.navigate(['/main/dashboard'])
    }
  }

  failed() {

  }

  error() {

  }
}
