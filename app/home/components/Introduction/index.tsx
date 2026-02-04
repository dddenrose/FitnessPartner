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
        "min-h-[20rem]",
        "md:h-80",
        "justify-center",
        "items-center",
        "py-8",
        "md:py-0"
      )}
      style={{
        background:
          "linear-gradient(117deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
      }}
    >
      <div
        className={classNames(
          "flex",
          "flex-col",
          "md:flex-row",
          "w-11/12",
          "md:w-4/5",
          "gap-6",
          "md:gap-8",
          "p-4",
          "md:p-6",
          "justify-center",
          "items-center"
        )}
      >
        <div
          className={classNames(
            "text-6xl",
            "md:text-8xl",
            "lg:text-9xl",
            "flex-1",
            "text-center",
            "md:text-left",
            roboto.className
          )}
        >
          neo
        </div>
        <div
          className={classNames(
            "text-sm",
            "md:text-base",
            "flex-1",
            "leading-relaxed",
            roboto.className
          )}
        >
          Neo
          健身夥伴是一款免費的運動輔助應用，提供運動輔助，比如規劃運動行程、組合，使用者可依照預設時間進行運動，提升訓練效率，如
          Tabata 有氧運動、HIIT 等訓練模式。
          <br />
          <br />
          <span className={classNames("hidden", "md:block")}>
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
