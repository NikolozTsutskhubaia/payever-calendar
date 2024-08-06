import { Component, effect, model, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList, CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivityService } from '../../core/services/activity.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TodoEditDialogComponent } from '../todo-edit-dialog/todo-edit-dialog.component';
import { MatIcon } from '@angular/material/icon';
import {
  DeleteActivity,
  UpdateActivity
} from '../../core/state/activity.actions';
import { Store } from '@ngxs/store';
import { ActivityState } from '../../core/state/activity.state';
import {HeaderComponent} from "../../core/components/header/header.component";
import {Activity, ActivityTime} from "../../core/models/activity.model";

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCard,
    MatCalendar,
    MatCardModule,
    MatDatepickerModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CommonModule,
    JsonPipe,
    RouterLink,
    MatButton,
    MatIconButton,
    MatIcon,
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  formattedDate = '';
  hours: Activity[] = [];
  itemList_ids: string[] = [];
  index = -1;
  selected = model<Date | null>(new Date());

  constructor(
    private store: Store,
    public activityService: ActivityService,
    private dialog: MatDialog
  ) {
    effect(() => {
      this.formattedDate = this.formatDate(this.selected());
    });
  }

  otherArray: Activity[] = [];

  generateTimeSlots(startTime: string, endTime: string, interval: number): ActivityTime[] {
    const slots: ActivityTime[] = [];
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    let current = start;

    let id = 1;

    while (current <= end) {
      slots.push({
        id: id.toString(),
        time: current.toTimeString().slice(0, 5),
        todos: []
      });
      current = new Date(current.getTime() + interval * 60000);
      id++;
    }

    return slots;
  }

  findIndex() {
    const selectedDate = this.formatDate(this.selected());
    this.index = this.hours.findIndex((item) => item.date === selectedDate);

    if (this.index !== -1) {
      this.hours[this.index].data.forEach((hour) => {
        this.itemList_ids.push(hour.time);
      });
    } else {
      this.otherArray = [{
        date: selectedDate,
        data: this.generateTimeSlots('09:00', '23:00', 60)
      }];
    }
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      this.store.dispatch(new UpdateActivity(this.formatDate(this.selected()), event.previousContainer.id, event.previousContainer.data[0], this.formatDate(this.selected()), event.container.id));
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.store.dispatch(new UpdateActivity(this.formatDate(this.selected()), event.previousContainer.id, event.previousContainer.data[0], this.formatDate(this.selected()), event.container.id));
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  trackByFn(index: number): number {
    return index;
  }

  openEditModal(hour: ActivityTime, todo: string) {
    const dialogRef = this.dialog.open(TodoEditDialogComponent, {
      width: '250px',
      data: { date: this.formatDate(this.selected()), time: hour.time, todo: todo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateTodoDateTime(this.formatDate(this.selected()), hour.time, todo, result.newDate, result.newTime);
      }
    });
  }

  deleteTodo(date: string, time: string, task: string) {
    this.store.dispatch(new DeleteActivity(date, time, task));
    this.findIndex();
  }

  updateTodoDateTime(oldDate: string, oldTime: string, task: string, newDate: string, newTime: string) {
    this.store.dispatch(new UpdateActivity(oldDate, oldTime, task, newDate, newTime));
    this.findIndex();
  }

  ngOnInit(): void {
    this.store.select(ActivityState.getActivities).subscribe(activities => {
      this.hours = activities;
      this.findIndex();
    });
  }
}

