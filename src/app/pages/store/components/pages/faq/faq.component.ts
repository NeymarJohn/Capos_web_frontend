import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IFaq } from '@app/pages/dashboard/ecommerce/pages/faq/faq.component';
import { Store } from '@app/_classes/store.class';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.sass']
})
export class FaqComponent implements OnInit {

  faqs:IFaq[] = [];
  constructor(
    public store: Store, 
    private utilService: UtilService,
    private router: Router
  ) {
    this.store.load(()=>{
      if(!this.store.active_widget.about_us) {
        this.router.navigate(['error']);
      } else {
        this.utilService.get('sale/faq', {}).subscribe(result => {
          this.faqs = result.body;
        })
      }
    });
  }

  ngOnInit() {
  }

}
