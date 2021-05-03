import { Component, OnInit } from '@angular/core';
import { PwaService } from './core/services/pwa.service';
@Component({
  selector: 'sgm-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private readonly pwa: PwaService) { }

  ngOnInit() {
    this.pwa.initPushNotifications();
    this.pwa.initUpdateChecker();
  }
}
