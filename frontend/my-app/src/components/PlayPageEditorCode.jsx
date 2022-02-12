import * as React from "react";
import Editor from "@monaco-editor/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { editorThemeState } from "../store/PlayPage/editorTheme";
import { inputCodeDataState } from "../store/PlayPage/inputData";

export default function PlayPageEditorCode() {
  const [editorTheme, setEditorTheme] = useRecoilState(editorThemeState);
  const [inputCodeData, setInputCodeData] = useRecoilState(inputCodeDataState);

  return (
    <>
      <h4 style={{ textAlign: "center", margin: "5px" }}>コード</h4>
      <Editor
        height="70vh"
        theme={editorTheme.isDark === true ? "vs-dark" : "light"}
        language={"python"}
        defaultValue={inputCodeData.code}
        onChange={(value) => setInputCodeData({ code: value })}
      />
    </>
  );
}
