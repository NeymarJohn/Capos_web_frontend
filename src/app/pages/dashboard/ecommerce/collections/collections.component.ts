import { Component, OnInit, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Collection } from '@app/_classes/collection.class';
import { AuthService } from '@app/_services/auth.service';
import { ToastService } from '@app/_services/toast.service';
import { UtilService } from '@app/_services/util.service';
import {MatPaginator} from '@angular/material/paginator';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  table_data:Collection[] = [];
  displayedColumns: string[] = ['parent', 'name', 'children', 'products', 'active', 'action'];
  dataSource:any;  
  _id: string = '';
  breadcrumb:any[] = [];
  all_collections:any[] = [];

  constructor(
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private utilService: UtilService,
    private toastService: ToastService
  ) { 

  }

  ngOnInit(): void {
    this.utilService.get('product/collection', {}).subscribe(result => {
      if(result && result.body) {
        for(let c of result.body) {
          this.all_collections.push(c);
        }
      }
      this.setBreadcrumb();
    })    

    this.route.queryParams.subscribe(query => {
      this._id = null;
      if (query && query._id) {              
        this._id = query._id;        
      }
      if(this.all_collections.length>0) {
        this.setBreadcrumb();
      }
      this.initTable();
    });
  }

  setBreadcrumb() {    
    this.breadcrumb = [{_id:null, name:'Root'}];
    if(this._id) {
      let pp = this.getAllParentCollections(this._id);
      for(let i=pp.length-1;i>=0;i--) {
        this.breadcrumb.push(pp[i]);
      }
    }
  }

  getAllParentCollections(_id:string) {    
    let self = this.getCollectionById(_id);
    if(self.parent) {
      return [self].concat(this.getAllParentCollections(self.parent._id));
    } else {
      return [self];
    }
  }

  getCollectionById(_id:string) {
    let index = this.all_collections.findIndex(item => item._id == _id);
    if(index>-1) {
      return this.all_collections[index];
    }
    return null;
  }

  gotoParent(_id: string) {
    const params = _id? {_id: _id} : {};
    this.router.navigate(['/dashboard/ecommerce/collections'], {queryParams: params});
  }

  initTable() {
    const query = {parent: this._id};
    this.table_data = [];
    this.utilService.get('product/collection', query).subscribe(result => {
      if(result && result.body) {
        for(let c of result.body) {          
          let collection = new Collection(this.authService, this.utilService);
          collection.loadDetails(c);
          this.table_data.push(collection);
        }
      }      
      this.dataSource = new MatTableDataSource(this.table_data);
      this.dataSource.paginator = this.paginator;
    })
  }

  goBack() {
    this.location.back();
  }

  addCollection(){
    const params = {parent: this._id ? this._id:'root'};
    this.router.navigate(['/dashboard/ecommerce/edit-collection'], {queryParams: params});
  }

  handleAction(action:string, collection:Collection) {    
    if(action == 'view') {
      const params = {_id: collection._id};
      this.router.navigate(['/dashboard/ecommerce/collections'], {queryParams: params});
    }
    if(action == 'edit') {
      const params = {_id: collection._id};
      this.router.navigate(['/dashboard/ecommerce/edit-collection'], {queryParams: params});
    }
    if(action == 'delete') {
      const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
        width: '600px',
        height: 'auto',
        data: {action: 'delete', item: 'collection'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.action) {
          collection.delete(() => {
            this.toastService.showSuccessRemove();     
            this.initTable();
          }, () => {
            this.toastService.showFailedRemove();
          })
        }
      });
    }
  }
  
  toggleActive(collection:Collection): void {    
    collection.save(() => {
      this.toastService.showSuccessSave();
    })    
  }

}
