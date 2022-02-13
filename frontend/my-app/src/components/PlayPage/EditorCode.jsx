import * as React from "react";
import Editor from "@monaco-editor/react";
import Skeleton from "@mui/material/Skeleton";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { editorThemeState } from "../../store/PlayPage/editorTheme";
import { getInputAllData } from "../../store/PlayPage/getInputAllData";
import { inputCodeDataState } from "../../store/PlayPage/inputData";

export default function EditorCode() {
  const [editorTheme, setEditorTheme] = useRecoilState(editorThemeState);
  const [inputData, setInputData] = useRecoilState(getInputAllData);
  const [inputCodeData, setInputCodeData] = useRecoilState(inputCodeDataState);
  return (
    <>
      <h4 style={{ textAlign: "center", margin: "5px" }}>コード</h4>
      <Editor
        height="70vh"
        loading={
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"100%"}
            animation="wave"
          />
        }
        theme={editorTheme.isDark === true ? "vs-dark" : "light"}
        language={"python"}
        defaultValue={inputData.code}
        onChange={(value) => setInputCodeData({ code: value })}
      />
    </>
  );
}
