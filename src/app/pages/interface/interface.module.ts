import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterfaceRoutingModule } from './interface-routing.module';
import {ShareModule} from '../../_shared/share.module';
import { HomeComponent } from './home/home.component';
import { HowItWorksComponent } from './how_it_works/how_it_works.component';
import { SupportComponent } from './support/support.component';
import { FeaturesComponent } from './features/features.component';
import { FaqComponent } from './faq/faq.component';
import { BlogComponent } from './blog/blog.component';
import { BlogPostComponent } from './blog/blog_post/blog-post.component';
import { ContactComponent } from './contact/contact.component';
import { PricingComponent } from './pricing/pricing.component';

@NgModule({
  declarations: [
    HomeComponent,
    HowItWorksComponent,
    SupportComponent,
    FeaturesComponent,
    FaqComponent,
    BlogComponent,
    BlogPostComponent,
    ContactComponent,
    PricingComponent
  ],
  imports: [
    CommonModule,
    InterfaceRoutingModule,
    ShareModule,
  ]
})
export class InterfaceModule { }
