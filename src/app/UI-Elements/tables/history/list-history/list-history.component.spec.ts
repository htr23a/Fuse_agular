import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHistoryComponent } from './list-history.component';

describe('ListHistoryComponent', () => {
  let component: ListHistoryComponent;
  let fixture: ComponentFixture<ListHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListHistoryComponent]
    });
    fixture = TestBed.createComponent(ListHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
