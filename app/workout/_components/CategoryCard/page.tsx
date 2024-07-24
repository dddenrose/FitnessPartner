import { Button, Divider } from "@mui/material";
import React from "react";
import Image from "next/image";
import image1 from "@/app/static/103.jpg";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const CategoryCard: React.FC = () => {
  const aerobicsList = [
    {
      title: "Walking Lunges",
      times: 10,
      restTimes: 30,
    },
    {
      title: "Burpees",
      times: 10,
      restTimes: 30,
    },
    {
      title: "Jumping Jacks",
      times: 10,
      restTimes: 30,
    },
    {
      title: "Mountain Climbers",
      times: 5,
      restTimes: 30,
    },
    {
      title: "High Knees",
      times: 5,
      restTimes: 30,
    },
    {
      title: "Butt Kicks",
      times: 5,
      restTimes: 30,
    },
    {
      title: "Skaters",
      times: 5,
      restTimes: 30,
    },
    {
      title: "Plank Jacks",
      times: 5,
      restTimes: 30,
    },
  ];

  return (
    <div className="flex bg-white rounded-3xl p-12 shadow-xl gap-2 w-3/4 place-content-between">
      <div className="flex flex-col gap-4">
        <div className="text-5xl font-bold">Aerobics 🔥</div>

        <Divider />
        <div>
          <div className="text-gray-400 text-md">8 Execrises</div>
          {aerobicsList.map((item, index) => (
            <div key={index} className="flex gap-2">
              <div className="text-indigo-700">{item.title}</div>
              <div className="text-gray-400">{item.times}x</div>
            </div>
          ))}
        </div>

        <Divider />
        <div className="flex gap-1 justify-center rounded-full border border-indigo-700 text-indigo-700 h-10 items-center">
          <AccessTimeIcon /> 30 minutes
        </div>
        <div className="text-white font-bold flex items-center justify-center p-1 rounded-full text-center text-md bg-indigo-700 w-80 h-10 ">
          Start 💪!!
        </div>
      </div>
      <Image src={image1} alt="Yoga" width={400} className="rounded-3xl" />
    </div>
  );
};

export default CategoryCard;
