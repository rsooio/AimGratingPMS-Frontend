import { Router } from '@angular/router';
import { DataService } from './../../../services/data/data.service';
import { catchError } from 'rxjs/operators';
import { OrganizationService } from '@/services/organization/organization.service';
import { NzStatus } from 'ng-zorro-antd/core/types';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private organization: OrganizationService,
    private data: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  disabled: boolean = false
  buttonDisable: boolean = true

  errorState = 0
  passwordConfirmType: string = 'password'

  enterpriseStatus: NzStatus = ''
  passwordConfirmStatus: NzStatus = ''

  enterprise: string | null = null
  username: string | null = null
  password: string | null = null
  passwordConfirm: string | null = null
  address: string | null = null

  onInput() {
    if (this.enterprise && this.username && this.password && this.password == this.passwordConfirm && this.enterpriseStatus == '') {
      this.buttonDisable = false
    } else {
      this.buttonDisable = true
    }
  }

  onEnterpriseInput() {
    if (this.errorState == 1 && this.password != this.passwordConfirm) {
      this.errorState = 2
    } else {
      this.errorState = 0
    }
    if (this.enterpriseStatus != '') {
      this.enterpriseStatus = ''
    }
    this.onInput()
  }

  onUsernameInput() {
    this.onInput()
  }

  onPasswordInput() {
    if (this.errorState == 2) {
      this.errorState = 0
    }
    if (this.password && this.passwordConfirm != this.password) {
      this.passwordConfirmStatus = 'error'
    } else {
      this.passwordConfirmStatus = ''
    }
    this.onInput()
  }

  registerEnterprise() {
    this.disabled = true
    let address = this.address ? this.address : ''
    this.organization.createEnterprise({
      name: <string>this.enterprise,
      boss_name: <string>this.username,
      boss_password: <string>this.password,
      address: address
    }).subscribe({
      next: m => {
        if (m.code == 0) {
          this.data.enterprise.id = m.data.id
          this.data.enterprise.name = <string>this.enterprise
          this.router.navigate(['/login/staffer'])
        } else {
          this.enterpriseStatus = 'error'
          this.errorState = 1
          this.buttonDisable = true
        }
      },
      error: e => {
        console.log(e)
      }
    })
    this.disabled = false
  }
}
