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
import { Divider } from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

function Play() {
  const defaultCode = `def main():
  string = input()
  print('Hello ', string , ' !!')

if __name__ == '__main__':
  main()`;

  const defaultInput = "Python";

  const [alertState, setStateAlert] = useState({
    open: false,
    text: "",
  });
  const [resState, setStateRes] = useState({
    waiting: false,
  });
  const { waiting } = resState;
  const { open, text } = alertState;
  function handleClose() {
    setStateAlert({ open: false });
  }
  //ip
  const ipaddress = window.location.hostname;
  //
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

  /////
  let colorOutBackGround = "#1E1E1E";
  let colorOutFont = "white";
  if (mode === "light") {
    colorOutBackGround = "";
    colorOutFont = "black";
  }

  const handleChangeMode = (event) => {
    setMode(event.target.value);
  };
  ///////////
  function copyToClipboard(textToCopy) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
    } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        // here the magic happens
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  }
  function copy_to_clipboard() {
    let element = document.getElementById("outPut");
    var copyText = element.innerText;
    try {
      copyToClipboard(copyText);
      //window.alert("コピーしました。");
      setStateAlert({ open: true, text: "コピーしました ❕" });
    } catch (error) {
      window.alert("コピーできませんでした。");
    }
  }
  ///
  function submit() {
    if (lang === "") {
      window.alert("言語の種類が選択されていません。");
      return;
    }
    setStateRes({ waiting: true });
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
        setStateAlert({ open: true, text: "実行完了 🎉" });
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

  return (
    <>
      <Header />
      <Snackbar
        autoHideDuration={3500}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={handleClose}
      >
        <MuiAlert
          color="success"
          severity="success"
          elevation={6}
          variant="filled"
        >
          {text}
        </MuiAlert>
      </Snackbar>
      {/* 実行中 */}
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={waiting}
        onClose={handleClose}
        message="I love snacks"
      >
        <MuiAlert color="info" severity="info" elevation={6} variant="filled">
          実行中...
        </MuiAlert>
      </Snackbar>
      {/*  */}
      <Box sx={{ flexGrow: 1 }} style={{ padding: "0 2em" }}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Item>
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
                    <Button
                      style={{ marginLeft: "15px" }}
                      onClick={submit}
                      variant="contained"
                      disableElevation
                      size="large"
                      disabled
                    >
                      実行中...
                    </Button>
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
                <p>
                  <b>Java </b>を実行する際は、実行クラスの名前を<b> hello </b>
                  にしてください。
                </p>
              </Item>
            </div>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default Play;
