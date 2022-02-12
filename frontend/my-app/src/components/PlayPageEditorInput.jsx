import * as React from "react";
import Editor from "@monaco-editor/react";
import Skeleton from "@mui/material/Skeleton";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { editorThemeState } from "../store/PlayPage/editorTheme";
import { inputInputDataState } from "../store/PlayPage/inputData";

export default function PlayPageEditorInput() {
  const [editorTheme, setEditorTheme] = useRecoilState(editorThemeState);
  const [inputInputData, setInputInputData] =
    useRecoilState(inputInputDataState);
  return (
    <>
      <h4 style={{ textAlign: "center", margin: "5px" }}>標準入力</h4>
      <Editor
        height="30vh"
        loading={
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"100%"}
            animation="wave"
          />
        }
        theme={editorTheme.isDark === true ? "vs-dark" : "light"}
        defaultValue={inputInputData.input}
        onChange={(value) => setInputInputData({ input: value })}
      />
    </>
  );
}
