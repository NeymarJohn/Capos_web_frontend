import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  navs=[
    {
      name: 'Blog',
      link: 'blog'
    },
    {
      name: 'FAQ',
      link: 'faq'
    },
    {
      name: 'About Us',
      link: 'about-us'
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
