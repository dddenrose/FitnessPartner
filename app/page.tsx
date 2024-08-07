"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser } from "@/lib/features/userInfo/userInfoSlice";
import Image from "next/image";
import { ChangeEvent } from "react";

const Home: React.FC = () => {
  const userInfo = useAppSelector((state) => state.userInfo.user);
  const dispatch = useAppDispatch();

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
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-indigo-700 text-4xl font-bold w-4/5">
        Welcome to Fitness Partner,
      </div>
      <div>
        <input
          type="text"
          id="name"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          className="border-2 border-indigo-300 p-2 rounded-lg w-50 text-4xl"
        />
      </div>
      {/* <div className="text-indigo-700 text-4xl font-bold w-4/5">
        Let's start your fitness journey!!!
      </div> */}
      <div
        onClick={() => {}}
        className="text-white text-4xl cursor-pointer font-bold flex items-center justify-center p-1 rounded-full text-center text-md bg-indigo-700 w-60 h-20 "
      >
        GO!!! 🚀
      </div>
    </div>
  );
};

export default Home;
