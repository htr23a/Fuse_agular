import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendItemModalComponent } from './append-item-modal.component';

describe('AppendItemModalComponent', () => {
  let component: AppendItemModalComponent;
  let fixture: ComponentFixture<AppendItemModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppendItemModalComponent]
    });
    fixture = TestBed.createComponent(AppendItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
