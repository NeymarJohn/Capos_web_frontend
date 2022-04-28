import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { ToastService } from 'src/app/_services/toast.service';
import { AuthService } from '@service/auth.service';
import { UtilService } from '@service/util.service';
import { Openclose } from '@app/_classes/openclose.class';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-register-closure-details',
  templateUrl: './register-closure-details.component.html',
  styleUrls: ['./register-closure-details.component.scss']
})

export class RegisterClosureDetailsComponent implements OnInit {  
  
  user:any;
  showCash: boolean = false;
  util = UtilFunc;
  openClose:Openclose = null;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,    
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService,
    private location:Location
  ) {     

    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void { 
    this.activateRoute.queryParams.subscribe(query => {
      if(query && query._id) {        
        this.openClose = new Openclose(this.authService, this.utilService);
        this.openClose.loadById(query._id, (result) => {

        }, () => {
          this.toastService.showWarning('No Existing Register');
          this.router.navigate(['dashboard/reporting/closures']);
        })
      } else {
        this.router.navigate(['dashboard/reporting/closures']);
      }
    });    
  }

  goBack(): void {
    this.location.back();
  }
}
