import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InterLayoutComponent } from '../layouts/inter-layout/inter-layout.component';
import { HowItWorksComponent } from './how_it_works/how_it_works.component';
import { SupportComponent } from './support/support.component';
import { FeaturesComponent } from './features/features.component';
import { FaqComponent } from './faq/faq.component';
import { BlogComponent } from './blog/blog.component';
import { BlogPostComponent } from './blog/blog_post/blog-post.component';
import { ContactComponent } from './contact/contact.component';
import { PricingComponent } from './pricing/pricing.component';

const routes: Routes = [
  {
    path: '',
    component: InterLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'how-it-works',
        component: HowItWorksComponent,
        data: {title: 'How it Works'}
      },
      {
        path: 'support',
        component: SupportComponent,
        data: {title: 'Support'}
      },
      {
        path: 'features',
        component: FeaturesComponent,
        data: {title: 'Features'}
      },
      {
        path: 'faq',
        component: FaqComponent,
        data: {title: 'FAQ'}
      },
      {
        path: 'blog',
        component: BlogComponent,
        data: {title: 'Blog'}
      },
      {
        path: 'blog-post/:id',
        component: BlogPostComponent,        
        data: {title: 'Blog'}
      },
      {
        path: 'contact',
        component: ContactComponent,
        data: {title: 'Contact'}
      },
      {
        path: 'pricing',
        component: PricingComponent,
        data: {title: 'Pricing'}
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterfaceRoutingModule { }
