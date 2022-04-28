import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  navs=[
    {
      name: 'Store Settings',
      link: 'store'
    },
    {
      name: 'Contact Information',
      link: 'contact'
    },
    {
      name: 'Address',
      link: 'address'
    },
  ];  
  constructor(private authService: AuthService) { 
    this.authService.checkPremission('setup_general')
  }

  ngOnInit(): void {
  }

}
