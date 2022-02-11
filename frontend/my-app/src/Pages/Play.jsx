import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { langs } from "../utils/langs";

import Header from "../components/Header";
import Footer from "../components/Footer";

import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { Divider } from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import { styled } from "@mui/material/styles";

import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, useParams } from "react-router-dom";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authState } from "../store/Auth/auth";

import MySnackbar from "../components/MySnackbar";
import PlayPageShareCode from "../components/PlayPageShareCode";
import PlayPageRightSideDescription from "../components/PlayPageRightSideDescription";

import { snackbarState } from "../store/PlayPage/snackbar";

import { editorThemeState } from "../store/PlayPage/editorTheme";

import { responseResultState } from "../store/PlayPage/responseResult";

import {
  inputCodeDataState,
  inputInputDataState,
  inputTitleDataState,
  inputUserIdDataState,
} from "../store/PlayPage/inputData";

import { getInputAllData } from "../store/PlayPage/getInputAllData";

import { CopyText } from "../utils/CopyText";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

function Play() {
  let history = useHistory();
  let { page_param_code_id } = useParams();

  const [auth, setAuth] = useRecoilState(authState);
  const [snackbarData, setSnackbar] = useRecoilState(snackbarState);
  const [editorTheme, setEditorTheme] = useRecoilState(editorThemeState);
  const [responseResult, setResponseResult] =
    useRecoilState(responseResultState);
  const [inputCodeData, setInputCodeData] = useRecoilState(inputCodeDataState);
  const [inputInputData, setInputInputData] =
    useRecoilState(inputInputDataState);
  const [inputTitleData, setInputTitleData] =
    useRecoilState(inputTitleDataState);
  const [inputUserIdData, setInputUserIdData] =
    useRecoilState(inputUserIdDataState);
  const [inputData, setInputData] = useRecoilState(getInputAllData);

  const codeDefaultValue = `def main():
    string = input()
    print('Hello ' + string + ' !!')

if __name__ == '__main__':
    main()`;
  const inputDefaultValue = "Python";
  //保存されたコードを取得
  useEffect(() => {
    (async () => {
      try {
        // 編集画面
        if (page_param_code_id) {
          // window.alert("id指定");
          axios
            .get(
              "https://play-lang.herokuapp.com/code/getCodeId/" +
                page_param_code_id
            )
            .then((res) => {
              console.log(res.data);
              if (res.data.message === "notfound") {
                history.push("/error/指定されたプロジェクトがありません。");
                return;
              }
              setInputTitleData({ title: res.data.code.title });
              setInputCodeData({ code: res.data.code.code_text });
              setInputInputData({ input: res.data.code.input_text });
              setInputUserIdData({ userId: res.data.code.user_id });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          setInputCodeData({ code: codeDefaultValue });
          setInputInputData({ input: inputDefaultValue });
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  function copy_to_clipboard() {
    const copyText = document.getElementById("outPut").innerText;
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
  ///
  function submit() {
    setSnackbar({ isOpen: true, text: "実行中...", color: "info" });
    setResponseResult({
      isRunning: true,
      exitCode: 0,
      out: "Running... 🏃🏻",
      error: "",
    });
    axios
      .post(
        "https://play-lang.herokuapp.com/play",
        {
          code: inputData.code,
          input: inputData.input,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setResponseResult({
          isRunning: false,
          exitCode: res.data.out !== "" ? 1 : 0, //正常終了なら0
          out: res.data.out,
          error: res.data.err,
        });
        setSnackbar({ isOpen: true, text: "実行完了 🎉", color: "success" });
        // Login userかつcode Id 指定ならCodeを更新
        if (
          auth.Token &&
          page_param_code_id &&
          auth.id === inputData.useId &&
          responseResult.exitCode === 0 //正常終了のみ保存する
        ) {
          axios
            .post(
              "https://play-lang.herokuapp.com/code/update",
              {
                id: page_param_code_id,
                title: inputData.title,
                code: inputData.code,
                input: inputData.input,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("Token"),
                },
              }
            )
            .then((res) => {
              console.log(res);
              if (res.data.message === "notfound") {
                window.alert("コードがありません");
                return;
              }
              if (res.data.error === "TokenError") {
                window.alert("再ログインしてください。");
                return;
              }
              setSnackbar({
                isOpen: true,
                text: "📋 コードを保存しました",
                color: "success",
              });
            })
            .catch((err) => {
              console.log(err);
              window.alert("コードの更新に失敗しました");
            });
        }
      })
      .catch((error) => {
        console.log("Error : " + JSON.stringify(error));
        window.alert("サーバーでエラーが発生しました。");
      });
  }

  return (
    <>
      <Header />

      <MySnackbar />

      <Box sx={{ flexGrow: 1 }} style={{ padding: "0 2em" }}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Item>
              {!page_param_code_id ? (
                <></>
              ) : page_param_code_id && auth.id === inputData.useId ? (
                <>
                  <TextField
                    label="ファイル名"
                    value={inputData.title}
                    size="small"
                    fullWidth
                    onChange={(event) =>
                      setInputTitleData({ title: event.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <TextField
                    label="ファイル名"
                    value={inputData.title}
                    size="small"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </>
              )}
              <h4 style={{ textAlign: "center", margin: "5px" }}>コード</h4>
              <Editor
                height="70vh"
                theme={editorTheme.isDark === true ? "vs-dark" : "light"}
                language={"python"}
                defaultValue={inputData.code}
                onChange={(value) => setInputCodeData({ code: value })}
              />
              <h4 style={{ textAlign: "center", margin: "5px" }}>標準入力</h4>
              <Editor
                height="30vh"
                theme={editorTheme.isDark === true ? "vs-dark" : "light"}
                defaultValue={inputData.input}
                onChange={(value) => setInputInputData({ input: value })}
              />
              <br />
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
                    id="outPut"
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
                    id="outPut"
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
            </Item>
          </Grid>
          {/* 設定(右側) */}
          <Grid item xs={3}>
            <div
              style={{
                marginBottom: "20px",
                position: "sticky",
                zIndex: "1",
                top: "10px",
              }}
            >
              <Item>
                <h4 style={{ textAlign: "center", margin: "8px" }}>設定</h4>
                <FormControl size="small">
                  <Select
                    value={editorTheme.isDark === true ? "dark" : "light"}
                    onChange={(event) =>
                      setEditorTheme({ isDark: event.target.value === "dark" })
                    }
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="light">ライト</MenuItem>
                    <MenuItem value="dark">ダーク</MenuItem>
                  </Select>
                  <FormHelperText>エディタのテーマを選択</FormHelperText>
                </FormControl>
                <br />
                <br />
                <Divider />
                <br />
                <h4 style={{ textAlign: "center", margin: "8px" }}>実行</h4>
                <FormControl size="small">
                  <Select
                    value={"python"}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {langs.map((lang) => (
                      <MenuItem value={lang.id}>{lang.title}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>実行したい言語を選択</FormHelperText>
                </FormControl>
                {responseResult.isRunning ? (
                  <>
                    <LoadingButton
                      loading
                      variant="outlined"
                      size="large"
                      style={{ marginLeft: "15px" }}
                    >
                      実行中...
                    </LoadingButton>
                  </>
                ) : (
                  <>
                    <Button
                      style={{ marginLeft: "15px" }}
                      onClick={submit}
                      variant="contained"
                      disableElevation
                      size="large"
                    >
                      実行
                    </Button>
                  </>
                )}
              </Item>
              <PlayPageRightSideDescription />
              <PlayPageShareCode
                code_id={page_param_code_id}
                title={inputData.title}
              />
            </div>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default Play;
