import { Component } from '@angular/core';
import { EditableComponent } from '../editable.component';

@Component({
  selector: 'bnb-editable-image',
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.scss']
})
export class EditableImageComponent extends EditableComponent {

  isCroppedImageLoaded: boolean = false;

  handleImageError() {
    this.cancelUpdate();
  }

  handleImageUploaded(imageUrl: string) {
    this.entity[this.entityField] = imageUrl;
    this.updateEntity();
    this.isCroppedImageLoaded = false;
  }

  handleImageLoaded() {
    this.isCroppedImageLoaded = true;
  }

  handleCropperCancelled() {
    this.cancelUpdate();
  }

  cancelUpdate() {
    super.cancelUpdate();
    this.isCroppedImageLoaded = false;
  }

}
