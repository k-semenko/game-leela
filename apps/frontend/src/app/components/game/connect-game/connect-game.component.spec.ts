import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectGameComponent } from './connect-game.component';

describe('ConnectGameComponent', () => {
  let component: ConnectGameComponent;
  let fixture: ComponentFixture<ConnectGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectGameComponent],
    });
    fixture = TestBed.createComponent(ConnectGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
