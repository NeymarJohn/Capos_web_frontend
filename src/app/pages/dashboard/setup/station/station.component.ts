import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from '@app/_configs/constant';
import { UtilService } from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from '@app/_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})

export class StationComponent implements OnInit {
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(MatPaginator) matPaginator: MatPaginator;
  stationColumns: string[] = ['no', 'stationID', 'name', 'private_web_address'];
  dataSource: any;
  pageData = [];
  selectStationID: string;

  private_web_address: String = "";
  printers: string[];
  receipterPrinter1Status: boolean = false;
  receipterPrinter1: string = "";
  receipterPrinter2Status: boolean = false;
  receipterPrinter2: string = "";
  windowsFontUsed: boolean = false;
  font: string = "";
  width: number;
  cashDrawerStatus: boolean = false;
  cashDrawer: string = "";
  lowVoltageUsed: boolean = false;
  barcodeReaderStatus: boolean = false;
  barcodeReader: string = "";
  reportPrinterStatus: boolean = false;
  reportPrinter: string = "";
  barcodeWriterStatus: boolean = false;
  barcodeWriter: string = "";
  mediaType: string = "";
  scaleStatus: boolean = false;
  scale: string = "";
  form: FormGroup;
  deviceInfo = null;

  submitDisabled = true;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private utilService: UtilService,
    private deviceService: DeviceDetectorService,
    public jwtHelper: JwtHelperService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.getDevice()
  }

  ngOnInit(): void {
    this.initForm()
    this.initTable()

    const tkn = this.authService.getToken();
    const decoded = this.jwtHelper.decodeToken(tkn);
    this.private_web_address = decoded.private_web_address;

    // WebSocket settings
    JSPM.JSPrintManager.auto_reconnect = true;
    JSPM.JSPrintManager.start();
    JSPM.JSPrintManager.WS.onStatusChanged = () => {
      if (this.jspmWSStatus()) {
        // get client installed printers
        JSPM.JSPrintManager.getPrinters().then((myPrinters: string[]) => {
          this.printers = myPrinters;
          console.log(this.printers);
        });
      }
    };
  }

  openConfirmDialog(type: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: type === "add" ? 'Are you sure want to add new one station?' : 'Are you sure want to delete this station?',
        buttonText: {
          ok: 'AGREE',
          cancel: 'DISMISS'
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        if (type === "add") {
          this.onAddStation();
        } else if (type === "delete") {
          this.deleteStation();
        }
      }
    });
  }

  getDevice(): void {
    this.deviceInfo = this.deviceService.getDeviceInfo()
  }

  // Check JSPM WebSocket status
  jspmWSStatus() {
    if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Open) {
      return true;
    } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Closed) {
      alert('JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm');
      return false;
    } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Blocked) {
      alert('JSPM has blocked this website!');
      return false;
    }
  }

  initTable(): void {
    this.utilService.get('station/station', {}).subscribe(result => {
      if (result && result.body) {
        this.pageData = result.body;
      } else {
        this.pageData = [];
      }
      this.dataSource = new MatTableDataSource(this.pageData);
      this.dataSource.sort = this.matSort;
      this.dataSource.paginator = this.matPaginator;
    });
  }

  initForm(): void {
    this.form = this.fb.group({
      stationID: ['', Validators.required],
      stationName: ['', Validators.required],
      storeID: ['', Validators.required],
    });
  }

  onStationRowSelect(id: string): void {
    this.getDevice()
    this.selectStationID = id
    this.utilService.get('station/station', { _id: id }).subscribe(result => {
      if (result && result.body) {
        this.form = this.fb.group({
          stationID: [result.body.stationID, Validators.required],
          stationName: [result.body.name, Validators.required],
          storeID: [result.body.private_web_address, Validators.required],
        });
        this.receipterPrinter1 = result.body.receipterPrinter1 || "";
        this.receipterPrinter1Status = Boolean(result.body.receipterPrinter1)
        this.receipterPrinter2 = result.body.receipterPrinter2 || "";
        this.receipterPrinter2Status = Boolean(result.body.receipterPrinter2)
        this.font = result.body.font || "";
        this.windowsFontUsed = Boolean(result.body.font)
        this.width = result.body.width || null;
        this.cashDrawer = result.body.cashDrawer || "";
        this.cashDrawerStatus = Boolean(result.body.cashDrawer)
        this.lowVoltageUsed = result.body.lowVoltageUsed;
        this.barcodeReader = result.body.barcodeReader;
        this.barcodeReaderStatus = Boolean(result.body.barcodeReader);
        this.reportPrinter = result.body.reportPrinter || "";
        this.reportPrinterStatus = Boolean(result.body.reportPrinter)
        this.barcodeWriter = result.body.barcodeWriter;
        this.mediaType = result.body.mediaType;
        this.barcodeWriterStatus = Boolean(result.body.barcodeWriter)
        this.scale = result.body.scale || "";
        this.scaleStatus = Boolean(result.body.scale)
        if (this.deviceInfo.userAgent === result.body.deviceInfo) {
          this.submitDisabled = false;
        } else {
          this.submitDisabled = true;
        }
      }
    })
  }

  onAddStation(): void {
    this.getDevice()

    const data = {
      private_web_address: this.private_web_address,
      deviceType: this.deviceInfo.deviceType,
      deviceInfo: this.deviceInfo.userAgent
    }
    this.utilService.post('station/station', data).subscribe((res) => {
      if (res) {
        this.toastService.showSuccess('Station create successfully');
        this.initTable()
      }
    });

  }

  submit(): void {
    if (this.form.invalid) {
      this.toastService.showFailed('Please, fill the required fields!');
      return;
    }

    if (!this.selectStationID) {
      this.toastService.showFailed('Please, select one station!');
      return;
    }

    const data = {
      _id: this.selectStationID,
      stationID: this.form.get('stationID').value,
      name: this.form.get('stationName').value,
      private_web_address: this.form.get('storeID').value,
      receipterPrinter1: this.receipterPrinter1,
      receipterPrinter2: this.receipterPrinter2,
      cashDrawer: this.cashDrawer,
      lowVoltageUsed: this.lowVoltageUsed,
      barcodeReader: this.barcodeReader,
      font: this.font,
      width: this.width,
      reportPrinter: this.reportPrinter,
      barcodeWriter: this.barcodeWriter,
      mediaType: this.mediaType,
      scale: this.scale
    }
    this.utilService.put('station/station', data).subscribe((res) => {
      if (res && res.body) {
        if (res.body.status === "already_exist") {
          this.toastService.showFailed('Station already exist');
        } else {
          this.toastService.showSuccess('Station update successfully');
          this.initTable()
        }

      }
    });
  }

  deleteStation(): void {
    if (!this.selectStationID) {
      this.toastService.showFailed('Please, select one station!');
      return;
    }

    this.utilService.delete('station/station?_id=' + this.selectStationID).subscribe(result => {
      if (result) {
        this.toastService.showSuccess('Station delete successful!');
        this.initTable();
        this.initForm();
        this.receipterPrinter1 = "";
        this.receipterPrinter1Status = false;

        this.receipterPrinter2 = "";
        this.receipterPrinter2Status = false;

        this.font = "";
        this.windowsFontUsed = false;

        this.width = null;

        this.cashDrawer = "";
        this.cashDrawerStatus = false;

        this.lowVoltageUsed = false;

        this.barcodeReader = "";
        this.barcodeReaderStatus = false;

        this.reportPrinter = "";
        this.reportPrinterStatus = false;

        this.barcodeWriter = "";
        this.mediaType = "";
        this.barcodeWriterStatus = false;

        this.scale = "";
        this.scaleStatus = false;

        this.selectStationID = "";
        this.submitDisabled = true;
      }
    })
  }

  get stationIDInput(): any { return this.form.get('stationID'); }
  get stationIDInputError(): string {
    if (this.stationIDInput.hasError('required')) { return Constants.message.requiredField; }
  }

  get stationNameInput(): any { return this.form.get('stationID'); }
  get stationNameInputError(): string {
    if (this.stationNameInput.hasError('required')) { return Constants.message.requiredField; }
  }

  get storeIDInput(): any { return this.form.get('storeID'); }
  get storeIDInputError(): string {
    if (this.storeIDInput.hasError('required')) { return Constants.message.requiredField; }
  }

}
