import { AfterViewChecked, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-non-functional',
  templateUrl: './non-functional.component.html',
  styleUrls: ['./non-functional.component.sass']
})
export class NonFunctionalComponent implements OnInit, AfterViewChecked  {

  checkboxes: { id: number; name: string }[] = [];

  @ViewChild('checkboxContainer') checkboxContainer!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      this.checkboxes = [
        { id: 1, name: 'Checkbox 1' },
        { id: 2, name: 'Checkbox 2' },
        { id: 3, name: 'Checkbox 3' },
        { id: 4, name: 'Checkbox 4' },
        { id: 5, name: 'Checkbox 5' },
        { id: 6, name: 'Checkbox 6' },
        { id: 7, name: 'Checkbox 7' },
        { id: 8, name: 'Checkbox 8' },
        { id: 9, name: 'Checkbox 9' },
        { id: 10, name: 'Checkbox 10' }
      ];
    }, 1000);
  }

  ngAfterViewChecked(): void {
    if (this.checkboxContainer) {
      this.checkboxContainer.nativeElement.scrollTop = 0;
    }
  }

  trackByFn(index: number, item: any): number {
    return item.id; 
  }
}
