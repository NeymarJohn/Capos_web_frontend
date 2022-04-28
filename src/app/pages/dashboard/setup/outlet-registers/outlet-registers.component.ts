import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthService} from '@service/auth.service';
import { UtilService} from '@service/util.service';
import { ToastService} from '@service/toast.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { AddRegisterDlgComponent } from '@page/dashboard/setup/outlet-registers/add-register-dlg/add-regisger-dlg.component';

@Component({
  selector: 'app-outlet-registers',
  templateUrl: './outlet-registers.component.html',
  styleUrls: ['./outlet-registers.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OutletRegistersComponent implements OnInit {
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  pageData = [];
  user: any;
  dataSource: any;
  displayedColumns=['expand', 'name', 'defaultTax', 'is_main', 'register', 'action'];
  permission:boolean = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,    
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.permission = this.user.role.permissions.includes('manage_outlet');
      }
    });
  }

  ngOnInit(): void {
    this.initTable();
  }

  initTable(): void {    
    this.utilService.get('sell/outlet', {}).subscribe(result => {         
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

  addOutlet(){
    this.router.navigate(['dashboard/setup/outlets/edit-outlet'], {queryParams: {action: 'add'}});    
  }

  addReceiptTemplate(){
    //TODO: add receipt template
  }

  editOutlet(item:any) {
    this.router.navigate(['dashboard/setup/outlets/edit-outlet'], {queryParams: {_id: item._id, action: 'edit'}});    
  }

  deleteOutlet(item:any) {
    const item_name = 'Outlet';
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {
        action: 'delete',
        item: item_name
      }
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result && result.action==='delete') {        
        this.utilService.delete('sell/outlet?_id=' + item._id).subscribe(response => {
          this.toastService.showSuccessRemove();
          this.initTable();
        }, error => {
          this.toastService.showFailedRemove();
        }); 
      }
    });
  }

  toggleMainOutlet(event, item:any) {
    event.stopPropagation();
    const data = {_id: item._id, private_web_address: item.private_web_address, is_main: !item.is_main};
    this.utilService.put('sell/outlet', data).subscribe(result => {
      this.toastService.showSuccessSave();
      this.initTable();
    }, error => {
      this.toastService.showFailedSave();
    })
  }

  addRegister(element:any) {
    const dialogRef = this.dialog.open(AddRegisterDlgComponent, {
      width: '600px',
      data: {        
        outlet: element,
        action: 'add'
      }
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result && result.action==='add') {
        const data = {name: result.regisger, outlet: element._id, private_web_address: element.private_web_address};
        this.utilService.post('sell/register', data).subscribe(result1 => {  
          this.toastService.callbackSuccessSave(result1, 'Register', () => {
            this.initTable();
          });                
        }, error => {this.toastService.showFailedSave(error)});
      }
    });
  }

  editRegister(element:any, register:any) {
    const dialogRef = this.dialog.open(AddRegisterDlgComponent, {
      width: '600px',
      data: {        
        outlet: element,
        register: register,
        action: 'edit'
      }
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result && result.action==='edit') {
        const data = {_id: register._id, name: result.regisger};
        this.utilService.put('sell/register', data).subscribe(result1 => {  
          this.toastService.callbackSuccessSave(result1, 'Register', () => {
            this.initTable();
          });                
        }, error => {this.toastService.showFailedSave(error)});
      }
    });
  }

  deleteRegister(register:any) {
    const item_name = 'Register';
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '600px',
      data: {
        action: 'delete',
        item: item_name
      }
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result && result.action==='delete') {        
        this.utilService.delete('sell/register?_id=' + register._id).subscribe(response => {
          this.toastService.showSuccessRemove();
          this.initTable();
        }, error => {
          this.toastService.showFailedRemove();
        }); 
      }
    });
  }
}
