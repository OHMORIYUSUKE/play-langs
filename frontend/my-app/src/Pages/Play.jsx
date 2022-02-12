import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { Divider } from "@mui/material";

import { styled } from "@mui/material/styles";

import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, useParams } from "react-router-dom";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import MySnackbar from "../components/PlayPage/MySnackbar";
import ShareCode from "../components/PlayPage/ShareCode";
import Description from "../components/PlayPage/Description";

import {
  inputCodeDataState,
  inputInputDataState,
  inputTitleDataState,
  inputUserIdDataState,
} from "../store/PlayPage/inputData";

import { getInputAllData } from "../store/PlayPage/getInputAllData";

import InputTitle from "../components/PlayPage/InputTitle";
import EditorCode from "../components/PlayPage/EditorCode";
import EditorInput from "../components/PlayPage/EditorInput";
import Output from "../components/PlayPage/Output";
import RunCode from "../components/PlayPage/RunCode";

import ThemeBtn from "../components/PlayPage/ThemeBtn";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

function Play() {
  let history = useHistory();
  let { page_param_code_id } = useParams();

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

  return (
    <>
      <Header />

      <MySnackbar />

      <Box sx={{ flexGrow: 1 }} style={{ padding: "0 2em" }}>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Item>
              <InputTitle code_id={page_param_code_id} />
              <EditorCode />
              <EditorInput />
              <br />
              <Output />
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
                <ThemeBtn />
                <br />
                <br />
                <Divider />
                <br />
                <RunCode code_id={page_param_code_id} />
              </Item>
              <Description />
              <ShareCode code_id={page_param_code_id} title={inputData.title} />
            </div>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default Play;
