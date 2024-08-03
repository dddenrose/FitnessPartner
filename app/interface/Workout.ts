interface WorkoutItem {
  id: number;
  title: string;
  execriseTimes: number;
  set: number;
  restTimes: number;
  prepareTimes: number;
  requiredItem: {
    time: number;
    rest: number;
    prepare: number;
    set: number;
  };
}
