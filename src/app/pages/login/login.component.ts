import { animate, group, keyframes, query, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger("routerAnimation", [
      transition("enterprise => staffer", [
        query(":enter", style({ transform: "translateX(25%)", opacity: 0 })),
        group([
          query(":enter", animate("0.25s ease-in", style({ transform: "translateX(0)", opacity: 1 }))),
          query(":leave", animate("0.25s ease-out", style({ transform: "translateX(-25%)", opacity: 0 }))),
        ])
      ]),
      transition("staffer => enterprise", [
        query(":enter", style({ transform: "translateX(-25%)", opacity: 0 })),
        group([
          query(":enter", animate("0.25s ease-in", style({ transform: "translateX(0)", opacity: 1 }))),
          query(":leave", animate("0.25s ease-out", style({ transform: "translateX(25%)", opacity: 0 })))
        ])
      ]),
      transition("enterprise => register", [
        query(":enter", style({ transform: "translateX(-25%)", opacity: 0 })),
        group([
          query(":enter", animate("0.25s ease-in", style({ transform: "translateX(0)", opacity: 1 }))),
          query(":leave", animate("0.25s ease-out", style({ transform: "translateX(25%)", opacity: 0 })))
        ])
      ]),
      transition("register => enterprise", [
        query(":enter", style({ transform: "translateX(25%)", opacity: 0 })),
        group([
          query(":enter", animate("0.25s ease-in", style({ transform: "translateX(0)", opacity: 1 }))),
          query(":leave", animate("0.25s ease-out", style({ transform: "translateX(-25%)", opacity: 0 }))),
        ])])
    ])
  ]
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  prepare(outlet: RouterOutlet) {
    if (outlet && outlet.activatedRouteData && outlet.activatedRouteData["animation"]) {
      return outlet.activatedRouteData["animation"]
    }
  }

}
