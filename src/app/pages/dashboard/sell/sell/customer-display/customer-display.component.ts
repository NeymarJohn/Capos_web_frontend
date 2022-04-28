import {Component, OnInit, ViewChild, AfterViewInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy } from '@angular/core';
import {CdkPortal, DomPortalOutlet} from '@angular/cdk/portal';

@Component({
  selector: 'app-customer-display',
  templateUrl: './customer-display.component.html',
  styleUrls: ['./customer-display.component.scss']  
})
export class CustomerDisplayComponent implements OnInit, AfterViewInit, OnDestroy {

  // STEP 1: get a reference to the portal
  @ViewChild(CdkPortal) portal: CdkPortal;

  // STEP 2: save a reference to the window so we can close it
  private externalWindow = null;
  private host: DomPortalOutlet;  

  // STEP 3: Inject all the required dependencies for a PortalHost
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,    
    private injector: Injector){}

  ngOnInit():void {
    
  }

  ngAfterViewInit(){        
    
  }

  openWindow() {
    if(this.externalWindow) return;
    // STEP 4: create an external window
    this.externalWindow = window.open('', '', 'scrollbars=no,resizable=no,width=1000,height=800,left=200,top=200');
    this.externalWindow.addEventListener("beforeunload", (e) => {
      this.closeWindow();
    });

    document.querySelectorAll('link, style').forEach(htmlElement => {
      this.externalWindow.document.head.appendChild(htmlElement.cloneNode(true));
    });

    // STEP 5: create a PortalHost with the body of the new window document    
    this.host = new DomPortalOutlet(
      this.externalWindow.document.body,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector
    );

    // STEP 6: Attach the portal    
    this.host.attach(this.portal);
  }

  closeWindow() {
    if(!this.externalWindow) return;    
    this.externalWindow.close();
    this.host.detach();    
    this.externalWindow = null;
  }

  ngOnDestroy(){
    // STEP 7: close the window when this component destroyed
    this.closeWindow();
  }
}
