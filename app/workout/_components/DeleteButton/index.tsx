import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import { Button } from "@mui/material";

const DeleteButton = () => {
  return (
    <Button variant="outlined">
      <ClearIcon />
    </Button>
  );
};

export default DeleteButton;
