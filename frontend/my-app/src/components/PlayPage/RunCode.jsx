import * as React from "react";
import axios from "axios";

import LoadingButton from "@mui/lab/LoadingButton";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getAuthAllData } from "../../store/Auth/getAuthAllData";
import { getInputAllData } from "../../store/PlayPage/getInputAllData";

import { snackbarState } from "../../store/PlayPage/snackbar";
import { responseResultState } from "../../store/PlayPage/responseResult";

export default function RunCode(props) {
  const [auth, setAuth] = useRecoilState(getAuthAllData);
  const [inputData, setInputData] = useRecoilState(getInputAllData);

  const [snackbarData, setSnackbar] = useRecoilState(snackbarState);
  const [responseResult, setResponseResult] =
    useRecoilState(responseResultState);

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
          exitCode: res.data.out !== "" ? 0 : 1, //正常終了なら0
          out: res.data.out,
          error: res.data.err,
        });
        if ((res.data.out !== "" ? 0 : 1) === 0) {
          setSnackbar({ isOpen: true, text: "実行完了 🎉", color: "success" });
        } else {
          setSnackbar({ isOpen: true, text: "エラー 😢", color: "error" });
        }
        // Login userかつcode Id 指定ならCodeを更新
        if (
          auth.token &&
          props.code_id &&
          auth.id === inputData.useId &&
          (res.data.out !== "" ? 0 : 1) === 0 //正常終了なら保存
        ) {
          axios
            .post(
              "https://play-lang.herokuapp.com/code/update",
              {
                id: props.code_id,
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
      <h4 style={{ textAlign: "center", margin: "8px" }}>実行</h4>
      <FormControl size="small">
        <Select
          value={"python"}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value={"python"}>{"Python"}</MenuItem>
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
    </>
  );
}
