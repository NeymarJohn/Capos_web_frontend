import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { APP_CONSTANTS } from '@app/_configs/constant';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{  

  constructor(
    private titleService: Title, 
    private utilService: UtilService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  setDocTitle(title: string) {    
    if(title){
      this.titleService.setTitle(title + ' - ' + APP_CONSTANTS.APP_TITLE);
    } else {
      this.titleService.setTitle(APP_CONSTANTS.APP_TITLE);
    }
  }

  ngOnInit() {    
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;          
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return '';
        })
      ).subscribe((ttl: string) => {
        this.setDocTitle(ttl);
      });
  }
}
