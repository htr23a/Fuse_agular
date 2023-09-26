import {Component, Input} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-contact-preview-component',
  templateUrl: './contact-preview-component.component.html',
  styleUrls: ['./contact-preview-component.component.scss'],
  standalone: true
})
export class ContactPreviewComponent {
  @Input() idPhoto;
  @Input() type;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    if (!this.type) {
      this.type = 'documents';
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
