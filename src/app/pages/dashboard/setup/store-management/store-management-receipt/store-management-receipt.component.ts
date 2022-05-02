import { Component, OnInit } from '@angular/core';
import { Constants } from '@app/_configs/constant';
import { UtilService } from '@service/util.service';
import { ToastService } from '@app/_services/toast.service';
import { AuthService } from '@app/_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-store-management-receipt',
  templateUrl: './store-management-receipt.component.html',
  styleUrls: ['./store-management-receipt.component.scss']
})
export class StoreManagementReceiptComponent implements OnInit {

  header1: String = "";
  header1Status: Boolean = false;
  header2: String = "";
  header2Status: Boolean = false;
  header3: String = "";
  header3Status: Boolean = false;
  header4: String = "";
  header4Status: Boolean = false;
  header5: String = "";
  header5Status: Boolean = false;
  policy1: String = "";
  policy1Status: Boolean = false;
  policy2: String = "";
  policy2Status: Boolean = false;
  policy3: String = "";
  policy3Status: Boolean = false;
  policy4: String = "";
  policy4Status: Boolean = false;
  policy5: String = "";
  policy5Status: Boolean = false;
  marketing1: String = "";
  marketing1Status: Boolean = false;
  marketing2: String = "";
  marketing2Status: Boolean = false;
  marketing3: String = "";
  marketing3Status: Boolean = false;
  marketing4: String = "";
  marketing4Status: Boolean = false;
  marketing5: String = "";
  marketing5Status: Boolean = false;
  ticketPolicy: String = "";
  ticketPolicyStatus: Boolean = false;
  pole1: String = "";
  pole2: String = "";
  private_web_address: String = "";

  constructor(
    public jwtHelper: JwtHelperService,
    private toastService: ToastService,
    private utilService: UtilService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const tkn = this.authService.getToken();
    const decoded = this.jwtHelper.decodeToken(tkn);
    this.private_web_address = decoded.private_web_address;
    this.getReceiptTemplate()
  }

  getReceiptTemplate(): void {
    this.utilService.get('sell/receipttemplate', { private_web_address: this.private_web_address }).subscribe(result => {
      if (result && result.body) {
        this.header1 = result.body.header1;
        this.header1Status = result.body.header1Status;
        this.header2 = result.body.header2;
        this.header2Status = result.body.header2Status;
        this.header3 = result.body.header3;
        this.header3Status = result.body.header3Status;
        this.header4 = result.body.header4;
        this.header4Status = result.body.header4Status;
        this.header5 = result.body.header5;
        this.header5Status = result.body.header5Status;
        this.policy1 = result.body.policy1;
        this.policy1Status = result.body.policy1Status;
        this.policy2 = result.body.policy2;
        this.policy2Status = result.body.policy2Status;
        this.policy3 = result.body.policy3;
        this.policy3Status = result.body.policy3Status;
        this.policy4 = result.body.policy4;
        this.policy4Status = result.body.policy4Status;
        this.policy5 = result.body.policy5;
        this.policy5Status = result.body.policy5Status;
        this.marketing1 = result.body.marketing1;
        this.marketing1Status = result.body.marketing1Status;
        this.marketing2 = result.body.marketing2;
        this.marketing2Status = result.body.marketing2Status;
        this.marketing3 = result.body.marketing3;
        this.marketing3Status = result.body.marketing3Status;
        this.marketing4 = result.body.marketing4;
        this.marketing4Status = result.body.marketing4Status;
        this.marketing5 = result.body.marketing5;
        this.marketing5Status = result.body.marketing5Status;
        this.ticketPolicy = result.body.ticketPolicy;
        this.ticketPolicyStatus = result.body.ticketPolicyStatus;
        this.pole1 = result.body.pole1;
        this.pole2 = result.body.pole2;
      }
    });
  }

  onSave(): void {
    const data = {
      private_web_address: 'newonestore',
      header1: this.header1,
      header1Status: this.header1Status,
      header2: this.header2,
      header2Status: this.header2Status,
      header3: this.header3,
      header3Status: this.header3Status,
      header4: this.header4,
      header4Status: this.header4Status,
      header5: this.header5,
      header5Status: this.header5Status,
      policy1: this.policy1,
      policy1Status: this.policy1Status,
      policy2: this.policy2,
      policy2Status: this.policy2Status,
      policy3: this.policy3,
      policy3Status: this.policy3Status,
      policy4: this.policy4,
      policy4Status: this.policy4Status,
      policy5: this.policy5,
      policy5Status: this.policy5Status,
      marketing1: this.marketing1,
      marketing1Status: this.marketing1Status,
      marketing2: this.marketing2,
      marketing2Status: this.marketing2Status,
      marketing3: this.marketing3,
      marketing3Status: this.marketing3Status,
      marketing4: this.marketing4,
      marketing4Status: this.marketing4Status,
      marketing5: this.marketing5,
      marketing5Status: this.marketing5Status,
      ticketPolicy: this.ticketPolicy,
      ticketPolicyStatus: this.ticketPolicyStatus,
      pole1: this.pole1,
      pole2: this.pole2
    }
    this.utilService.post('sell/receipttemplate', data).subscribe((res) => {
      if (res) {
        this.toastService.showSuccess('Receipt print template save successfully');
      }
    });
  }

}
