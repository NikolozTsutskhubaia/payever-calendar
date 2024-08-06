import {Component, effect, Inject, model} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatOption, MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MatCalendar, MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatCard} from "@angular/material/card";
import {provideNativeDateAdapter} from "@angular/material/core";
import {CycleDirective} from "../../core/directives/cycle.directive";
import { ActivityTime} from "../../core/models/activity.model";

@Component({
  selector: 'app-todo-edit-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatDialogContent,
    FormsModule,
    MatDialogTitle,
    MatInput,
    MatButton,
    MatDialogActions,
    MatSelect,
    MatOption,
    NgForOf,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatCalendar,
    MatCard,
    ReactiveFormsModule,
    CycleDirective
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './todo-edit-dialog.component.html',
  styleUrl: './todo-edit-dialog.component.css'
})
export class TodoEditDialogComponent {
  selected = model<Date | null>(new Date());
  timeControl: FormControl = new FormControl('');
  formattedDate!: string;
  constructor(
    public dialogRef: MatDialogRef<TodoEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityTime
  ) {
    this.timeControl.setValue(data.time);
    effect(() => {
      this.formattedDate = this.formatDate(this.selected());
    });
  }

  onSave(): void {
    this.dialogRef.close({ newDate: this.formattedDate, newTime: this.timeControl.value });
  }

  formatDate(date: Date | null): string {
    if (!date) {
      return '';
    }
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return date.toLocaleString('en-GB', options).replace(',', '');
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
