import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRulesComponent } from './payment-rules.component';

describe('PaymentRulesComponent', () => {
  let component: PaymentRulesComponent;
  let fixture: ComponentFixture<PaymentRulesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentRulesComponent]
    });
    fixture = TestBed.createComponent(PaymentRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
