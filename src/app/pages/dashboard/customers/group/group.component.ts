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
import { Group } from '@app/_classes/group.class';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  pageData:Group[] = [];
  displayedColumns=['name', 'limit', 'point_rates', 'action'];
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
    this.pageData = [];
    this.utilService.get('customers/group', {}).subscribe(result => {           
      if(result && result.body) {     
        for(let g of result.body) {
          let group:Group = new Group(this.authService, this.utilService);
          group.loadDetails(g);
          this.pageData.push(group);
        }        
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
      width: '610px',
      height: 'auto',
      data: {
        group: new Group(this.authService, this.utilService)
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initTable();        
      }
    });
  }

  deleteGroup(group:Group){
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '500px',
      data: {
        action: 'delete',
        item: 'Group'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'delete') {        
        this.utilService.delete('customers/group?_id=' + group._id).subscribe(response => {
          this.toastService.showSuccessRemove();
          this.initTable();
        }, error => {
          this.toastService.showFailedRemove();
        }); 
      }
    });
  }

  editGroup(group: Group){
    const dialogRef = this.dialog.open(EditGroupComponent, {
      width: '610px',
      height: 'auto',
      data: {
        group: group
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.initTable();       
      }
    });
  }

}
