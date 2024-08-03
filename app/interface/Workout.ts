interface WorkoutItem {
  id: number;
  title: string;
  execriseTimes: number;
  times: number;
  restTimes: number;
  prepareTimes: number;
  requiredItem: {
    time: number;
    rest: number;
    prepare: number;
  };
}

const aerobicsList: WorkoutItem[] = [
  {
    id: 1,
    title: "Walking Lunges",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
    prepareTimes: 4,
    requiredItem: {
      time: 6,
      rest: 4,
    },
  },
  {
    id: 2,
    title: "Burpees",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
    prepareTimes: 4,
    requiredItem: {
      time: 6,
      rest: 4,
    },
  },
  {
    id: 3,
    title: "Jumping Jacks",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
    prepareTimes: 4,
    requiredItem: {
      time: 6,
      rest: 4,
    },
  },
  {
    id: 4,
    title: "Mountain Climbers",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
    prepareTimes: 4,
    requiredItem: {
      time: 6,
      rest: 4,
    },
  },
  {
    id: 5,
    title: "High Knees",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
    prepareTimes: 4,
    requiredItem: {
      time: 6,
      rest: 4,
    },
  },
  {
    id: 6,
    title: "Butt Kicks",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
    prepareTimes: 4,
    requiredItem: {
      time: 6,
      rest: 4,
    },
  },
  {
    id: 7,
    title: "Skaters",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
    prepareTimes: 4,
    requiredItem: {
      time: 6,
      rest: 4,
    },
  },
  {
    id: 8,
    title: "Plank Jacks",
    execriseTimes: 6,
    times: 1,
    restTimes: 4,
    prepareTimes: 4,
    requiredItem: {
      time: 6,
      rest: 4,
    },
  },
];
