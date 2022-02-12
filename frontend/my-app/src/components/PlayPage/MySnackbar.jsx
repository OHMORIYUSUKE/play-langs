import React, { useState, useEffect, useRef } from "react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { snackbarState } from "../../store/PlayPage/snackbar";
import { useRecoilState, useRecoilValue } from "recoil";

export default function MySnackbar() {
  const [snackbarData, setSnackbar] = useRecoilState(snackbarState);

  function handleClose() {
    setSnackbar({ isOpen: false, text: "", color: "" });
  }

  return (
    <>
      <Snackbar
        autoHideDuration={3500}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbarData.isOpen}
        onClose={handleClose}
      >
        <MuiAlert
          color={snackbarData.color}
          severity={snackbarData.color}
          elevation={6}
          variant="filled"
        >
          {snackbarData.text}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
