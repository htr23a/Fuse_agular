import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadVendorComponent } from './typeahead-vendor.component';

describe('TypeaheadVendorComponent', () => {
  let component: TypeaheadVendorComponent;
  let fixture: ComponentFixture<TypeaheadVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeaheadVendorComponent]
    });
    fixture = TestBed.createComponent(TypeaheadVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
