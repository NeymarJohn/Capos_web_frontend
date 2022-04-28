import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Aboutpage, ITeamMember } from '@app/_classes/aboutpage.class';
import { Store } from '@app/_classes/store.class';
import { UtilService } from '@app/_services/util.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.sass']
})
export class AboutUsComponent implements OnInit {  

  constructor(
    public store: Store, 
    public aboutpage: Aboutpage,
    private utilService: UtilService,
    private router: Router
  ) {
    this.store.load(()=>{
      if(!this.store.active_widget.about_us) {
        this.router.navigate(['error']);
      }
    });
    this.aboutpage.load();
  }

  ngOnInit() {
  }

  checkSocial(member:ITeamMember) {
    return member.facebook || member.twitter || member.linkedin || member.instagram;
  }

  getImagePath(path) {
    return this.utilService.get_image(path);
  }

}
