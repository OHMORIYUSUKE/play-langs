import Header from "../components/Header";
import Footer from "../components/Footer";
import Editor from "@monaco-editor/react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { dateTime2Tokyo } from "../utils/dateTime2Tokyo";

import React, { useState, useEffect } from "react";
import axios from "axios";

function MyPage() {
  useEffect(() => {
    (async () => {
      try {
        axios
          .get(
            "https://play-lang.herokuapp.com/user/" +
              localStorage.getItem("user_id")
          )
          .then((res) => {
            // window.alert(JSON.stringify(res.data.user));
            console.log(res);
            setUserInfo({
              user_name: res.data.user[1],
              user_picture: res.data.user[2],
              user_id: res.data.user[0],
              created_at: res.data.user[3],
            });
          })
          .catch((error) => {
            console.log("Error : " + JSON.stringify(error));
            window.alert("サーバーでエラーが発生しました。");
          });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const [userInfo, setUserInfo] = useState({
    user_name: null,
    user_picture: null,
    user_id: null,
  });

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

    if (name === "") {
      window.alert("入力されていません。");
      return;
    }

    axios
      .post(
        "https://play-lang.herokuapp.com/user/update",
        {
          name: name,
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
        localStorage.setItem("user_name", res.data.message);
        setUserInfo({
          user_id: localStorage.getItem("user_id"),
          user_name: localStorage.getItem("user_name"),
          user_picture: localStorage.getItem("user_picture"),
        });
      })
      .catch((error) => {
        console.log("Error : " + JSON.stringify(error));
        window.alert("サーバーでエラーが発生しました。/user/update");
      });

    setOpen(false);
  }

  const { user_id, user_name, user_picture } = userInfo;

  return (
    <>
      <Header />
      <Box sx={{ flexGrow: 1 }} style={{ padding: "0 10em" }}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <img src={user_picture} alt="" style={{ borderRadius: "50%" }} />
          </Grid>
          <Grid item xs={10}>
            <p>ユーザーid : {user_id}</p>
            <h1>{user_name}</h1>
            <Button
              onClick={handleClickOpen}
              variant="contained"
              disableElevation
              size="large"
            >
              編集
            </Button>
            {/* ダイアログ */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Subscribe</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  このWEBサイトで使用されるアカウント名を変更できます。
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="名前"
                  type="text"
                  fullWidth
                  variant="standard"
                />
              </DialogContent>
              <DialogActions>
                <Button style={{ color: "red" }} onClick={handleClose}>
                  閉じる
                </Button>
                <Button onClick={editProfile}>更新</Button>
              </DialogActions>
            </Dialog>
            {/* --ダイアログ-- */}
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default MyPage;
