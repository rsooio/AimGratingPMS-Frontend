import { DataService } from './../../../services/data/data.service';
import { OrganizationService } from '../../../services/organization/organization.service';
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
    private data: DataService
  ) { }

  ngOnInit(): void {
  }

  disabled: boolean = false
  enterprise: string | null = null;
  status: NzStatus = "";
  errorMessage: string = "企业名查询失败，请确认后重试！"
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
    this.status = "";
    this.disabled = true;
    if (this.enterprise) {
      this.organization.getEnterpriseIdByName(this.enterprise)
        .pipe(catchError(this.handleError))
        .subscribe({
          next: m => {
            if (m.code == 0) {
              if (this.enterprise) {
                this.data.enterprise.name = this.enterprise
                this.data.enterprise.id = m.data.id
              }
              this.router.navigate(['/login/staffer'])
            } else {
              this.status = "warning"
            }
            this.disabled = false;
          },
          error: e => {
            this.status = "error"
            this.disabled = false;
          }
        })
    }
  }
}
