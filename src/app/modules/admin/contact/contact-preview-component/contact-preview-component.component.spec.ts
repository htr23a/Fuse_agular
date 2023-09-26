import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPreviewComponentComponent } from './contact-preview-component.component';

describe('ContactPreviewComponentComponent', () => {
  let component: ContactPreviewComponentComponent;
  let fixture: ComponentFixture<ContactPreviewComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactPreviewComponentComponent]
    });
    fixture = TestBed.createComponent(ContactPreviewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
