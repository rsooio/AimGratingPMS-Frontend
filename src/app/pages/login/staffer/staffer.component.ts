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

    this.db.enterprise.Local
      ?.get(this.dataService.info.enterprise!)
      .then(db => {
        if (!db['staffers'] || !db['staffers'][this.username!] || !db['staffers'][this.username!]['name']) {
          this.failed();
          return;
        }
        this.db.enterprise.Remote
          ?.logIn(db['staffers'][this.username!]['name'], this.password!)
          .catch(e => {
            console.log(e);
            this.failed();
          })
          .then(m => {
            console.log(m)
            if (!m) {
              this.failed();
              return;
            }
            this.success(db['staffers'][this.username!]);
          })
      })
      .catch(e => this.failed())
  }

  async success(m: { [x: string]: any; }) {
    this.disable = false;
    if (m['workshop'] !== null && m['role'] !== null) {
      sessionStorage.setItem('workshop', m['workshop'])
      sessionStorage.setItem('role', m['role'])
      this.dataService.refreshInfo();
      this.db.connect(this.dataService.info.enterpriseCode!, m['workshop'], m['role'])
      this.router.navigate(['/main/dashboard'])
    }
  }

  failed() {
    this.disable = false;

  }

  error() {
    this.disable = false;

  }
}
