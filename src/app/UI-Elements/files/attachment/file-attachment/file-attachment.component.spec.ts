import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileAttachmentComponent } from './file-attachment.component';

describe('FileAttachmentComponent', () => {
  let component: FileAttachmentComponent;
  let fixture: ComponentFixture<FileAttachmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileAttachmentComponent]
    });
    fixture = TestBed.createComponent(FileAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
