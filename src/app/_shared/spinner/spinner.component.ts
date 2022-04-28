import { Component, Input, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-spinner',
  template: `<div class="preloader" *ngIf="isSpinnerVisible">
  <mat-spinner [diameter]="28"></mat-spinner>
    </div>`,
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {  

  @Input()
  public backgroundColor = 'rgba(0, 115, 170, 0.69)';

  constructor(
    private router: Router,
    private utilService: UtilService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          this.utilService.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.utilService.isSpinnerVisible = false;
        }
      },
      () => {
        this.utilService.isSpinnerVisible = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.utilService.isSpinnerVisible = false;
  }

  public get isSpinnerVisible():boolean {
    return this.utilService.isSpinnerVisible;
  }
}
