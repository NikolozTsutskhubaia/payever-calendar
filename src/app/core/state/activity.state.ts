import { State, Action, StateContext, Selector } from '@ngxs/store';
import {AddActivity, DeleteActivity, UpdateActivity, UpdateActivities} from './activity.actions';
import {Activity, ActivityTime} from "../models/activity.model";

@State<Activity[]>({
  name: 'activities',
  defaults: []
})
export class ActivityState {
  @Selector()
  static getActivities(state: Activity[]) {
    return state;
  }

  @Action(AddActivity)
  add(ctx: StateContext<Activity[]>, action: AddActivity) {
    const state = ctx.getState();
    const appointmentDate = state.find(activity => activity.date === action.date);

    if (appointmentDate) {
      const appointmentHour = appointmentDate.data.find((hour:ActivityTime) => hour.time === action.time);
      if (appointmentHour) {
        appointmentHour.todos.push(action.task);
      }
    } else {
      const newEntry: Activity = {
        date: action.date,
        data: this.generateAllHours().map(hour => ({
          id: hour.id,
          time: hour.time,
          todos: hour.time === action.time ? [action.task] : []
        }))
      };
      ctx.setState([...state, newEntry]);
    }
  }

  @Action(DeleteActivity)
  delete(ctx: StateContext<Activity[]>, action: DeleteActivity) {
    const state = ctx.getState();
    const appointmentDate = state.find(activity => activity.date === action.date);
    if (appointmentDate) {
      const appointmentHour = appointmentDate.data.find((hour:ActivityTime) => hour.time === action.time);
      if (appointmentHour) {
        const taskIndex = appointmentHour.todos.indexOf(action.task);
        if (taskIndex !== -1) {
          appointmentHour.todos.splice(taskIndex, 1);
        }
      }
    }
    ctx.setState([...state]);
  }

  @Action(UpdateActivity)
  update(ctx: StateContext<Activity[]>, action: UpdateActivity) {
    ctx.dispatch(new DeleteActivity(action.oldDate, action.oldTime, action.task));
    ctx.dispatch(new AddActivity(action.newDate, action.newTime, action.task));
  }

  @Action(UpdateActivities)
  updateTodos(ctx: StateContext<Activity[]>, action: UpdateActivities) {
    const state = ctx.getState();
    const appointmentDate = state.find(activity => activity.date === action.date);
    if (appointmentDate) {
      const appointmentHour = appointmentDate.data.find((hour:ActivityTime) => hour.time === action.time);
      if (appointmentHour) {
        appointmentHour.todos = action.activity;
      }
    }
    ctx.setState([...state]);
  }

  private generateAllHours() {
    const hours = ["09:00"];
    for(let i = 10 ; i<= 23 ; i ++){
      hours.push(`${i}:00`);
    }
    return hours.map((time, index) => ({ id: (index + 1).toString(), time: time, todos: [] }));
  }
}
