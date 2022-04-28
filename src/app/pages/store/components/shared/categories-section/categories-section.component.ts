import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories-section',
  templateUrl: './categories-section.component.html',
  styleUrls: ['./categories-section.component.sass']
})
export class CategoriesSectionComponent implements OnInit {
  contentLoaded = false;
  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.contentLoaded = true;
    }, 3000);
  }

}
