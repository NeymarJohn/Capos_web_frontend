import {Component, OnDestroy, OnInit, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {MatDialog} from '@angular/material/dialog';
import {NewItemDlgComponent} from '../../new-item-dlg/new-item-dlg.component';
import {UtilService} from '@app/_services/util.service';
import {ToastService} from '@app/_services/toast.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '@app/_services/auth.service';
import {Location} from '@angular/common';
import { Constants } from '@app/_configs/constant';
import * as UtilFunc from '@helper/util.helper';
import { RemoveItemDlgComponent } from '@app/pages/dashboard/products/remove-item-dlg/remove-item-dlg.component';
import { ConfirmDlgComponent } from '@app/pages/layouts/confirm-dlg/confirm-dlg.component';
import { EditAttributeValueDlgComponent } from '@app/pages/dashboard/products/products/edit-attribute-value-dlg/edit-attribute-value-dlg.component';
import { Product } from '@app/_classes/product.class';
import { IVariants } from '@app/_classes/product.class';
import { IVariantProduct } from '@app/_classes/product.class';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddComponent implements OnInit, OnDestroy {
  util = UtilFunc;
  private user: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  
  form: FormGroup;
  ctrl_values = {
    tag: [], type: [], brand: [], supplier: [], attribute: [], tax: [], outlet: []
  }
  tags = [];
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;  
  enabled: boolean = true;
  touch: boolean = true;
  product_images = [];
  origin_images = [];  
  tracking_inv = false;
  variant_inv = false;
  supply_price = 0;
  retail_price = 0;
  markup = 0;
  variants:IVariants[] = [{attribute:'', value:[]}];  
  variant_products:IVariantProduct[] = [];
  sticky: boolean;  
  product_id: string = '';  
  loading: boolean = false;
  uploading: boolean = false;
  mode:string = 'add';
  product_name: string = '';
  permission = {
    brand: false, supplier: false, type: false, price_prompt: false
  };
  editorConfig: AngularEditorConfig = {
    editable: true,
    toolbarHiddenButtons: [
      ['insertImage', 'insertVideo']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private utilService: UtilService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: ActivatedRoute,
    private location: Location,
    public product: Product
  ) {
    this.product.init();

    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if(this.user.role) {
        this.permission.brand = this.user.role.permissions.includes('create_brand');
        this.permission.type = this.user.role.permissions.includes('create_product_type');
        this.permission.supplier = this.user.role.permissions.includes('create_supplier');
        this.permission.price_prompt = this.user.role.permissions.includes('price_prompt');
      }
    });

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      handle: ['', [Validators.required]],
      description: [''],      
      type: ['', [Validators.required]],
      brand: ['', [Validators.required]],   
      sku: [''],
      supplier: ['', [Validators.required]],
      barcode: ['', [Validators.required]],
      supplier_code: ['', [Validators.required]],
      supply_price: ['', [Validators.required]],
      inventory: [''],
      reorder_point: [''],
      reorder_amount: [''],
      outlet: [''],
      tax: [''],
      markup: [''],
      retail_price: ['']
    });

    this.router.queryParams.subscribe(query => {
      if (query && query._id) {
        this.mode = 'edit';
        this.product.loadById(query._id, () => {
          const data = this.form.value;
          Object.keys(data).forEach(key => {
            if(['type', 'brand', 'tax', 'supplier'].includes(key)) {
              this.form.get(key).setValue(this.product.data[key]._id);
            } else {
              this.form.get(key).setValue(this.product.data[key]);
            }
          })          
          this.product_name = this.product.data.name;
          this.variant_inv = this.product.data.variant_inv;
          this.tracking_inv = this.product.data.tracking_inv;
          this.variant_products = this.product.data.variant_products;
          this.variants = this.product.data.variants;
          this.tags = this.product.data.tag;
          this.enabled = this.product.data.enabled;
          this.touch = this.product.data.touch;
          this.product_images = this.product.data.images;
          this.supply_price = this.product.data.supply_price
          this.retail_price = this.product.data.retail_price;
          this.markup = this.product.data.markup;
        }, () => {
          this.toastService.showWarning(Constants.message.noExistingProduct);
          this.goBack();
        })
      } else {
        if(query.keyword) {
          if(!isNaN(query.keyword)) {
            this.form.get('barcode').setValue(query.keyword);
          } else {
            this.form.get('name').setValue(query.keyword);
          }
        }
      }
    });
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    this.initProperty();
  }

  initProperty(): void {    
    Object.keys(this.ctrl_values).forEach(key => {
      let url = 'product/' + key;
      if(key == 'tax') url = 'sale/salestax';
      if(key == 'outlet') url = 'sell/outlet';
      this.utilService.get(url, {}).subscribe(result => {
        this.ctrl_values[key] = result.body;
      });
    })    
  }

  scroll = (event: any): void => {
    const num = event.srcElement.scrollTop;
    this.sticky = num > 64;
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if(!this.tags.includes(value)){
      this.tags.push(value);
    }
    this.tagInput.nativeElement.value = '';    
  }

  removeTag(tag: any): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = event.value.trim();
    if (value != '' && !this.tags.includes(value)) {
      this.tags.push(value.trim());      
    }
    this.tagInput.nativeElement.value = '';    
  }

  addItem(item:string): void {    
    let ctrl = this.form.get(item);    
    if(ctrl.value == 'addNew') {
      ctrl.setValue('');
      this.handleAddItem(item, 'product/' + item, (data) => {
        this.ctrl_values[item].push(data);
        ctrl.setValue(data._id);
      })
    }
  }

  handleAddItem(item_name: string, url: string, callback:any) {
    const dialogRef = this.dialog.open(NewItemDlgComponent, {
      width: '500px',
      data: {item_name: item_name, url: url, user: this.user}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.body) {
        callback(result.body.result);
      }
    });
  }

  showVariants() {
    if(this.variant_inv) {
      this.variants = [{attribute:'', value:[]}];
      this.variant_products = [];
    }
  }

  uploadFiles(files: any): void {    
    this.uploading = true;
    this.utilService.uploadFiles(files, result => {
      for(let img of result.body) {
        this.product_images.push(img.path);
      }
      this.uploading = false;
    }, error => {
      this.uploading = false;
      if(error === false) {
        this.toastService.showFailed('Please choose image file type');
      } else {
        this.toastService.showFailedUpload(); 
      }
    });
  }

  uploadFile(files: any, product:any): void {
    this.utilService.uploadFile(files, result => {
      product.image = result.body.path;
    }, error => {
      if(error === false) {
        this.toastService.showFailed('Please choose image file type');
      } else {
        this.toastService.showFailedUpload(); 
      }
    })
  }

  newVariant(): void {
    this.variants.push({attribute: '', value: []});
  }

  removeVariant(attrIndex): void {
    let values = this.variants[attrIndex].value.length;
    this.removeItem('Variant', () => {
      this.variants.splice(attrIndex, 1);      
      if(values>0) this.genVariantProducts(attrIndex, -1, 'remove');
    });
  }

  setPrice(element: string): void {
    this.supply_price = this.form.get('supply_price').value;
    let ctrl_markup = this.form.get('markup'), ctrl_retail_price = this.form.get('retail_price');
    this.markup = (ctrl_markup.value) ? Number(ctrl_markup.value): 0;
    this.retail_price = (ctrl_retail_price.value) ? Number(ctrl_retail_price.value): this.supply_price;
    if (element === 'supply_price' || element === 'markup') {      
      this.retail_price = this.supply_price * (1 + this.markup / 100);         
      ctrl_retail_price.setValue(this.util.formatNumber(this.retail_price));   
    } else {
      if(this.supply_price > 0) {
        this.markup = 100 * (this.retail_price - this.supply_price) / this.supply_price;        
      }
      ctrl_markup.setValue(this.util.formatNumber(this.markup));
    }    
  }

  setVariantPrice(element: string='', productIndex=-1) {    
    if(productIndex == -1) {
      for(let product of this.variant_products) {
        product.supply_price = parseFloat(this.supply_price.toFixed(2));
        product.retail_price = parseFloat((this.supply_price * (1 + product.markup/100)).toFixed(2));
      }
    } else {
      let product = this.variant_products[productIndex];      
      if(element == 'supply_price' || element == 'markup') {
        product.retail_price = parseFloat((product.supply_price * (1 + product.markup/100)).toFixed(2));
      } else {
        if(Number(product.supply_price)>0) {
          product.markup = parseFloat((100 * (product.retail_price - product.supply_price) / product.supply_price).toFixed(2));
        } else {
          product.markup = 0;
        }
      }
    }
  }

  addAttrValue(event: MatChipInputEvent, attrIndex:number): void {
    const input = event.input;
    const value = event.value.trim();
    if (value && !this.variants[attrIndex].value.includes(value)) {
      this.variants[attrIndex].value.push(value.trim());
      this.genVariantProducts(attrIndex, this.variants[attrIndex].value.length-1, 'add');
    }    
    if (input) {
      input.value = '';
    }
  }

  removeAttrValue(value, attrIndex): void {
    const index = this.variants[attrIndex].value.indexOf(value);
    if (index !== -1) {
      this.removeItem('Attribute value', () => {
        this.variants[attrIndex].value.splice(index, 1);
        this.genVariantProducts(attrIndex, index, 'remove');
      });
    }
  }

  addAttribute(attrIndex: number): void {
    if (this.variants[attrIndex].attribute === 'addNew') {
      this.variants[attrIndex].attribute = '';
      let item = 'attribute';
      this.handleAddItem(item, 'product/' + item, (data) => {        
        this.ctrl_values[item].push(data);
        this.variants[attrIndex].attribute = data._id;
      })
    } 
  }

  checkSelected(id: string) {
    for(let i=0; i<this.variants.length;i++) {
      if(this.variants[i].attribute == id) {
        return true;
      }
    }
    return false;
  }

  editAttrValue(): void {
    this.dialog.open(EditAttributeValueDlgComponent, {
      width: '600px', maxHeight:'550px', data: {variants: this.variants, attributes: this.ctrl_values.attribute}
    });
  }

  genVariantProducts(a_index:number, v_index:number, mode:string): void {
    const variants = this.variants.filter(variant => variant.attribute && variant.value.length);
    const varLen = variants.length;        
    if(mode == 'add') {
      for(let i=0;i<this.variant_products.length;i++) {
        let pair = this.variant_products[i].pair;
        if(pair.length-1 < a_index) {
          this.variant_products[i].pair.push(v_index);
          this.variant_products[i].pair_str = this.getPairString(this.variant_products[i].pair);
        }
      }
      if (varLen > 0) {
        for(let i=0;i<variants[0].value.length;i++) {
          if(varLen == 1) {
            this.pushVariantProduct([i]);
          } else {
            for(let j=0;j<variants[1].value.length;j++) {
              if(varLen == 2) {
                this.pushVariantProduct([i, j]);
              } else {
                for(let k=0;k<variants[2].value.length;k++) {
                  this.pushVariantProduct([i, j, k]);
                }
              }
            }
          }
        }
      }
    } else {
      let i = 0;
      if(this.variant_products.length>0){
        do {
          let pair = this.variant_products[i].pair;
          if(pair[a_index] == v_index || v_index == -1) {
            pair.splice(a_index, 1);
            let pair_str = this.getPairString(pair);
            let index = this.variant_products.findIndex(item => item.pair_str == pair_str);          
            if(pair.length < varLen || index > -1 || pair_str == '') {
              this.variant_products.splice(i, 1);
            } else {
              this.variant_products[i].pair = pair;
              this.variant_products[i].pair_str = pair_str;
              i++;
            }
          } else {
            if(pair[a_index] > v_index) {
              pair[a_index]--;
              this.variant_products[i].pair = pair;
              this.variant_products[i].pair_str = this.getPairString(pair);
            }
            i++;
          }
        } while (i < this.variant_products.length);
      }
    }  

    function compare( a:any, b:any ) {
      if ( a.pair_str < b.pair_str ){
        return -1;
      }
      if ( a.pair_str > b.pair_str ){
        return 1;
      }
      return 0;
    }
    
    this.variant_products.sort( compare ); 
  }

  getNewVariantProduct() {
    let variantProduct:IVariantProduct = {
      _id: '',
      pair: [],
      pair_str: '',
      name: '',
      sku: '',
      supplier_code: '',
      supply_price: parseFloat(this.util.formatNumber(this.supply_price)),
      retail_price: parseFloat(this.util.formatNumber(this.retail_price)),
      enabled: true,
      inventory: 0,
      reorder_point: 0,
      reorder_amount: 0,
      markup: parseFloat(this.util.formatNumber(this.markup)),
      image: null,
      expanded: false
    };    
    return variantProduct;
  }

  getPairString(pair:any) {
    let str = [];
    for(let p of pair) {
      str.push(('0' + String(p)).substr(-2));
    }
    return str.join('_');
  }

  getVariantProductName(product:any) {
    let pair = product.pair;
    let str = [];
    for(let i=0;i<pair.length;i++) {
      str.push(this.variants[i].value[pair[i]]);
    }
    return str.join('/');
  }

  pushVariantProduct(new_pair:any) {
    let index = this.variant_products.findIndex(item => item.pair_str == this.getPairString(new_pair));    
    if(index == -1) {
      let product = this.getNewVariantProduct();
      product.pair = new_pair;
      product.pair_str = this.getPairString(product.pair);
      this.variant_products.push(product);
    }
  }

  removeItem(item_name:string, callback: any) {    
    const dialogRef = this.dialog.open(RemoveItemDlgComponent, {
      width: '500px', data: {action: 'delete', item: item_name}
    });
    dialogRef.afterClosed().subscribe(result => {      
      if (result && result.action==='delete') {        
        callback();
      }
    });
  }

  removeProduct(index:number) {
    this.removeItem('Vairant Product', () => {
      this.variant_products.splice(index, 1);
    })
  }

  goBack(): void {
    this.location.back();
  }

  getNewBarcode(callback?:Function) {
    this.utilService.get('product/new_barcode', {}).subscribe(result => {
      if(result && result.body) {
        this.form.get('barcode').setValue(result.body.barcode);
        if(callback) callback();
      }
    }, error => {
      this.toastService.showFailed('Failed to generate. Try again later.');
    })
  }

  submit(): void {    
    if(this.form.get('barcode').value == '') {
      const dialogRef = this.dialog.open(ConfirmDlgComponent, {
        width: '500px',
        data: {
          title: 'Confirm Barcode', 
          msg: 'Are you sure to want to generate barcode automatically?',
          ok_button: 'OK',
          cancel_button: 'Cancel'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result && result == 'process') {        
          this.getNewBarcode(() => {
            this._save();
          });
        } 
      });
    } else {
      this._save();
    }
  }

  _save() {
    if (this.form.invalid) {
      this.toastService.showFailed('Please enter fields correctly');
      return;
    }
    const data = this.form.value;
    data.private_web_address = this.user.private_web_address;
    data.user_id = this.user._id;
    data.tracking_inv = this.tracking_inv;
    data.variant_inv = this.variant_inv;
    data.enabled = this.enabled;
    data.touch = this.touch;
    data.tag = this.tags;

    if(!this.tracking_inv || this.variant_inv) {
      data.inventory = 0;
      data.reorder_point = 0;
      data.reorder_amount = 0;
    }
    if (this.variant_inv) {
      data.sku = '';
    }
    
    if (this.variant_inv && this.variant_products.length) {
      data.variant_products = [...this.variant_products];
      for(let product of data.variant_products) {
        product.name = this.getVariantProductName(product);        
      }
      data.variants = this.variants;
    }
    data.images = this.product_images;
    this.loading = true;
    this.product.loadDetails(data);    
    this.product.save(result => {
      this.loading = false;
      if(result.body.status && result.body.status == 'already_exist') {
        let fields = result.body.fields;
        if(fields.indexOf('name')!=-1){
          this.toastService.showWarning('Already existing product name');
        }
        if(fields.indexOf('barcode')!=-1){
          this.toastService.showWarning('Already existing barcode');
        }
      } else {
        this.goBack();      
        this.toastService.showSuccessSave();
      }
    }, () => {
      this.loading = false;
      this.toastService.showFailedSave();
    })
  }

  chooseProductImageFile(files:any) {
    for(let i=0;i<files.length;i++) {
      let tmp = {
        type: 'file',
        file: files[i]
      }
      this.getProductImageSrc(tmp);
      this.product_images.push(tmp)
    }
  }

  chooseVariantProductImageFile(files: any, product:any) {
    let tmp = {
      type: 'file',
      file: files[0]
    }
    this.getProductImageSrc(tmp);
    product.image = tmp;
  }

  removeProductImage(path:any, mode: string, product: any = null) {
    this.removeItem('Image', () => {
      this.uploading = true;
      this.utilService.deleteFile(path, result => {
        if(mode == 'product') {
          let index = this.product_images.indexOf(path);
          this.product_images.splice(index, 1);
        } else {
          product.image = null;      
        }
        this.uploading = false;
      }, error => {
        this.uploading = false;
        this.toastService.showFailedRemove();
      })
    })
  }

  getProductImageSrc(file:any) {
    if(file.type == 'file') {
      var reader = new FileReader();     
      reader.onload = (e) => {
        file.src = e.target.result;
      }
      reader.readAsDataURL(file.file); // convert to base64 string
    } else {
      file.src = this.utilService.get_image(file.path);
    }
  }

  getImagePath(path:string) {    
    return this.utilService.get_image(path);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scroll, true);
  }

  onChangeName() {
    let s = this.nameInput.value;
    this.handleInput.setValue(this.util.getSlug(s));
  }

  get nameInput(): any {return this.form.get('name'); }
  get nameInputError(): string {
    if (this.nameInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get handleInput(): any {return this.form.get('handle'); }
  get handleInputError(): string {
    if (this.handleInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get typeInput(): any {return this.form.get('type'); }
  get typeInputError(): string {
    if (this.typeInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get barcodeInput(): any {return this.form.get('barcode'); }
  get barcodeInputError(): string {
    if (this.barcodeInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get brandInput(): any {return this.form.get('brand'); }
  get brandInputError(): string {
    if (this.brandInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get supplierInput(): any {return this.form.get('supplier'); }
  get supplierInputError(): string {
    if (this.supplierInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get supplierCodeInput(): any {return this.form.get('supplier_code'); }
  get supplierCodeInputError(): string {
    if (this.supplierCodeInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get outletInput(): any {return this.form.get('outlet'); }
  get outletInputError(): string {
    if (this.outletInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get taxInput(): any {return this.form.get('tax'); }
  get taxInputError(): string {
    if (this.taxInput.hasError('required')) {return Constants.message.requiredField; }    
  }

  get supplyPriceInput(): any {return this.form.get('supply_price'); }
  get supplyPriceInputError(): string {
    if (this.supplyPriceInput.hasError('required')) {return Constants.message.requiredField; }    
  }
}
