import classNames from "classnames";
import React from "react";

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

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
          "w-4/5",
          "flex",
          "p-6",
          "justify-center",
          "align-middle",
          "content-center"
        )}
      >
        <div className={classNames("text-9xl", "flex-1")}>Neo</div>
        <div
          className={classNames(
            "text-sm",
            "flex-1",
            "top-0",
            "left-0",
            "right-0"
          )}
        >
          {lorem}
        </div>
      </div>
    </div>
  );
};

export default Introduction;
