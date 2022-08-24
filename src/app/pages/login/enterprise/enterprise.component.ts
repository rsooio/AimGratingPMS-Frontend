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
    private data: DataService
  ) { }

  ngOnInit(): void {
  }

  disabled: boolean = false
  enterprise: string | null = null;
  status: NzStatus = "";
  errorMessage: string = "企业查询失败，请确认后重试！"
  checked: boolean = false;

  onInput() {
    if (this.status != "") {
      this.status = ""
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  selectEnterprise() {
    this.disabled = true;
    if (this.enterprise == null) return
    this.enterprise = this.enterprise.toLowerCase()
    // this.status = "";
    // this.organization.getEnterpriseIdByName(this.enterprise)
    //   .pipe(catchError(this.handleError))
    //   .subscribe({
    //     next: m => {
    //       console.log(m)
    //       if (m.code == 0) {
    //         this.data.enterprise.name = <string>this.enterprise
    //         this.data.enterprise.id = m.data.id
    //         this.router.navigate(['/login/staffer'])
    //       } else {
    //         this.status = "warning"
    //       }
    //       this.disabled = false;
    //     },
    //     error: e => {
    //       this.status = "error"
    //       this.disabled = false;
    //     }
    //   })

    this.db.db.enterprise.Remote?.get(this.enterprise).then(m => {
      this.success()
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
    if (!this.enterprise) return;
    sessionStorage.setItem('enterprise', this.enterprise)
    this.router.navigate(['/login/staffer'])
  }

  failed() {
    this.status = "warning"
  }

  error() {
    this.status = 'error'
  }
}
