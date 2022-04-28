import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { UtilService } from '@app/_services/util.service';

export class CashDataSource implements DataSource<any> {
	private cashSubject = new BehaviorSubject<any[]>([]);
	private loadingSubject = new BehaviorSubject<boolean>(false);
	public loading = this.loadingSubject.asObservable();
  
	public data:any[] = [];
	public totalElements: number = 0;
  
	constructor(
		private utilService: UtilService
	) {

	}

	connect(collectionViewer: CollectionViewer): Observable<any[] | readonly any[]> {
		return this.cashSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.cashSubject.complete();
		this.loadingSubject.complete();
	}

	load(
		filter?:any,
		page?:number,
		size?:number)
	{
		this.loadingSubject.next(true);
		if(typeof page =='undefined') page = 0;
		if(!size) size = 30;		
		const query = {...filter, page, size}; 		
		this.data = [];
		this.totalElements = 0;
		this.utilService.get('sell/cash', query).subscribe(result => {
			if(result && result.body) {
                this.data = result.body.data;				
				this.totalElements = result.body.totalElements;				
				this.cashSubject.next(this.data);
			}
			this.loadingSubject.next(false);
		}, () => {
			this.loadingSubject.next(false);
		});
	}
}