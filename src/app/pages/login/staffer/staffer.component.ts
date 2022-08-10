import { DataService } from './../../../services/data/data.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzStatus } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-staffer',
  templateUrl: './staffer.component.html',
  styleUrls: ['./staffer.component.scss']
})
export class StafferComponent implements OnInit {

  constructor(
    private router: Router,
    public data: DataService
  ) { }

  ngOnInit(): void {
    if (this.data.enterprise.name == "") {
      this.router.navigate(["login/enterprise"])
    }
  }

  username: string | null = null;
  password: string | null = null;
  status: NzStatus = "";
  checked: boolean = false;
  passwordInputType: string = "password"

  test() {
    this.router.navigate(["/login/enterprise"])
  }
}
