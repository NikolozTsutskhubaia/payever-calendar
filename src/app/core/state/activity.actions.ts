export class AddActivity {
  static readonly type = '[Appointment] Add';
  constructor(public date: string, public time: string, public task: string) {}
}

export class DeleteActivity {
  static readonly type = '[Appointment] Delete';
  constructor(public date: string, public time: string, public task: string) {}
}

export class UpdateActivity {
  static readonly type = '[Appointment] Update';
  constructor(
    public oldDate: string,
    public oldTime: string,
    public task: string,
    public newDate: string,
    public newTime: string
  ) {}
}
export class UpdateActivities {
  static readonly type = '[Activity] Update Activities';
  constructor(
    public date: string,
    public time: string,
    public activity: string[]
  ) {}
}
