import { DataService } from './../../../services/data/data.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StafferGuard implements CanActivate {
  constructor(
    private router: Router,
    private data: DataService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // return new Observable(o => {
    //   this.data.db.getLocal$('enterprise').subscribe({
    //     next: m => {
    //       let name = m?.get("name")
    //       if (name) {
    //         o.next(true)
    //       }
    //       // o.next(this.router.parseUrl('/login/enterprise'))
    //       o.next(false)
    //     },
    //     // error: e => o.next(this.router.parseUrl('/login/enterprise'))
    //     error: e => o.next(false)
    //   })
    // })
    return true;
  }
}
