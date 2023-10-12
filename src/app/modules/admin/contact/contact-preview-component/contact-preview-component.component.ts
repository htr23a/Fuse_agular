import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-contact-preview-component',
  templateUrl: './contact-preview-component.component.html',
  styleUrls: ['./contact-preview-component.component.scss'],
  standalone: true
})
export class ContactPreviewComponent {
  @Input() idPhoto;
  @Input() type;

  constructor() {
  }

  ngOnInit() {
    if (!this.type) {
      this.type = 'documents';
    }
  }
}
