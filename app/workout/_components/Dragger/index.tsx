import React from "react";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import { Button } from "@mui/material";

const Dragger = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>Position</div>
      <Button variant="outlined">
        <NorthIcon />
      </Button>
      <Button variant="outlined">
        <SouthIcon />
      </Button>
    </div>
  );
};

export default Dragger;
