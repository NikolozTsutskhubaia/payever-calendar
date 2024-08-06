
export interface Activity {
  date: string;
  data: ActivityTime[];
}

export interface ActivityTime {
  id: string;
  time: string;
  todos: string[];
}
