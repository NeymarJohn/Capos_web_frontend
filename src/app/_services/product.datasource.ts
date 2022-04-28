import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { Product } from '@app/_classes/product.class';
import { AuthService } from '@app/_services/auth.service';
import { UtilService } from '@app/_services/util.service';
import * as UtilFunc from '@app/_helpers/util.helper';

export class ProductDataSource implements DataSource<Product> {
	private productsSubject = new BehaviorSubject<Product[]>([]);
	private loadingSubject = new BehaviorSubject<boolean>(false);
	public loading = this.loadingSubject.asObservable();
  
	public data:Product[] = [];
	public totalElements: number = 0;
	util = UtilFunc;
  
	constructor(
		private authService: AuthService,
		private utilService: UtilService
		) {

	}

	connect(collectionViewer: CollectionViewer): Observable<Product[] | readonly Product[]> {
		return this.productsSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.productsSubject.complete();
		this.loadingSubject.complete();
	}

	loadProducts(
		filter?:any,
		page?:number,
		size?:number,
		sort_field?: string,
		sort_order?: number,
		callback?:Function)
	{
		this.loadingSubject.next(true);
		if(typeof page =='undefined') page = 0;
		if(!size) size = 30;
		if(!sort_field) sort_field = 'name';
		if(!sort_order) sort_order = 1;
		const query = {...filter, page, size, sort_field, sort_order}; 			
		this.data = [];		
		this.utilService.get('product/product', query).subscribe(result => {
			if(result && result.body) {				
				for(let p of result.body.data) {					
					let product = new Product(this.authService, this.utilService);					
					product.loadDetails(p);
					this.data.push(product);
				}
				this.totalElements = result.body.totalElements;				
				this.productsSubject.next(this.data);
			}
			this.loadingSubject.next(false);	
			this.util.scrollToTop();
			if(callback) callback(this.data);
		}, () => {
			this.loadingSubject.next(false);
		});
	}

	searchProducts(filter:any, page:number, size:number, sort:any, callback?:Function) {
		this.loadingSubject.next(true);
		let sort_field = sort.field, sort_order = sort.order;
		const query = {...filter, page, size, sort_field, sort_order}; 	
		this.utilService.get('product/product', query).subscribe(result => {
			let data:Product[] = [];
			if(result && result.body) {
				for(let p of result.body.data) {
					let product = new Product(this.authService, this.utilService);
					product.loadDetails(p);
					data.push(product);
				}
			}
			this.loadingSubject.next(false);				
			if(callback) callback({data: data, total: result.body.totalElements});
		}, () => {
			this.loadingSubject.next(false);
		});
	}

	loadProductsByData(data:any) {
		this.totalElements = data.totalElements;				
		this.productsSubject.next(data.data);
		this.util.scrollToTop();
	}
}
