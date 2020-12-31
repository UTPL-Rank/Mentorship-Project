import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sgm-loading-bar',
  templateUrl: './loading-bar.component.html'
})
export class LoadingBarComponent implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  public loading = false;
  private routerSub!: Subscription;

  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe((event: Event) => {
      // user is navigating to new route
      if (event instanceof NavigationStart) {
        this.loading = true;
        return;
      }

      // cancel navigation
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }
}
