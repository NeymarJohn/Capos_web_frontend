import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './about_us/about-us.component';
import { FaqComponent } from './faq/faq.component';
import { BlogComponent } from './blog/blog.component';
import { AddBlogComponent } from './blog/add-blog/add-blog.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'blog',
    pathMatch: 'full'
  },
  {
    path: 'blog',
    component: BlogComponent,
    data: {title: 'Blog - Ecommerce'}
  },
  {
    path: 'add-blog',
    component: AddBlogComponent,
    data: {title: 'Blog - Ecommerce'}
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: {title: 'FAQ - Ecommerce'}
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    data: {title: 'About Us - Ecommerce'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
