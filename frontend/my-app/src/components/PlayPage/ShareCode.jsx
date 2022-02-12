import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { Item } from "../utils/Item";

export default function ShareCode(props) {
  if (props.code_id) {
    return (
      <Item style={{ marginTop: "1rem" }}>
        <h4 style={{ textAlign: "center", margin: "8px" }}>コードを共有</h4>
        <a
          href={`http://twitter.com/share?text=${
            props.title
          }&hashtags=${"PlayLang"}&url=${
            "https://play-lang.netlify.app/play/" + props.code_id
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
      </Item>
    );
  } else {
    return <></>;
  }
}
