import { Injectable } from '@angular/core';
import {AddActivity, DeleteActivity, UpdateActivity} from "../state/activity.actions";
import {Store} from "@ngxs/store";



@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private store: Store) { }

  addActivity(date: string, time: string, task: string): void {
    this.store.dispatch(new AddActivity(date, time, task));
  }

  deleteActivity(date: string, time: string, task: string): void {
    this.store.dispatch(new DeleteActivity(date, time, task));
  }

  updateActivity(oldDate: string, oldTime: string, task: string, newDate: string, newTime: string): void {
    this.store.dispatch(new UpdateActivity(oldDate, oldTime, task, newDate, newTime));
  }

}
