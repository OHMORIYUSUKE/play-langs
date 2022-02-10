import React, { useState, useEffect, useRef } from "react";

import { useRecoilState, useRecoilValue } from "recoil";
import Editor from "@monaco-editor/react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import axios from "axios";

import { deleteFlagState } from "../store/UserPage/deleteFlag";

export default function CodeCard(props) {
  const [deleteFlag, setDeleteFlagState] = useRecoilState(deleteFlagState);

  function deleteCode(id) {
    var result = window.confirm("コードを削除しますか？");

    if (result) {
    } else {
      return;
    }
    axios
      .post(
        "https://play-lang.herokuapp.com/code/delete",
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Token"),
          },
        }
      )
      .then(function (res) {
        console.log(res.data);
        if (res.data.error === "TokenError") {
          window.alert("再ログインしてください");
          return;
        }
        window.alert("ファイルを削除しました。");
        setDeleteFlagState({ isDelete: true });
      })
      .catch((error) => {
        console.log("Error : " + JSON.stringify(error));
        window.alert("サーバーでエラーが発生しました。/code/delete");
      });
  }
  return (
    <>
      <Grid item xs={4}>
        <Link href={`/play/${props.id}`} style={{ fontSize: "1.2rem" }}>
          {props.title}
        </Link>
        {props.isMe ? (
          <>
            <div style={{ float: "right" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteCode(props.id)}
              >
                削除
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
        <Editor
          height="40vh"
          theme="vs-dark"
          language="python"
          defaultValue={props.code_text}
          options={{
            readOnly: "true",
            lineNumbers: false,
            minimap: {
              enabled: false,
            },
          }}
        />
      </Grid>
    </>
  );
}
