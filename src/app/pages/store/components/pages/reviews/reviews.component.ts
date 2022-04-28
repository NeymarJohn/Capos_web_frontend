import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.sass']
})
export class ReviewsComponent implements OnInit {

  constructor() { }
  contentLoaded = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.contentLoaded = true;
    }, 3000);
  }

}
