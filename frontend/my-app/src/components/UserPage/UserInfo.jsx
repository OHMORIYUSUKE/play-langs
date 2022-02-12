import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import EditUserProfileDialog from "./EditUserProfileDialog";

export default function UserInfo(props) {
  return (
    <>
      <Grid item xs={2}>
        {props.user_picture ? (
          <img
            src={props.user_picture}
            alt="プロフィール画像"
            style={{
              borderRadius: "50%",
              width: "110px",
              height: "110px",
              objectFit: "cover",
            }}
          />
        ) : (
          <Skeleton
            animation="wave"
            variant="circular"
            style={{ width: "110px", height: "110px" }}
          />
        )}
      </Grid>
      <Grid item xs={7}>
        {props.user_picture ? (
          <h1>{props.user_name}</h1>
        ) : (
          <Typography variant="h2" style={{ width: "80%" }}>
            <Skeleton animation="wave" />
          </Typography>
        )}
      </Grid>
      <Grid item xs={2}>
        {props.isMe ? (
          <>
            <EditUserProfileDialog />
          </>
        ) : (
          <></>
        )}
      </Grid>
      <Grid item xs={1}>
        <a
          href={`http://twitter.com/share?text=${
            props.user_name
          }&hashtags=${"PlayLang"}&url=${
            "https://play-lang.netlify.app/user/" + props.user_id
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Avatar
            sx={{ width: 50, height: 50 }}
            src="https://img.icons8.com/color/240/000000/twitter-circled--v1.png"
            alt=""
          />
        </a>
      </Grid>
    </>
  );
}
