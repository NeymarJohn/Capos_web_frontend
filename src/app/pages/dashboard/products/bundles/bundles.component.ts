import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location} from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Collection } from '@app/_classes/collection.class';
import { AuthService } from '@app/_services/auth.service';
import { ToastService } from '@app/_services/toast.service';
import { UtilService } from '@app/_services/util.service';
import { MatPaginator} from '@angular/material/paginator';
import { RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { Bundle } from '@app/_classes/bundle.class';
import * as UtilFunc from '@app/_helpers/util.helper';

@Component({
  selector: 'app-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BundlesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  table_data:Bundle[] = [];
  displayedColumns: string[] = ['expand', 'id', 'name', 'price', 'count', 'discount', 'products', 'active', 'action'];
  dataSource:any;  
  util = UtilFunc;
  expandedElement: any | null;

  constructor(
    private location: Location,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService
  ) { 

  }

  ngOnInit(): void {
    this.initTable();
  }
  
  initTable() {    
    this.table_data = [];
    this.utilService.get('product/bundle', {}).subscribe(result => {
      if(result && result.body) {
        for(let c of result.body) {  
          let bundle = new Bundle(this.authService, this.utilService);
          bundle.loadDetails(c);
          this.table_data.push(bundle);
        }
      }      
      this.dataSource = new MatTableDataSource(this.table_data);
      this.dataSource.paginator = this.paginator;
    })
  }

  goBack() {
    this.location.back();
  }

  addBundle(){    
    this.router.navigate(['/dashboard/product/edit-bundle'], {queryParams: {_id: ''}});
  }

  handleAction(action:string, bundle:Bundle) {        
    if(action == 'edit') {
      const params = {_id: bundle._id};
      this.router.navigate(['/dashboard/product/edit-bundle'], {queryParams: params});
    }
    if(action == 'delete') {
      const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
        width: '500px',
        height: 'auto',
        data: {action: 'delete', item: 'bundle'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action) {
          bundle.delete(() => {
            this.toastService.showSuccessRemove();     
            this.initTable();
          }, () => {
            this.toastService.showFailedRemove();
          })
        }
      });
    }
  }
  
  toggleActive(bundle:Bundle): void {    
    bundle.save(() => {
      this.toastService.showSuccessSave();
    })    
  }

}
