import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryModalComponent } from './gallery-modal.component';

describe('GaleryModalComponent', () => {
  let component: GalleryModalComponent;
  let fixture: ComponentFixture<GalleryModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryModalComponent]
    });
    fixture = TestBed.createComponent(GalleryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
