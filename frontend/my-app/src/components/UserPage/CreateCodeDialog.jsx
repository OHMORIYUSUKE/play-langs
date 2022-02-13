import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, useParams } from "react-router-dom";

import {
  inputCodeDataState,
  inputInputDataState,
  inputTitleDataState,
} from "../../store/PlayPage/inputData";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export default function CreateCodeDialog() {
  let history = useHistory();

  const [openCode, setOpenCode] = React.useState(false);

  const handleClickOpenCode = () => {
    setOpenCode(true);
  };

  const handleCloseCode = () => {
    setOpenCode(false);
  };

  const [inputCodeData, setInputCodeData] = useRecoilState(inputCodeDataState);
  const [inputInputData, setInputInputData] =
    useRecoilState(inputInputDataState);
  const [inputTitleData, setInputTitleData] =
    useRecoilState(inputTitleDataState);

  // コードを作成
  const defaultCode = `def main():
  string = input()
  print('Hello ' + string + ' !!')

if __name__ == '__main__':
  main()`;

  const defaultInput = "Python";
  function createCode() {
    const inputElementURL = document.getElementById("codeTitle");
    const title = inputElementURL.value;

    if (title === "") {
      window.alert("タイトルが入力されていません。");
      return;
    }

    axios
      .post(
        "https://play-lang.herokuapp.com/code/create",
        {
          title: title,
          code: defaultCode,
          input: defaultInput,
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
        setInputCodeData({ code: defaultCode });
        setInputInputData({ input: defaultInput });
        setInputTitleData({ title: title });
        setOpenCode(false);
        window.alert("ファイルを作成しました。");
        history.push(`/play/${res.data.id.max}`);
      })
      .catch((error) => {
        console.log("Error : " + JSON.stringify(error));
        window.alert("サーバーでエラーが発生しました。/code/create");
      });

    setOpenCode(false);
  }

  return (
    <>
      <Dialog open={openCode} onClose={handleCloseCode}>
        <DialogTitle>ファイル名を入力</DialogTitle>
        <DialogContent>
          <DialogContentText>
            コードを入力するファイルを作成しましょう。ファイル名前を入力してください。
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="codeTitle"
            label="ファイル名"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleCloseCode}>
            閉じる
          </Button>
          <Button onClick={createCode} variant="contained" disableElevation>
            作成
          </Button>
        </DialogActions>
      </Dialog>
      {/* ページに配置するボタン */}
      <Button
        style={{ marginBottom: "1.3em" }}
        onClick={handleClickOpenCode}
        variant="contained"
        disableElevation
        size="large"
      >
        プロジェクトを作成する
      </Button>
    </>
  );
}