import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AuthService} from '@service/auth.service';
import { UtilService} from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import { EditGroupComponent } from './edit-group/edit-group.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  pageData = [];
  displayedColumns=['name', 'action'];
  user: any;
  dataSource: any;
  permission:boolean = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private toastService: ToastService,
    private utilService: UtilService
  ) { 
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.permission = this.user.role.permissions.includes('add_customer_groups');
      }
    });
  }

  ngOnInit(): void {
    this.initTable();
  }

  initTable(): void {
    const param = {mode: 'employee'};
    this.utilService.get('customers/group', param).subscribe(result => {           
      if(result && result.body) {     
        this.pageData = result.body;           
      } else {
        this.pageData = [];
      }
      this.dataSource = new MatTableDataSource(this.pageData);
      this.dataSource.sort = this.matSort;
      this.dataSource.paginator = this.matPaginator;
    });    
  }

  addGroup(){
    const dialogRef = this.dialog.open(EditGroupComponent, {
      width: '600px',
      height: 'auto',
      data: {
        group: {
          name: ''
        }, 
        user: this.user,
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initTable();        
      }
    });
  }

  deleteGroup(group){
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {
        action: 'delete',
        item: 'Group'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==='delete') {        
        this.utilService.delete('customers/group?_id=' + group._id).subscribe(response => {
          this.toastService.showSuccessRemove();
          this.initTable();
        }, error => {
          this.toastService.showFailedRemove();
        }); 
      }
    });
  }

  editGroup(group){
    const dialogRef = this.dialog.open(EditGroupComponent, {
      width: '600px',
      height: 'auto',
      data: {
        group: group, 
        user: this.user,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initTable();       
      }
    });
  }
}
