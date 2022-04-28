import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  constructor(
    private location:Location,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goBack(){
    this.router.navigate(['home']);
  }
}
