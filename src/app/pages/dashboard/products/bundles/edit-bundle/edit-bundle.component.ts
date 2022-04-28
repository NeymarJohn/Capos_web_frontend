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
import {RemoveItemDlgComponent} from '@page/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Bundle } from '@app/_classes/bundle.class';
import { VariantsDlgComponent } from '../variants-dlg/variants-dlg.component';

@Component({
  selector: 'app-edit-bundle',
  templateUrl: './edit-bundle.component.html',
  styleUrls: ['./edit-bundle.component.scss']
})
export class EditBundleComponent implements OnInit, AfterViewInit {
  @ViewChild('paginator') paginator!: MatPaginator;  

  form:FormGroup;
  action:string = 'add';    
  util = UtilFunc;
  user: any;  
  sticky: boolean;    
  isLoading:boolean = false;
  filteredProducts:Product[] = [];
  columnsToDisplay = ['no', 'name', 'barcode', 'type', 'retail_price', 'action'];  
  dataSource:any;    
  _id:string = '';  

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService:AuthService,
    private utilService:UtilService,
    private toastService: ToastService,
    public bundle: Bundle,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {
    this.bundle.init();

    this.authService.currentUser.subscribe(user => {
      this.user = user;      
    });

    this.form = this.fb.group({      
      name: ['', [Validators.required]],
      count: ['', [Validators.required]],
      price: ['', [Validators.required]],
      discount: ['', [Validators.required]],
      selectedProduct: null
    });
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);     

    this.route.queryParams.subscribe(query => {                  
      this.init();
      if (query && query._id){
        this._id = query._id;   
        this.action = 'edit';
        this.bundle.loadById(query._id, () => {             
          this.form.get('name').setValue(this.bundle.name);
          this.form.get('count').setValue(this.bundle.count);
          this.form.get('price').setValue(this.bundle.price);
          this.form.get('discount').setValue(this.bundle.discount);
          this.setDataSource();
        }, () => {
          this.toastService.showFailed('No existing bundle');
          this.location.back();
        });
      } else {
        this.utilService.get('product/new_bundle_id').subscribe(result => {
          if(result && result.body) {
            this.bundle.bundle_id = result.body.bundle_id;
          }
        })
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
            let index = this.bundle.products.findIndex(item => item.product._id == p._id && item.variant_id == '');
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
    this.bundle.init();
    this._id = ''; this.action = 'add';
    this.form.get('name').setValue('');
    this.form.get('count').setValue('');
    this.form.get('price').setValue('');
    this.form.get('discount').setValue('');
    this.setDataSource();
  }

  ngAfterViewInit() {
    
  }

  setDataSource() {    
    this.dataSource = new MatTableDataSource(this.bundle.products);    
    this.dataSource.paginator = this.paginator;
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

  displayAutocomplete(product:Product) {
    let keyword = this.selectedProduct.value.toLowerCase();
    let result = '';
    if(product.data.name.toLowerCase().includes(keyword)) {
        result = product.data.name;
    } else {
      result = product.data.barcode;
    }
    return '<span>' + result + '</span>';    
  }

  addProduct(product:Product): void {
    if (!product) {
      return;
    }        
    if(product.data.variant_inv && product.data.variant_products.length>0) {
      const dialogRef = this.dialog.open(VariantsDlgComponent, {
        width: '500px',
        data: {product_name: product.data.name, variant_products: product.data.variant_products}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result.variant_id) {  
          this.bundle.addProduct(product, result.variant_id);
          this.setDataSource();
        }
      });
    } else {
      this.bundle.addProduct(product, '');
      this.setDataSource();
    }    
    this.selectedProduct.setValue('');
    
  }

  removeProduct(index: number): void {
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '400px',
      data: {action: 'delete', item: 'Item'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.action == 'delete') {  
        this.bundle.removeProduct(index);        
        this.setDataSource();
      }
    });
  }

  hintName() {
    let result = '';
    if(this.form.get('count').value) result += this.form.get('count').value;
    if(this.form.get('price').value) result += ' For ' + this.util.getPriceWithCurrency(this.form.get('price').value);
    this.form.get('name').setValue(result);
  }

  submit(){
    if(this.form.valid){
      this.bundle.name = this.nameInput.value;      
      this.bundle.count = this.countInput.value;      
      this.bundle.price = this.priceInput.value;      
      this.bundle.discount = this.discountInput.value;      
      this.bundle.save((result) => {
        this.toastService.showSuccessSave();
        this.router.navigate(['dashboard/product/mix-and-match']);
      }, () => {
        this.toastService.showFailedSave();
      })
    }    
  }

  getIndex(index) {
    return this.paginator.pageIndex * this.paginator.pageSize + index + 1; 
  }

  get selectedProduct(): any {return this.form.get('selectedProduct'); }
  get nameInput(): any {return this.form.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get priceInput(): any {return this.form.get('price'); }
  get priceInputError(): string {
    if (this.priceInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get countInput(): any {return this.form.get('count'); }
  get countInputError(): string {
    if (this.countInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get discountInput(): any {return this.form.get('discount'); }
  get discountInputError(): string {
    if (this.discountInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
