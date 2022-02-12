import * as React from "react";

import TextField from "@mui/material/TextField";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getAuthAllData } from "../store/Auth/getAuthAllData";
import { getInputAllData } from "../store/PlayPage/getInputAllData";
import { inputTitleDataState } from "../store/PlayPage/inputData";

export default function PlayPageInputTitle(props) {
  const [auth, setAuth] = useRecoilState(getAuthAllData);
  const [inputData, setInputData] = useRecoilState(getInputAllData);

  const [inputTitleData, setInputTitleData] =
    useRecoilState(inputTitleDataState);
  return (
    <>
      {!props.code_id ? (
        <></>
      ) : props.code_id && auth.id === inputData.useId ? (
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
    </>
  );
}
