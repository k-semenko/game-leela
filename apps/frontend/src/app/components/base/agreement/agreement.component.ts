import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-offer',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.sass'],
})
export class AgreementComponent {
  siteUrl = environment.apiUrl;
  agreementUrl = environment.apiUrl + 'agreement';
  policyUrl = environment.apiUrl + 'policy';
}
