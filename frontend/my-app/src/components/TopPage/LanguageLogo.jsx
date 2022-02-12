import * as React from "react";
import Grid from "@mui/material/Grid";

export default function LanguageLogo(props) {
  return (
    <>
      <Grid
        item
        xs={4}
        style={{ textAlign: "center", verticalAlign: "middle" }}
      >
        <img src={props.imgSrc} alt={props.name} style={{ width: "100px" }} />
        <p>{props.name}</p>
      </Grid>
    </>
  );
}
