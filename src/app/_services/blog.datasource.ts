import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { IBlog } from "@app/pages/dashboard/ecommerce/pages/blog/blog.component";
import { UtilService } from '@app/_services/util.service';
import * as UtilFunc from '@app/_helpers/util.helper';

export class BlogDataSource implements DataSource<IBlog> {
	private blogsSubject = new BehaviorSubject<IBlog[]>([]);
	private loadingSubject = new BehaviorSubject<boolean>(false);
	public loading = this.loadingSubject.asObservable();
  
	public data:IBlog[] = [];
	public totalElements: number = 0;
	util = UtilFunc;
  
	constructor(		
		private utilService: UtilService
	) {

	}

	connect(collectionViewer: CollectionViewer): Observable<IBlog[] | readonly IBlog[]> {
		return this.blogsSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.blogsSubject.complete();
		this.loadingSubject.complete();
	}

	loadBlogs(
		filter?:any,
		page?:number,
		size?:number)
	{
		this.loadingSubject.next(true);
		if(typeof page =='undefined') page = 0;
		if(!size) size = 10;		
		const query = {...filter, page, size};
		this.data = [];
		this.utilService.get('sale/blog', query).subscribe(result => {
			if(result && result.body) {
				this.data = result.body.data;				
				this.totalElements = result.body.totalElements;				
				this.blogsSubject.next(this.data);
			}
			this.loadingSubject.next(false);	
			this.util.scrollToTop();
		}, () => {
			this.loadingSubject.next(false);
		});
	}
}
