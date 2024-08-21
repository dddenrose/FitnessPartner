"use client";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser } from "@/lib/features/userInfo/userInfoSlice";
import { ChangeEvent } from "react";

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
    <div className="flex flex-col gap-8 p-40">
      <div className="text-indigo-700 text-6xl font-bold w-4/5">
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
          className="border-2 border-indigo-300 p-2 rounded-lg w-50 text-4xl"
        />
      </div>
      <div
        onClick={handleGo}
        className="text-white text-4xl cursor-pointer font-bold flex items-center justify-center p-1 rounded-full text-center text-md bg-indigo-700 w-60 h-20 "
      >
        GO!!! 🚀
      </div>
    </div>
  );
};

export default Home;
