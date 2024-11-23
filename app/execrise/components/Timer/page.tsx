"use client";
import React from "react";

type TTime = {
  main: number;
  rest: number;
  rounds: number;
};

const timeConfig = {
  main: 5,
  rest: 3,
  rounds: 8,
};

const Timer = () => {
  const [time, setTime] = React.useState<TTime>({
    main: 5,
    rest: 3,
    rounds: 8,
  });
  const [isPause, setIsPause] = React.useState(false);

  React.useEffect(() => {
    const t = setInterval(() => {
      if (isPause) return;

      if (time.main > 0) {
        setTime((prev) => ({ ...prev, main: prev.main - 1 }));
      } else if (time.rest > 0) {
        setTime((prev) => ({ ...prev, rest: prev.rest - 1 }));
      } else if (time.rounds > 0) {
        setTime((prev) => ({
          main: timeConfig.main,
          rest: timeConfig.rest,
          rounds: prev.rounds - 1,
        }));
      } else {
        setIsPause(true);
      }
    }, 1000);

    return () => clearInterval(t);
  }, [isPause, time]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      {time.main > 0 && (
        <div className="text-6xl flex flex-col text-white items-center">
          <div className="text-xl">運動</div>
          <div className="text-6xl">
            {time.main < 10 ? `0${time.main}` : time.main}
          </div>
        </div>
      )}

      {time.main === 0 && time.rest > 0 && (
        <div className="text-6xl flex flex-col text-white items-center">
          <div className="text-xl">休息</div>
          <div className="text-6xl">
            {time.rest < 10 ? `0${time.rest}` : time.rest}
          </div>
        </div>
      )}

      <div className="text-white">剩餘組數: {time.rounds}</div>
    </div>
  );
};

export default Timer;
