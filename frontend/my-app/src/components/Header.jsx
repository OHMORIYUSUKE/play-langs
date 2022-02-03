import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import LoginBtn from "./LoginBtn";

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }} style={{ marginBottom: "1.3rem" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" underline="none" color="#FFFFFF">
              Play Langs
            </Link>
          </Typography>
          <LoginBtn />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
