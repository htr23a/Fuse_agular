import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCategoryTypeComponent } from './select-category-type.component';

describe('SelectCategoryTypeComponent', () => {
  let component: SelectCategoryTypeComponent;
  let fixture: ComponentFixture<SelectCategoryTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectCategoryTypeComponent]
    });
    fixture = TestBed.createComponent(SelectCategoryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
