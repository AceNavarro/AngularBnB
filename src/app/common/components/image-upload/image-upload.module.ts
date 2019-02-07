import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ImageCropperModule } from 'ngx-image-cropper';

import { ImageUploadService } from './image-upload.service';

import { ImageUploadComponent } from './image-upload.component';

@NgModule({
  declarations: [
    ImageUploadComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ImageCropperModule
  ],
  exports: [
    ImageUploadComponent
  ],
  providers: [
    ImageUploadService
  ]
})
export class ImageUploadModule { }
