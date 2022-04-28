import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '@service/auth.service';
import {UtilService} from '@service/util.service';
import {ToastService} from '@service/toast.service';
import {MatTableDataSource} from '@angular/material/table';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import {MatDialog} from '@angular/material/dialog';
import * as UtilFunc from '@helper/util.helper';
import {EditUserComponent} from './edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  util = UtilFunc;  
  userSearchForm: FormGroup;
  roles = [];
  outlets = [];
  users = [];
  displayedColumns=['name', 'email', 'role', 'outlet', 'daily_target', 'weekly_target', 'monthly_target', 'action'];
  dataSource: any;
  searchVal = '';
  user:any;
  permission:boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private dialog: MatDialog,
    private utilService: UtilService,
    private authService: AuthService
  ) {     
    this.userSearchForm = this.fb.group({
      role: [''],
      outlet: ['']
    });
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.permission = this.user.role.permissions.includes('add_cashier') && this.user.role.permissions.includes('add_manager');
      }
    });
  }

  ngOnInit(): void {
    this.roles = [{_id: '', name:'All Roles'}, {_id:'null', name:'Free'}];
    this.utilService.get('auth/role', {}).subscribe(result => {
      this.roles = this.roles.concat(result.body);
    }); 
    this.outlets = [{_id: '', name:'All Outlets'}];
    this.utilService.get('sell/outlet', {}).subscribe(result => {
      this.outlets = this.outlets.concat(result.body);
    });    
    this.initUser();
  }

  initUser(): void {        
    this.utilService.get('auth/users', {}).subscribe(result => {  
      this.initUserTable(result);
    });
  }

  initUserTable(result): void {
    // Product
    this.users = result.body;
    if(this.users==undefined || this.users==null)
      this.users=[];
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;    
  }

  addUser(){
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '600px',
      height: 'auto',
      data: {
        item: {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          daily_target: 0,
          weekly_target: 0,
          monthly_target: 0,
          profile_image: '',
          outlet: '',
          role: ''
        },         
        action: 'add',
        user: this.user
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initUser();        
      }
    });
  }
  
  filterUser(): void {
    this.dataSource.filter = this.searchVal.trim().toLowerCase();
  }

  searchUser(): void {    
    this.utilService.get('auth/users', this.userSearchForm.value).subscribe(result => {      
      this.initUserTable(result);
    });
  }

  clearFilter(): void {
    this.searchVal = '';
    this.userSearchForm = this.fb.group({
      role: [''],
      outlet: ['']
    });
    this.initUser();
  }

  editUser(element:any) {
    let item = {...element};
    if(item.outlet) {
      item.outlet = item.outlet._id;
    } else {
      item.outlet = '';
    }
    if(!item.role) {
      item.role = '';
    } else {
      item.role = item.role._id;
    }
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '600px',
      height: 'auto',
      data: {
        item: item, 
        user: this.user,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result) {
        this.initUser();       
      }
    });
  }

  deleteUser(item: any) {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {
        action: 'delete',
        item: 'User'
      }
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result && result.action==='delete') {        
        this.utilService.delete('auth/user?_id=' + item._id).subscribe(response => {
          this.toastService.showSuccessRemove();
          this.initUser();
        }, error => {
          this.toastService.showFailedRemove();
        }); 
      }
    });
  }
}
