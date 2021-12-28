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

import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

function Play() {
  const [response, setResponse] = useState([]);
  const editorRef = useRef(null);
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const editorRefIn = useRef(null);
  function handleEditorDidMountIn(editor, monaco) {
    editorRefIn.current = editor;
  }
  ///////////
  const [lang, setLang] = useState("c");

  const handleChangelang = (event) => {
    setLang(event.target.value);
  };

  const [mode, setMode] = useState("vs-dark");

  const handleChangeMode = (event) => {
    setMode(event.target.value);
  };
  ///////////
  function submit() {
    if (lang === "") {
      window.alert("言語の種類が選択されていません。");
      return;
    }

    axios
      .post(
        "http://localhost:3031/api/v1/play",
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
      })
      .catch((error) => {
        console.log("Error : " + JSON.stringify(error.response));
      });
  }

  return (
    <>
      <Header />
      <Box sx={{ flexGrow: 1 }} style={{ padding: "0 2em" }}>
        <h2>コードを実行</h2>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Item>
              <h4 style={{ textAlign: "center", margin: "5px" }}>コード</h4>
              <Editor
                height="60vh"
                theme={mode}
                language={lang}
                onMount={handleEditorDidMount}
              />
              <h4 style={{ textAlign: "center", margin: "5px" }}>標準入力</h4>
              <Editor
                height="30vh"
                theme={mode}
                onMount={handleEditorDidMountIn}
              />
              <br />
              <h4 style={{ textAlign: "center", margin: "5px" }}>実行結果</h4>
              {response.err ? (
                <div
                  style={{ backgroundColor: "rgb(29, 31, 33)", padding: "2px" }}
                >
                  <code
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "white",
                    }}
                    dangerouslySetInnerHTML={{ __html: response.err }}
                  ></code>
                </div>
              ) : (
                <div
                  style={{ backgroundColor: "rgb(29, 31, 33)", padding: "2px" }}
                >
                  <code
                    style={{
                      whiteSpace: "pre-wrap",
                      color: "white",
                    }}
                    dangerouslySetInnerHTML={{ __html: response.out }}
                  ></code>
                </div>
              )}
            </Item>
          </Grid>
          <Grid item xs={3}>
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
              <Button
                style={{ marginLeft: "15px" }}
                onClick={submit}
                variant="contained"
                disableElevation
                size="large"
              >
                実行
              </Button>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default Play;
