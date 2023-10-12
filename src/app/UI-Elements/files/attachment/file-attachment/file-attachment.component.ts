import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatInputModule} from "@angular/material/input";
import {UtilityService} from "../../../../core/services/utility/utility.service";
import {FileUploader, FileUploadModule} from "ng2-file-upload";
import {SessionService} from "../../../../core/services/session/session.service";
import {NgForOf, NgIf, NgOptimizedImage, SlicePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import moment from "moment";
import {EXTENSIONS_BY_MIME} from "../../../../shared/extension/extension.config";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {GalleryModalComponent} from "../../../modals/gallery-modal/gallery-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-file-attachment',
    templateUrl: './file-attachment.component.html',
    styleUrls: ['./file-attachment.component.scss'],
    imports: [
        FileUploadModule,
        MatInputModule,
        FormsModule,
        SlicePipe,
        NgIf,
        NgForOf,
        NgOptimizedImage
    ],
    standalone: true
})
export class FileAttachmentComponent {
    submitted: boolean = false
    doc_name: string;
    uniqueId: string;
    isLoading: boolean = false
    public uploader:FileUploader
    imgSrc: string


    @Input() id: number;
    @Input() route: string;
    @Input() attachments: any[];
    @Input() suffixName: string;
    @Input() canDelete: boolean = true;
    @Input() type: string;


    @Output() onSuccess = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();

    constructor(private utilityService: UtilityService,
                private sessionService: SessionService,
                private modalService: NgbModal,
                public dialog: MatDialog
    ) {
    }
    uploadDocument(event: any) {
        /*if(this.isLoading){
            event.preventDefault();
            return;
        }*/

        this.submitted = true;

        if (this.doc_name) {
            if(!this.id) {
                event.preventDefault();
                console.error('ID not defined');
                return;
            }

            if(!this.route) {
                event.preventDefault();
                console.error('Attachment route not defined');
                return;
            }

            const url = this.utilityService.getUploadUrl(this.id, 'ATTACHMENT', this.route);
            this.uploader = new FileUploader({
                url,
                method: 'POST',
                headers: [
                    {name: 'X-Access-Token', value: this.sessionService.getToken()}
                ],
                additionalParameter: {
                    doc_name: this.doc_name
                },
                autoUpload: true
            });

            this.uploader.onAfterAddingFile = (file) => {
                file.withCredentials = false;
            };

            this.uploader.onBeforeUploadItem = (file) => {
                // this.isLoading = true;
                console.log('is loading')
            }

            this.uploader.onSuccessItem = (file, response, status, header) => {
                const result = JSON.parse(response);
                this.onSuccess.next(result);
                // this.notification.success(null, 'UPLOAD_SUCCESS');
                console.log('UPLOAD SUCCESS')
            };

            this.uploader.onErrorItem = (file, response) => {
                let err: any;
                try {
                    err = JSON.parse(response);
                }
                catch(e) {
                    err = {error: 'UPLOAD_FAILED'};
                }

                // this.notification.error(null, err.error);
                console.log(err)
            }

            this.uploader.onCompleteItem = () => {
                this.doc_name = "";
                this.submitted = false;
                // this.isLoading = false;
            }
        }
        else {
            event.preventDefault();
            // this.notification.error(null, 'DOCUMENT_NAME_INVALID');
            console.log('DOCUMENT_NAME_INVALID')
        }
    }

    previewDoc(idPhoto: string) {
        console.log(idPhoto)
        this.imgSrc = idPhoto
        if (idPhoto) {
            /*const modalRef = this.modalService.open(GalleryModalComponent, {size: 'lg', windowClass: 'img-preview'});
            modalRef.componentInstance.currentId = idPhoto;
            modalRef.componentInstance.suffixName = this.suffixName;
            modalRef.componentInstance.items = this.attachments.reduce((res, item) => {
                if (this.isImage(item)) {
                    console.log('image item', item)
                    res.push(item);
                }

                return res;
            }, []);*/
            const items = this.attachments.reduce((res, item)=>{
                if (this.isImage(item)) {
                    res.push(item);
                }
                return res;
            }, [])
            this.dialog.open(GalleryModalComponent, {
                width: '900px',
                height: '90vh',
                data: {
                    items: items,
                    currentId: idPhoto,
                    suffixName: this.suffixName,
                    type: this.type ? this.type : null
                },
            });

           /* if (this.type) {
                console.log('type', this.type)
                modalRef.componentInstance.type = this.type;
            }*/
        }
        else {
            // this.notification.warning(null, 'FILE_NOT_FOUND');
        }
    }

    formatDocName(doc: any, withSuffix?: boolean) {
        if (!doc) return null;
        let name = doc.doc_name || moment(doc.created).format('YYYY-MM-DDTHH:mm:ss');

        if (withSuffix && this.suffixName) {
            name += '_' + this.suffixName;
        }

        const extension = this.getExtension(doc);
        if (extension) {
            name += '.' + extension;
        }

        return name;
    }

    private getExtension(doc: any) {
        if (!doc || !doc.doc_mime) {
            return null;
        }

        return EXTENSIONS_BY_MIME[doc.doc_mime];
    }

    deleteAttachment(idPhoto: string){
        this.onDelete.next(idPhoto);
    }

    // previewDoc(idPhoto: string){}

    download(doc: any) {
        this.utilityService.downloadFile(doc, 'documents', this.suffixName).toPromise().then(res => {
            // this.notification.info(null, 'DOWNLOAD_STARTED');
            console.log('DOWNLOAD_STARTED')
        }).catch(err => {
            // this.notification.error(null, err.error);
            console.log(err)
        });
    }

    isImage(doc: any) {
        if (!doc || !doc.doc_mime) {
            return true;
        }

        return doc.doc_mime.startsWith('image/');
    }

    showAttachment(){
        console.log(this.attachments)
    }

}
