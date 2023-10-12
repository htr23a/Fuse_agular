import {AfterContentInit, Component, Inject, Input, OnInit} from '@angular/core';
import {
  NgbActiveModal,
  NgbCarousel,
  NgbCarouselConfig,
  NgbCarouselModule,
  NgbSlide,
  NgbTooltip
} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import moment from "moment";
import {RouterLink} from "@angular/router";
import {AppModule} from "../../../app.module";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import '@angular/localize/init';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss'],
  imports: [
    NgClass,
    NgIf,
    NgForOf,
    DatePipe,
    RouterLink,
    AppModule,
    NgbTooltip,
    MatDialogModule,
    MatButtonModule,
    NgbSlide,
    NgbCarousel
  ],
  providers: [
    NgbCarouselConfig
  ],
  standalone: true
})
export class GalleryModalComponent implements OnInit, AfterContentInit {


  loadingMap = new Map<string, boolean>();
  isInitialized = false;
  displayedItems = [];

  constructor(
    config: NgbCarouselConfig,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit(): void {
    this.data.type = 'documents'
  }

  ngAfterContentInit() {
    if (this.isInitialized) {
      return;
    }

    this.displayedItems = this.data.items;
    console.log('items :', this.displayedItems)

    this.displayedItems.forEach(img => {
      this.loadingMap.set(img.doc_id, true);
    });
    this.isInitialized = true;
  }

  /*dismiss() {
    this.activeModal.dismiss();
  }*/

  isLoading() {
    return this.loadingMap.size > 0;
  }

  download(doc: any) {
    /*if (doc && doc.url) {
      const link = document.createElement('a');
      link.href = doc.url;
      let name = doc.doc_name || moment(doc.created).format('YYYY-MM-DDTHH:mm:ss');

      if (this.suffixName) {
        name += '_' + this.suffixName;
      }

      if (doc.doc_mime) {
        name += '.' + (EXTENSIONS_BY_MIME[doc.doc_mime] || 'jpg')
      }

      link.setAttribute('download', name);
      link.setAttribute('target', 'blank');
      link.click();
      link.remove();
    }
    else {
      this.notification.error(null, 'FILE_NOT_FOUND');
    }*/
  }

  zoomImage(el: HTMLElement) {
    /*if (el) {
      const src = el.getAttribute('src');
      if (src) {
        window.open(src);
      }
      else {
        this.notification.error(null, 'FILE_NOT_FOUND');
      }
    }*/
  }

  setLoading(event: any) {
    if (this.loadingMap.has(event.id)) {
      this.loadingMap.delete(event.id);
      if (!event.isSuccess && event.item) {
        event.item.isNotSupported = true;
      }
    }
  }
}
