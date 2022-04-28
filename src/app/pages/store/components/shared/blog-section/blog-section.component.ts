import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog-section',
  templateUrl: './blog-section.component.html',
  styleUrls: ['./blog-section.component.sass']
})
export class BlogSectionComponent implements OnInit {

  constructor() { }
  contentLoaded = false;
  
  ngOnInit() {
    setTimeout(() => {
      this.contentLoaded = true;
    }, 3000);
  }

}
