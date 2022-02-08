import React, { useState, useEffect, useRef } from "react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { SnackbarState } from "../store/PlayPage/Snackbar";
import { useRecoilState, useRecoilValue } from "recoil";

export default function MySnackbar() {
  const [SnackbarData, setSnackbar] = useRecoilState(SnackbarState);

  function handleClose() {
    setSnackbar({ isOpen: false, text: "", color: "" });
  }

  return (
    <>
      <Snackbar
        autoHideDuration={3500}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={SnackbarData.isOpen}
        onClose={handleClose}
      >
        <MuiAlert
          color={SnackbarData.color}
          severity={SnackbarData.color}
          elevation={6}
          variant="filled"
        >
          {SnackbarData.text}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
