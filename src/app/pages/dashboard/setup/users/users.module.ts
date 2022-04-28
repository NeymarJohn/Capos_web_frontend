import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { ShareModule } from '@app/_shared/share.module';
import { FormsModule } from '@angular/forms';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';


@NgModule({
  declarations: [UsersComponent, RolesComponent, EditUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ShareModule,
    FormsModule,
    MaterialFileInputModule
  ]
})
export class UsersModule { }
