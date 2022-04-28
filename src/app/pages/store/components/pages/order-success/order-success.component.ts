import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Onlineorder } from '@app/_classes/onlineorder.class';
import { AuthService } from '@app/_services/auth.service';
import { ToastService } from '@app/_services/toast.service';
import { UtilService } from '@app/_services/util.service';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.sass']
})
export class OrderSuccessComponent implements OnInit {

  util = UtilFunc;

  constructor(
    private route: ActivatedRoute,   
    private router: Router, 
    private toastService: ToastService,
    public order: Onlineorder
  ) {
    this.route.params.subscribe(params => {
      const _id = params['id'];
      this.order.loadById(_id, () => {

      }, () => {
        this.toastService.showFailed('No existing order');
        this.router.navigate(this.util.getRouterLink());
      })
    });
  }

  ngOnInit(): void {
    this.util.scrollToTop();
  }
}
