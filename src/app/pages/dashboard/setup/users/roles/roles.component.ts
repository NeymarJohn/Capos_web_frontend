import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { UtilService} from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import * as UtilFunc from '@helper/util.helper';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  dataSource: any;
  pageData = [];  
  displayedColumns=['name', 'updated_at', 'action'];
  util = UtilFunc;
  permission:boolean = false;
  user:any;

  constructor(    
    private dialog: MatDialog,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService,
    private route: Router,
    private router: ActivatedRoute,
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;   
      if(this.user.role) {        
        this.permission = this.user.role.permissions.includes('manage_role');
      }
    });
  }

  ngOnInit(): void {
    this.initTable();
  }

  initTable(): void {    
    this.utilService.get('auth/role', {}).subscribe(result => {           
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

  addRole(){
    this.route.navigate(['/dashboard/setup/role-action'], {queryParams: {mode: 'add'}});
  }

  editRole(role) {
    this.route.navigate(['/dashboard/setup/role-action'], {queryParams: {_id: role._id, mode: 'edit'}});
  }

  deleteRole(role) {
    const item_name = 'User Role';
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px', 
      data: {
        action: 'delete',
        item: item_name
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'delete') {        
        this.utilService.delete('auth/role?name=' + role.name).subscribe(result => {
          this.toastService.showSuccessRemove();
          this.initTable();
        }, error => {
          this.toastService.showFailedRemove();
        });         
      }
    });
  }
}
