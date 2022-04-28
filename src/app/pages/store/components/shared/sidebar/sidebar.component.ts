import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { SidebarMenuService } from './sidebar-menu.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {  SidenavMenu } from './sidebar-menu.model';
import { Router } from '@angular/router';
import * as UtilFunc from '@helper/util.helper';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SidebarComponent implements OnInit {
  util = UtilFunc;
  categories = [];
  expanded: boolean;
  // @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: SidenavMenu;
  @Input() depth: number;

  constructor(private sidenavMenuService:SidebarMenuService, public router: Router, private utilService: UtilService) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
    this.utilService.get('product/type', {}).subscribe(result => {
      if(result && result.body) {
        this.categories = result.body;
        if(this.item.displayName == 'Categories') {
          for(let c of this.categories) {
            this.item.children.push({
              displayName: c.name,
              iconName: 'group',
              route: '/products/' + c.slug
            })
          }
        }
      }
    })
  }

  ngOnInit() {
    this.sidenavMenuService.currentUrl.subscribe((url: string) => {
      if (this.item.route && url) {
        // console.log(`Checking '/${this.item.route}' against '${url}'`);
        this.expanded = url.indexOf(`/${this.item.route}`) === 0;
        // this.ariaExpanded = this.expanded;
        // console.log(`${this.item.route} is expanded: ${this.expanded}`);
      }
    });
  }
  onItemSelected(item: SidenavMenu) {
    if (!item.children || !item.children.length) {
      this.router.navigate(this.util.getRouterLink(item.route));
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

}
