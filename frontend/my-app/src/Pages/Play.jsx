import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { langs } from "../utils/langs";

import Header from "../components/Header";
import Footer from "../components/Footer";

import InputLabel from "@mui/material/InputLabel";
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
import SaveIcon from "@mui/icons-material/Save";

import Avatar from "@mui/material/Avatar";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { styled } from "@mui/material/styles";

import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, useParams } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/Auth/auth";

import MySnackbar from "../components/MySnackbar";

import { SnackbarState } from "../store/PlayPage/Snackbar";

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
  const [SnackbarData, setSnackbar] = useRecoilState(SnackbarState);

  //保存されたコードを取得
  // コードを管理
  const [codeData, setCodeData] = useState({
    defaultCode: `def main():
    string = input()
    print('Hello ' + string + ' !!')
  
if __name__ == '__main__':
    main()`,
    defaultInput: "Python",
    defaultTitle: "",
  });
  const { defaultCode, defaultInput, defaultTitle, user_id } = codeData;
  useEffect(() => {
    (async () => {
      try {
        // 編集画面
        if (page_param_code_id !== "") {
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
              setCodeData({
                defaultCode: res.data.code.code_text,
                defaultInput: res.data.code.input_text,
                defaultTitle: res.data.code.title,
                user_id: res.data.code.user_id,
              });
              setTitleValue(res.data.code.title);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const [resState, setStateRes] = useState({
    waiting: false,
  });
  const { waiting } = resState;

  const [response, setResponse] = useState({
    out: "",
    err: "",
  });
  const editorRef = useRef(null);
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const editorRefIn = useRef(null);
  function handleEditorDidMountIn(editor, monaco) {
    editorRefIn.current = editor;
  }
  ///////////
  const [lang, setLang] = useState("python");

  const handleChangelang = (event) => {
    setLang(event.target.value);
  };

  const [mode, setMode] = useState("vs-dark");

  // /////
  let colorOutBackGround = "#1E1E1E";
  let colorOutFont = "white";
  if (mode === "light") {
    colorOutBackGround = "";
    colorOutFont = "black";
  }

  const handleChangeMode = (event) => {
    setMode(event.target.value);
  };
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
    if (lang === "") {
      window.alert("言語の種類が選択されていません。");
      return;
    }
    setStateRes({ waiting: true });
    setSnackbar({ isOpen: true, text: "実行中...", color: "info" });
    setResponse({ out: "Running... 🏃🏻" });
    axios
      .post(
        "https://play-lang.herokuapp.com/play",
        {
          code: editorRef.current.getValue(),
          input: editorRefIn.current.getValue(),
          lang: lang,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setResponse(res.data);
        setStateRes({ waiting: false });
        setSnackbar({ isOpen: true, text: "実行完了 🎉", color: "success" });
        // Login userかつcode Id 指定ならCodeを更新
        if (auth.Token && page_param_code_id && auth.id === user_id) {
          const inputElementURL = document.getElementById("codeTitle");
          const title = inputElementURL.value;
          axios
            .post(
              "https://play-lang.herokuapp.com/code/update",
              {
                id: page_param_code_id,
                title: title,
                code: editorRef.current.getValue(),
                input: editorRefIn.current.getValue(),
                lang: lang,
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
        setStateRes({ waiting: false });
        setResponse({
          err:
            "サーバーでエラーが発生しました。⚠\nError Message : " +
            error.message,
        });
        window.alert("サーバーでエラーが発生しました。");
      });
  }
  // input Title 用
  const [title, setTitleValue] = useState();

  const handleChangeTitle = (event) => {
    setTitleValue(event.target.value);
  };

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
              ) : page_param_code_id && auth.id === user_id ? (
                <>
                  <TextField
                    label="ファイル名"
                    id="codeTitle"
                    value={title}
                    size="small"
                    fullWidth
                    onChange={handleChangeTitle}
                  />
                </>
              ) : (
                <>
                  <TextField
                    label="ファイル名"
                    value={defaultTitle}
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
                theme={mode}
                language={lang}
                defaultValue={defaultCode}
                onMount={handleEditorDidMount}
              />
              <h4 style={{ textAlign: "center", margin: "5px" }}>標準入力</h4>
              <Editor
                height="30vh"
                theme={mode}
                defaultValue={defaultInput}
                onMount={handleEditorDidMountIn}
              />
              <br />
              <h4 style={{ textAlign: "center", margin: "5px" }}>実行結果</h4>
              <div
                style={{
                  backgroundColor: colorOutBackGround,
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
                {response.err ? (
                  <code
                    id="outPut"
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "red",
                      overflowWrap: "break-word",
                    }}
                  >
                    {response.err}
                  </code>
                ) : (
                  <code
                    id="outPut"
                    style={{
                      whiteSpace: "pre-wrap",
                      color: colorOutFont,
                      overflowWrap: "break-word",
                    }}
                  >
                    {response.out}
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
                    value={mode}
                    onChange={handleChangeMode}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value="light">ライト</MenuItem>
                    <MenuItem value="vs-dark">ダーク</MenuItem>
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
                    value={lang}
                    onChange={handleChangelang}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {langs.map((lang) => (
                      <MenuItem value={lang.id}>{lang.title}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>実行したい言語を選択</FormHelperText>
                </FormControl>
                {waiting ? (
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
              <Item style={{ marginTop: "1rem" }}>
                <h4 style={{ textAlign: "center", margin: "8px" }}>注意事項</h4>
                <p>３秒以内で実行できるコードにしてください。</p>
                <p>※入力されたコードはPython 3.10.0で実行されます。</p>
              </Item>
              {page_param_code_id ? (
                <Item style={{ marginTop: "1rem" }}>
                  <h4 style={{ textAlign: "center", margin: "8px" }}>
                    コードを共有
                  </h4>
                  <a
                    href={`http://twitter.com/share?text=${defaultTitle}&hashtags=${"PlayLang"}&url=${
                      "https://play-lang.netlify.app/play/" + page_param_code_id
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
              ) : (
                <></>
              )}
            </div>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default Play;
