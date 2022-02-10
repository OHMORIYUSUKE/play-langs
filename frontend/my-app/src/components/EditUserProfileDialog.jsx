import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/Auth/auth";

export default function EditUserProfileDialog() {
  //
  const [auth, setAuth] = useRecoilState(authState);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function editProfile() {
    const inputElementURL = document.getElementById("name");
    const name = inputElementURL.value;

    axios
      .post(
        "https://play-lang.herokuapp.com/user/update",
        {
          name: name ? name : localStorage.getItem("user_name"),
          picture: imageData ? imageData : localStorage.getItem("user_picture"),
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
          window.alert("再ログインしてください。");
          return;
        }
        localStorage.setItem(
          "user_picture",
          imageData ? imageData : localStorage.getItem("user_picture")
        );
        localStorage.setItem("user_name", res.data.message);
        //
        setAuth({
          // DB情報
          id: localStorage.getItem("user_id"),
          name: name ? name : localStorage.getItem("user_name"),
          picrure: imageData ? imageData : localStorage.getItem("user_picture"),
          // 認証情報
          Token: localStorage.getItem("Token"),
          login_time: localStorage.getItem("login_time"),
          refreshToken: localStorage.getItem("refreshToken"),
        });
      })
      .catch((error) => {
        console.log("Error : " + JSON.stringify(error));
        window.alert("サーバーでエラーが発生しました。/user/update");
      });

    setOpen(false);
  }

  //base64
  const [imageData, setImageData] = React.useState(auth.picrure);
  function onFileChange(e) {
    const files = e.target.files;

    if (files.length > 0) {
      var file = files[0];
      var reader = new FileReader();
      reader.onload = (e) => {
        setImageData(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageData(null);
    }
  }

  function resetInput() {
    setImageData(null);
  }
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ユーザー情報を入力</DialogTitle>
        <DialogContent>
          <DialogContent>
            このWEBサイトで使用されるアカウント情報を編集できます。
          </DialogContent>
          <DialogContentText>アカウント名を変更できます。</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="名前"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={auth.name}
          />
          <div style={{ marginTop: "20px" }}>
            <DialogContentText>アイコン画像を変更できます。</DialogContentText>
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <FormControl>
                <Button
                  component="label"
                  size="small"
                  variant="contained"
                  disableElevation
                >
                  ファイル選択する
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      onFileChange(e);
                    }}
                    style={{
                      opacity: "0",
                      appearance: "none",
                      position: "absolute",
                    }}
                  />
                </Button>
                <FormHelperText>
                  {imageData
                    ? "以下の画像が選択されています"
                    : "画像が選択されていません"}
                </FormHelperText>
              </FormControl>
              <Button
                type="button"
                size="small"
                onClick={resetInput}
                style={{ marginLeft: "10px" }}
              >
                リセットする
              </Button>
            </div>
            {imageData ? (
              <img
                src={imageData}
                alt="画像"
                style={{ width: "100%", border: "5px solid #1976D2" }}
              />
            ) : (
              <></>
            )}
          </div>
          {/*  */}
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            閉じる
          </Button>
          <Button onClick={editProfile} variant="contained" disableElevation>
            更新
          </Button>
        </DialogActions>
      </Dialog>
      {/* ページに配置するボタン */}
      <Button
        onClick={handleClickOpen}
        variant="contained"
        disableElevation
        size="large"
      >
        編集
      </Button>
    </>
  );
}
