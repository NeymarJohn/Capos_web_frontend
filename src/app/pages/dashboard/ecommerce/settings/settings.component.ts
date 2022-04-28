import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  navs=[
    {
      name: 'General',
      link: 'general'
    },
    {
      name: 'Payment Methods',
      link: 'payment-methods'
    },
    {
      name: 'Sliders',
      link: 'sliders'
    },
    {
      name: 'Banners',
      link: 'banners'
    },
    {
      name: 'Services',
      link: 'services'
    },
    {
      name: 'Click & Collect',
      link: 'click-collect'
    }

  ];
  constructor() { }

  ngOnInit(): void {
  }

}
