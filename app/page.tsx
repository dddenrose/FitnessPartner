"use client";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser } from "@/lib/features/userInfo/userInfoSlice";
import { ChangeEvent } from "react";
import classNames from "classnames";

const Home: React.FC = () => {
  const userInfo = useAppSelector((state) => state.userInfo.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 處理輸入框變化的函數
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    dispatch(
      setUser({
        ...userInfo,
        name: value,
      })
    );
  };

  const handleGo = () => {
    // 跳轉到workout頁面
    router.push("workout");
  };

  return (
    <div className={classNames("flex", "flex-col", "gap-8", "mt-20")}>
      <div
        className={classNames(
          "text-indigo-700",
          "text-5xl",
          "font-bold",
          "w-full"
        )}
      >
        Welcome to
        <br />
        Fitness Partner,
      </div>
      <div>
        <input
          type="text"
          id="name"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          className={classNames(
            "border-2",
            "border-indigo-300",
            "p-2",
            "rounded-lg",
            "w-full",
            "text-4xl"
          )}
        />
      </div>
      <div
        onClick={handleGo}
        className={classNames(
          "text-white",
          "text-4xl",
          "cursor-pointer",
          "font-bold",
          "flex",
          "items-center",
          "justify-center",
          "p-1",
          "rounded-full",
          "text-center",
          "text-md",
          "bg-indigo-700",
          "w-full",
          "h-20"
        )}
      >
        GO!!! 🚀
      </div>
    </div>
  );
};

export default Home;
