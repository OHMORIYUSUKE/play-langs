import * as React from "react";
import Button from "@mui/material/Button";

import { CopyText } from "../utils/CopyText";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { snackbarState } from "../store/PlayPage/snackbar";
import { editorThemeState } from "../store/PlayPage/editorTheme";
import { responseResultState } from "../store/PlayPage/responseResult";

export default function PlayPageOutput() {
  const [snackbarData, setSnackbar] = useRecoilState(snackbarState);
  const [editorTheme, setEditorTheme] = useRecoilState(editorThemeState);
  const [responseResult, setResponseResult] =
    useRecoilState(responseResultState);

  function copy_to_clipboard() {
    const copyText =
      responseResult.out === "" ? responseResult.error : responseResult.out;
    const flag = CopyText(copyText);
    if (flag) {
      setSnackbar({
        isOpen: true,
        text: "コピーしました !",
        color: "success",
      });
    } else {
      setSnackbar({
        isOpen: true,
        text: "コピーできませんでした。",
        color: "error",
      });
    }
  }
  return (
    <>
      <h4 style={{ textAlign: "center", margin: "5px" }}>実行結果</h4>
      <div
        style={{
          backgroundColor: editorTheme.isDark === true ? "#1E1E1E" : "",
          minHeight: "130px",
          padding: "10px",
          position: "relative",
        }}
      >
        <Button
          onClick={copy_to_clipboard}
          style={{
            position: "absolute",
            right: "10px",
          }}
        >
          <b>📋 コピー</b>
        </Button>
        {responseResult.error ? (
          <code
            style={{
              whiteSpace: "pre-wrap",
              color: "red",
              overflowWrap: "break-word",
            }}
          >
            {responseResult.error}
          </code>
        ) : (
          <code
            style={{
              whiteSpace: "pre-wrap",
              color: editorTheme.isDark === true ? "white" : "black",
              overflowWrap: "break-word",
            }}
          >
            {responseResult.out}
          </code>
        )}
      </div>
    </>
  );
}
