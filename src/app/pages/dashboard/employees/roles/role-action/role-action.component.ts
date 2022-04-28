import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '@service/util.service';
import {ToastService} from '@service/toast.service';
import {AuthService} from '@service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import * as UtilFunc from '@helper/util.helper';

@Component({
  selector: 'app-role-action',
  templateUrl: './role-action.component.html',
  styleUrls: ['./role-action.component.scss']
})
export class RoleActionComponent implements OnInit {
  util = UtilFunc;
  roleForm: FormGroup;  
  permissions = {};  
  roleId = '';
  mode = 'add';
  user: any;
  sticky: boolean;
  rolePermissions = [];

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private toastService: ToastService,
    private authService: AuthService,
    private route: Router,
    private router: ActivatedRoute,
    private location: Location
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
    this.utilService.get('util/permissions', {}).subscribe(result => {
      this.rolePermissions = result.body;
      for(let p of this.rolePermissions) {
        this.permissions[p.uid] = false;  
      }
    })    
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    this.initForm();    
    
    this.router.queryParams.subscribe(query => {
      if (query && query.mode === 'add') {
        this.mode == 'add';
      } else if (query.mode === 'edit') {
        const keysToRemove = ['__v', 'updated_at'];
        this.mode = 'edit';        
        this.utilService.get('auth/role', {_id:query._id}).subscribe(result => {
          const role = result.body;
          this.roleId = role._id;
          keysToRemove.forEach(key => {
            delete role[key];
          });          
          for(let i=0;i<role.permissions.length;i++) {
            this.permissions[role.permissions[i]] = true;
          }          
          this.roleForm.get('name').setValue(role.name);
        });
      }
    });
  }

  submit(): void {
    if (this.roleForm.invalid) {
      return;
    }
    const item_name = 'User Role';
    const data = this.roleForm.value;
    data.private_web_address = this.user.private_web_address;
    data.permissions = [];
    Object.keys(this.permissions).forEach(key => {
      if(this.permissions[key]) {
        data.permissions.push(key);
      }
    })
    if(data.permissions.length == 0) {
      this.toastService.showSuccess('Please select a permission at least', item_name);
      return;
    }
    if (this.mode === 'add') {
      this.utilService.post('auth/role', data).subscribe(result => {
        this.toastService.callbackSuccessSave(result, 'User Role', () => {
          this.route.navigate(['/dashboard/setup/users/roles']);
        });
      }, error => {this.toastService.showFailedSave(error)});
    } else {       
      data._id = this.roleId;    
      this.utilService.put('auth/role', data).subscribe(result => {
        this.toastService.callbackSuccessSave(result, 'User Role', () => {
          this.route.navigate(['/dashboard/setup/users/roles']);
        });
      }, error => {this.toastService.showFailedSave(error)});
    }
  }

  goBack(): void {
    this.location.back();
  }

  selectAll(checked:boolean) {
    Object.keys(this.permissions).forEach(key => {
      this.permissions[key] = checked;
    })
  }

  getCount(groupId) {
    let pp = this.rolePermissions.filter(item => item.group == groupId);
    return pp.length;
  }

  scroll = (event: any): void => {
    const num = event.srcElement.scrollTop;
    this.sticky = num > 64;
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scroll, true);
  }

}
