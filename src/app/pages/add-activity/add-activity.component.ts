import {Component, effect, EventEmitter, Input, model, Output} from '@angular/core';
import {
  MatCalendar,
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule, JsonPipe} from "@angular/common";
import {ActivityService} from "../../core/services/activity.service";
import {MatCard, MatCardModule} from "@angular/material/card";
import {CdkDrag, CdkDropList, CdkDropListGroup} from "@angular/cdk/drag-drop";
import {Router, RouterLink} from "@angular/router";
import {provideNativeDateAdapter} from "@angular/material/core";
import {MatButton} from "@angular/material/button";
import {MatSelectModule} from '@angular/material/select';
import {CycleDirective} from "../../core/directives/cycle.directive";
import { MatSelectChange } from '@angular/material/select';


@Component({
  selector: 'app-add-activity',
  standalone: true,
  providers:[provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatDatepickerInput,
    MatDatepicker,
    FormsModule,
    MatCalendar,
    MatCard,
    MatCard,
    MatCalendar,
    MatError,
    MatSelectModule,
    MatCardModule, MatDatepickerModule, CdkDropListGroup, CdkDropList, CdkDrag, JsonPipe, RouterLink, MatButton, ReactiveFormsModule, CycleDirective,
  ],
  templateUrl: './add-activity.component.html',
  styleUrl: './add-activity.component.css'
})
export class AddActivityComponent {
  @Input() time: string | null = null;
  @Output() timeChange = new EventEmitter<string>();
  selectedHour: string | null = null;
  selected = model<Date | null>(new Date());
  formattedDate = '';
  task = new FormControl('',Validators.required);

  constructor(public appointmentService:ActivityService,
              private router:Router) {
    effect(() => {
      this.formattedDate = this.formatDate(this.selected());
    });
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


  onHourChange(event: MatSelectChange): void {
    this.selectedHour = event.value;
    this.createActivity();
  }
  createActivity(): void {
    if (this.selected && this.selectedHour && !this.task.errors && this.task.value) {
      const date = this.formatDate(this.selected());
      this.appointmentService.addActivity(date, this.selectedHour, this.task.value);
      this.router.navigate(['/'])
    }
  }
}
