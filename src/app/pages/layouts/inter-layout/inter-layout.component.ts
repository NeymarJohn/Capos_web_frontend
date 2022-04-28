import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';

@Component({
  selector: 'app-inter-layout',
  templateUrl: './inter-layout.component.html',
  styleUrls: ['../../../../styles.scss', './inter-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InterLayoutComponent implements  OnDestroy {

  mobileQuery: MediaQueryList;

  private readonly mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 2000px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

}
