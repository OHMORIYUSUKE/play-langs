import * as React from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";

export default function TopPageUserIcon(props) {
  if (props.isLoading === true) {
    return (
      <>
        <Grid container xs={4} justifyContent="center" alignItems="center">
          <Skeleton
            animation="wave"
            variant="circular"
            style={{
              height: "100px",
              width: "100px",
            }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            style={{
              width: "60%",
              marginTop: "10px",
            }}
          />
        </Grid>
      </>
    );
  } else {
    return (
      <>
        <Grid
          item
          xs={4}
          style={{
            textAlign: "center",
            verticalAlign: "middle",
            order: -props.i,
          }}
        >
          <a href={`/user/${props.id}`} style={{ textDecoration: "none" }}>
            <div>
              <img
                src={props.picture}
                alt={props.name}
                style={{
                  borderRadius: "50%",
                  height: "100px",
                  objectFit: "cover",
                  width: "100px",
                }}
              />
              <p style={{ color: "black" }}>{props.name}</p>
            </div>
          </a>
        </Grid>
      </>
    );
  }
}
