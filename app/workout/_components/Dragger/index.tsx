import React from "react";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import { Button } from "@mui/material";

const Dragger = () => {
  return (
    <div>
      <Button variant="text">
        <NorthIcon />
      </Button>
      <Button variant="text">
        <SouthIcon />
      </Button>
    </div>
  );
};

export default Dragger;
