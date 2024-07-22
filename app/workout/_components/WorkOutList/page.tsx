import { PlusOne } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

const WorkOutList = () => {
  const list = [
    {
      id: 1,
      name: "Push Up",
      weight: 0,
      times: 10,
    },
    {
      id: 2,
      name: "Pull Up",
      weight: 0,
      times: 10,
    },
    {
      id: 3,
      name: "Squat",
      weight: 0,
      times: 10,
    },
    {
      id: 4,
      name: "Bench Press",
      weight: 0,
      times: 10,
    },
    {
      id: 5,
      name: "Deadlift",
      weight: 0,
      times: 10,
    },
  ];

  return (
    <div className="flex gap-1">
      {list.map((ele) => (
        <Button key={ele.id} variant="outlined">
          {ele.name} <AddIcon />
        </Button>
      ))}
    </div>
  );
};

export default WorkOutList;
