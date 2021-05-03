import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

interface HomeData {
  statistics: {
    accompaniments: number;
    mentors: number;
    students: number;
  };
}

@Component({
  selector: 'sgm-home',
  templateUrl: './home.page.html'
})
export class HomePage implements OnInit, OnDestroy {
  constructor(
    private db: AngularFirestore,
  ) { }

  homeData: HomeData | null = null;
  private sub!: Subscription;

  ngOnInit() {
    this.sub = this.db
      .doc<HomeData>('pages/home')
      .valueChanges()
      .subscribe(data => this.homeData = data ?? null);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
