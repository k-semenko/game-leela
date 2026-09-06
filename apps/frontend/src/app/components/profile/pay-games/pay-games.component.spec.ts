import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayGamesComponent } from './pay-games.component';

describe('PayGamesComponent', () => {
  let component: PayGamesComponent;
  let fixture: ComponentFixture<PayGamesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayGamesComponent]
    });
    fixture = TestBed.createComponent(PayGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
