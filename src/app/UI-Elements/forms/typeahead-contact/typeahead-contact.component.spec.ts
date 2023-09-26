import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadContactComponent } from './typeahead-contact.component';

describe('TypeaheadContactComponent', () => {
  let component: TypeaheadContactComponent;
  let fixture: ComponentFixture<TypeaheadContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeaheadContactComponent]
    });
    fixture = TestBed.createComponent(TypeaheadContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
