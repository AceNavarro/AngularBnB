import { Component, Output, EventEmitter } from '@angular/core';
import { ImageUploadService } from './image-upload.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

class FileSnippet {

  static readonly IMAGE_SIZE = { width: 950, height: 720 };

  pending: boolean = false;
  status: string = "INIT";

  constructor(public src: string, 
              public file: File) {
  }
}

@Component({
  selector: 'bnb-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {

  @Output() imageUploaded = new EventEmitter();

  @Output() imageError = new EventEmitter();

  @Output() imageLoadedToContainer = new EventEmitter();

  @Output() cropperCancelled = new EventEmitter();
  
  selectedFile: FileSnippet;
  originalSelectedFile: FileSnippet;

  constructor(private imageService: ImageUploadService,
              private toastr: ToastrService) { }

  private onSuccess(imageUrl: string) {
    this.selectedFile.pending = false;
    this.selectedFile.status = "OK";
    this.imageUploaded.emit(imageUrl);
  }

  private onFailure() {
    this.selectedFile.pending = false;
    this.selectedFile.status = "FAIL";
    this.selectedFile.src = null;
    this.imageError.emit('');
  }

  imageChangedEvent: any = '';
  fileName: string;

  setOriginalSelectedFile() {
    this.originalSelectedFile = this.selectedFile;
  }

  restoreSelectedFile() {
    this.selectedFile = this.originalSelectedFile;
  }

  cancelCropper() {
    this.imageChangedEvent = null;
    this.restoreSelectedFile();
    this.cropperCancelled.emit();
  }

  imageCropped(event: ImageCroppedEvent) {
    const imageFile: File = new File([event.file], this.fileName);
    if (this.selectedFile) {
      this.selectedFile.file = imageFile;
    } else {
      this.selectedFile = new FileSnippet("", imageFile);
    }
  }

  imageLoaded() {
    this.imageLoadedToContainer.emit();
  }

  processFile(event: any) {
    this.setOriginalSelectedFile();
    this.selectedFile = undefined;
    const URL = window.URL;
    let file, img;

    if ((file = event.target.files[0]) &&
        (file.type === "image/jpg" || 
          file.type === "image/jpeg" || 
          file.type === "image/png" || 
          file.type === "image/gif")) {
      const self = this;
      img = new Image();
      
      img.onload = function() {
        if (this.width > FileSnippet.IMAGE_SIZE.width &&
            this.height > FileSnippet.IMAGE_SIZE.height) {
          self.imageChangedEvent = event;
          self.fileName = file.name;
        } else {
          self.toastr.error(`Image is too small. Minimum size must be ${FileSnippet.IMAGE_SIZE.width} x ${FileSnippet.IMAGE_SIZE.height}`, "Error!");
          event.target.value = "";
        }
      };
      // Load the image into the document
      img.src = URL.createObjectURL(file);
    } else {
      this.toastr.error("Image file type must be any of the following: jpg, jpeg, png, gif", "Error");
      event.target.value = "";
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      const reader: FileReader = new FileReader();
  
      reader.addEventListener("load", (event: any) => {
        this.imageChangedEvent = null;
        this.selectedFile.src = event.target.result;
        this.selectedFile.pending = true;
  
        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          result => { 
            this.onSuccess(result.imageUrl);
          }, (err: HttpErrorResponse) => {
            this.toastr.error(err.error.errors[0].detail, "Error");
            this.onFailure(); 
          });
      });
  
      reader.readAsDataURL(this.selectedFile.file);
    }
  }

}
