import { UtilsService } from '@/services/utils/utils.service';
import { DataService } from './../../../services/data/data.service';
import { EnterpriseDocument, EnterpriseDocType } from './../../../schemas/enterprise';
import { DbService } from './../../../services/db/db.service';
import { OrganizationService } from '../../../services/api/organization/organization.service';
import { Component, OnInit } from '@angular/core';
import { NzStatus } from 'ng-zorro-antd/core/types';
import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-enterprise',
  templateUrl: './enterprise.component.html',
  styleUrls: ['./enterprise.component.scss']
})
export class EnterpriseComponent implements OnInit {

  constructor(
    private router: Router,
    private organization: OrganizationService,
    private db: DbService,
    private data: DataService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
  }

  disabled: boolean = false
  enterprise: string | null = null;
  enterpriseCode?: string;
  status: NzStatus = "";
  errorMessage: string = "企业查询失败，请确认后重试！"
  checked: boolean = false;

  onInput() {
    if (this.status != "") {
      this.status = ""
    }
  }

  selectEnterprise() {
    this.disabled = true;
    if (this.enterprise == null) return
    this.db.enterprise.Local
      ?.get(this.enterprise).then(m => {
        console.log(m)
        this.enterpriseCode = m['db'];
        this.success();
      }).catch(e => {
        if (e.status == 404) this.failed()
        else this.error()
        console.log('error')
        console.log(e)
      }).finally(() => {
        console.log('done')
      })
    this.disabled = false;
  }

  async success() {
    if (!this.enterprise || !this.enterpriseCode) return;
    sessionStorage.setItem('enterprise', this.enterprise)
    sessionStorage.setItem('enterpriseCode', this.enterpriseCode)
    this.data.refreshInfo();
    this.router.navigate(['/login/staffer'])
  }

  failed() {
    this.status = "warning"
  }

  error() {
    this.status = 'error'
  }
}
