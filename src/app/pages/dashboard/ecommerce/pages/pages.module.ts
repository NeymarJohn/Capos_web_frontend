import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { PagesRoutingModule } from './pages-routing.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ShareModule } from '@app/_shared/share.module';
import { FormsModule } from '@angular/forms';
import { AboutUsComponent } from './about_us/about-us.component';
import { FaqComponent } from './faq/faq.component';
import { BlogComponent } from './blog/blog.component';
import { FaqDlgComponent } from './faq/faq-dlg/faq-dlg.component';
import { AddBlogComponent } from './blog/add-blog/add-blog.component';

@NgModule({
  declarations: [
    AboutUsComponent,
    FaqComponent,
    BlogComponent,
    FaqDlgComponent,
    AddBlogComponent
  ],
  imports: [
    AngularEditorModule,
    CommonModule,
    FormsModule,
    ShareModule,
    PagesRoutingModule,
    UiSwitchModule
  ]  
})
export class PagesModule { }
