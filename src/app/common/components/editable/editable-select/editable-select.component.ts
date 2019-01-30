import { Component, Input } from '@angular/core';
import { EditableComponent } from '../editable.component';

@Component({
  selector: 'bnb-editable-select',
  templateUrl: './editable-select.component.html',
  styleUrls: ['./editable-select.component.scss']
})
export class EditableSelectComponent extends EditableComponent {

  @Input() options: any[];

}
