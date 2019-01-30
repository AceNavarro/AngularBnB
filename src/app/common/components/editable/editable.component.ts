import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

export class EditableComponent implements OnChanges {

  @Input() entity: any;

  @Input() set field(entityField: string) {
    this.entityField = entityField;
    this.setOriginalValue();
  }

  @Input() className: string;

  @Input() style: any;

  @Output() entityUpdated = new EventEmitter();

  isActiveInput: boolean = false;
  originalEntityValue: any;
  entityField: string;

  constructor() { }

  ngOnChanges() {
    this.setOriginalValue();
  }

  cancelUpdate() {
    this.isActiveInput = false;
    this.entity[this.entityField] = this.originalEntityValue;
  }
  
  setOriginalValue() {
    this.originalEntityValue = this.entity[this.entityField];
  }

  updateEntity() {
    const entityValue = this.entity[this.entityField];

    if (entityValue !== this.originalEntityValue) {
      this.entityUpdated.emit({ [this.entityField]: entityValue });
      this.setOriginalValue();
    }

    this.isActiveInput = false;
  }

}
