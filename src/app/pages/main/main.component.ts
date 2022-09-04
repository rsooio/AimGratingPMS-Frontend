import { filter, first } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, ActivatedRouteSnapshot, RouterLink, UrlTree, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, Optional } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild('outlet') outlet: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  isCollapsed = false;
  openMap: { [name: string]: boolean | undefined } = {
    sub1: true,
    sub2: true,
    sub3: true,
    sub4: true,
    sub5: true,
    sub6: true
  };

  openHandler(value: string): void {
    return;
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }
}
