import { Bricolage_Grotesque, Inter, Roboto } from "next/font/google";
import classNames from "classnames";
import React from "react";

const roboto = Bricolage_Grotesque({
  weight: "600",
  subsets: ["latin"],
});

const Introduction = () => {
  return (
    <div
      className={classNames(
        "flex",
        "w-full",
        "h-80",
        "justify-center",
        "align-middle"
      )}
      style={{
        background:
          "linear-gradient(117deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
      }}
    >
      <div
        className={classNames(
          "sm: flex-col",
          "md:flex-row",
          "w-4/5",
          "flex",
          "p-6",
          "justify-center",
          "align-middle",
          "content-center"
        )}
      >
        <div className={classNames("text-9xl", "flex-1", roboto.className)}>
          neo
        </div>
        <div
          className={classNames(
            "text-sm",
            "flex-1",
            "top-0",
            "left-0",
            "right-0",
            roboto.className,
            "text-base"
          )}
        >
          Neo
          健身夥伴是一款免費的運動輔助應用，提供運動輔助，比如規劃運動行程、組合，使用者可依照預設時間進行運動，提升訓練效率，如
          Tabata 有氧運動、HIIT 等訓練模式。
          <br />
          <br />
          <span className={classNames("hidden", "sm:block")}>
            Neo Fitness Companion is a free workout assistant app that helps
            users plan exercise schedules and routines. It allows users to
            follow preset workout durations to enhance training efficiency,
            supporting training modes such as Tabata cardio and HIIT.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
