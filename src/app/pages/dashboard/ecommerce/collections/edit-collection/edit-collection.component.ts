import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {switchMap, debounceTime, tap, finalize} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '@app/_services/util.service';
import {ToastService} from '@app/_services/toast.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@app/_services/auth.service';
import {Location} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import { Constants } from '@app/_configs/constant';
import * as UtilFunc from '@helper/util.helper';
import { Product } from '@app/_classes/product.class';
import { Collection } from '@app/_classes/collection.class';
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.scss']
})
export class EditCollectionComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  form:FormGroup;
  action:string = 'add';
  all_collections:any[] = [];
  parents:any[] = [];
  util = UtilFunc;
  user: any;  
  sticky: boolean;  
  uploading:boolean = false;
  isLoading:boolean = false;
  filteredProducts:Product[] = [];
  columnsToDisplay = ['name', 'type', 'brand', 'retail_price', 'action'];
  columnsToDisplay2 = ['name', 'sub_collections', 'products', 'action'];
  dataSource:any;
  subCollectionSource:any;
  parent: string;
  collections_with_level = [];
  _id:string = '';
  breadcrumb:any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService:AuthService,
    private utilService:UtilService,
    private toastService: ToastService,
    public collection: Collection,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
    this.collection.init();

    this.authService.currentUser.subscribe(user => {
      this.user = user;      
    });

    this.form = this.fb.group({      
      name: ['', [Validators.required]],
      selectedProduct: null
    });
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true); 
    this.utilService.get('product/collection', {}).subscribe(result => {
      if(result && result.body) {
        for(let c of result.body) {
          this.all_collections.push(c);
        }
      }
      for(let c of this.all_collections) {
        let pp = this.getAllParentCollections(c._id);
        let name = '-'.repeat(pp.length) + c.name;
        this.collections_with_level.push({
          _id: c._id,
          name: name,
          parents: pp
        })
      }
      this.setParents();
      this.setBreadcrumb();
    })    

    this.route.queryParams.subscribe(query => {            
      
      this.init();

      if (query){
        if(query._id) {
          this._id = query._id;   
          this.action = 'edit';
          this.collection.loadById(query._id, () => {            
            this.form.get('name').setValue(this.collection.name);
            this.parent = this.collection.parent ? this.collection.parent._id: 'root';
            this.setDataSource();
          }, () => {
            this.toastService.showFailed('No existing collection');
            this.location.back();
          });
        }
        if(query.parent) {
          this.parent = query.parent;
        }
        if(this.all_collections.length > 0) {
          this.setParents();
          this.setBreadcrumb();
        }        
      }
    });

    this.form.get('selectedProduct').valueChanges.pipe(
      debounceTime(300),
      tap(() => {
        this.isLoading = true;
        this.filteredProducts = [];
      }),
      switchMap(value => this.utilService.get('product/product', {range:'search', keyword: value})
        .pipe(
          finalize(() => this.isLoading = false),
          )
        )
      )
      .subscribe(response => {        
        let result:any = response;
        if(result && result.body) {
          for(let p of result.body) {
            let index = this.collection.products.findIndex(item => item._id == p._id);
            if(index==-1) {
              let product = new Product(this.authService, this.utilService);
              product.loadDetails(p);
              this.filteredProducts.push(product);
            }
          }
        }
      });  
  }

  init() {
    this.collection.init();
    this._id = ''; this.action = 'add';
    this.form.get('name').setValue('');
    this.setDataSource();
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

  setParents() {
    this.parents = [{_id: 'root', name: 'Root'}];
    let all_sub_collections = this.getAllSubCollections(null);    
    let sub_collections = [];
    if(this._id) {
      sub_collections = this.getAllSubCollections(this._id);
    }
    for(let c of all_sub_collections) {
      let index = sub_collections.findIndex(item => item._id == c._id);        
      if(index == -1 && c._id != this._id) {
        index = this.collections_with_level.findIndex(item => item._id == c._id);
        this.parents.push(this.collections_with_level[index]);
      }
    }
  }

  ngAfterViewInit() {
    
  }

  setDataSource() {    
    this.dataSource = new MatTableDataSource(this.collection.products);    
    this.dataSource.paginator = this.paginator;

    this.subCollectionSource = new MatTableDataSource(this.collection.children);    
    this.subCollectionSource.paginator = this.paginator2;
  }
  
  scroll = (event: any): void => {
    const num = event.srcElement.scrollTop;
    this.sticky = num > 64;
  }

  goBack() {
    this.location.back();
  }

  displayFn(product: Product) {
    if (product) { 
      return product.data.name; 
    }
  }

  addProduct(product:Product): void {
    if (!product) {
      return;
    }        
    this.collection.addProduct(product);
    this.selectedProduct.setValue('');
    this.setDataSource();
  }

  removeProduct(_id: string): void {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'Item'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {        
        let index = this.collection.products.findIndex(item => item._id == _id);
        if(index > -1)this.collection.products.splice(index, 1);        
        this.setDataSource();
      }
    });
  }
  
  uploadFile(files: any): void {
    this.uploading = true;
    this.utilService.uploadFile(files, result => {
      this.collection.image = result.body.path;
      this.uploading = false;
    }, error => {
      this.uploading = false;
      if(error === false) {
        this.toastService.showFailed('Please choose image file type');
      } else {
        this.toastService.showFailedUpload(); 
      }
    })
  }

  removeImage(path:any) {
    this.uploading = true;
    this.utilService.deleteFile(path, result => {      
      this.collection.image = null;      
      this.uploading = false;
    }, error => {
      this.uploading = false;
      this.toastService.showFailedRemove();
    })
  }

  getImagePath(path:string) {    
    return this.utilService.get_image(path);
  }

  handleAction(action: string, collection?:any) {
    if(action == 'add') {
      const params = {parent: this.collection._id};
      this.router.navigate(['/dashboard/ecommerce/edit-collection'], {queryParams: params});
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
            let index = this.collection.children.findIndex(item=>item._id == collection._id);
            if(index>-1) {
              this.collection.children.splice(index, 1);
              this.setDataSource();
            }
          }, () => {
            this.toastService.showFailedRemove();
          })
        }
      });
    }
  }

  getCollectionById(_id:string) {
    let index = this.all_collections.findIndex(item => item._id == _id);
    if(index>-1) {
      return this.all_collections[index];
    }
    return null;
  }

  getParentCollections() {
    let all_sub_collections = this.getAllSubCollections(null);
    if(this.collection.parent == null) {
      this.parents = this.getAllSubCollections(null);
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

  getAllSubCollections(_id:string) {    
    let collections = [];
    for(let c of this.all_collections) {
      if(_id == null && c.parent==null || (c.parent!=null && c.parent._id == _id)) {
        collections.push(c);
        let sub = this.getAllSubCollections(c._id);
        if(sub.length>0){
          collections = collections.concat(sub);
        }
      }
    }
    return collections;
  }

  submit(){
    if(this.form.valid){
      this.collection.name = this.nameInput.value;
      this.collection.parent = this.getCollectionById(this.parent);
      this.collection.save((result) => {
        this.toastService.callbackSuccessSave(result, Constants.message.successSaved, () => {
          this.location.back();
        }, true)
      }, () => {
        this.toastService.showFailedSave();
      })
    }    
  }

  get selectedProduct(): any {return this.form.get('selectedProduct'); }
  get nameInput(): any {return this.form.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
