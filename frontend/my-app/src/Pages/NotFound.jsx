import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function PositionedSnackbar() {
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => () => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const buttons = (
    <Button
      onClick={handleClick({
        vertical: "bottom",
        horizontal: "right",
      })}
    >
      Bottom-Right
    </Button>
  );

  return (
    <div>
      {buttons}
      <Snackbar
        autoHideDuration={2500}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message="I love snacks"
        key={vertical + horizontal}
      >
        <MuiAlert
          color="success"
          severity="success"
          elevation={6}
          variant="filled"
        >
          コピーしました。
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
