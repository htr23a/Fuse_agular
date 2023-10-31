import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockScreenModalComponent } from './lock-screen-modal.component';

describe('LockScreenModalComponent', () => {
  let component: LockScreenModalComponent;
  let fixture: ComponentFixture<LockScreenModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LockScreenModalComponent]
    });
    fixture = TestBed.createComponent(LockScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
