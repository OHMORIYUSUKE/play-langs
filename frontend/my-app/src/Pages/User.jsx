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

import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, useParams } from "react-router-dom";

function User() {
  let history = useHistory();
  let { page_param_user_id } = useParams();
  // get Code
  const [codeData, setCodeData] = React.useState({});
  useEffect(() => {
    (async () => {
      try {
        axios
          .get(
            "https://play-lang.herokuapp.com/code/getUserId/" +
              page_param_user_id
          )
          .then((res) => {
            console.log(res.data);
            setCodeData(res.data);
            // window.alert(JSON.stringify(res.data));
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  //userInfo
  useEffect(() => {
    (async () => {
      try {
        axios
          .get("https://play-lang.herokuapp.com/user/" + page_param_user_id)
          .then((res) => {
            // window.alert(JSON.stringify(res.data.user));
            console.log(res);
            if (res.data.message === "notfound") {
              history.push("/error/ユーザーが存在しません");
              return;
            }
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
  }, [page_param_user_id]);

  const [userInfo, setUserInfo] = useState({
    user_name: null,
    user_picture: null,
    user_id: null,
  });

  // プロフィール
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // コードを作成
  const [openCode, setOpenCode] = React.useState(false);

  const handleClickOpenCode = () => {
    setOpenCode(true);
  };

  const handleCloseCode = () => {
    setOpenCode(false);
  };

  function editProfile() {
    const inputElementURL = document.getElementById("name");
    const name = inputElementURL.value;

    if (name === "") {
      window.alert("ユーザー名が入力されていません。");
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
        if (res.data.error === "TokenError") {
          window.alert("再ログインしてください。");
        }
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

  // コードを作成
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
          code: "",
          input: "",
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
        }
        setOpenCode(false);
        window.alert("ファイルを作成しました。");
      })
      .catch((error) => {
        console.log("Error : " + JSON.stringify(error));
        window.alert("サーバーでエラーが発生しました。/code/create");
      });

    setOpen(false);
  }

  const { user_id, user_name, user_picture } = userInfo;

  const posts = [
    "111111",
    "111111",
    "111111",
    "111111",
    "111111",
    "111111",
    "111111",
  ];
  const EditordefaultValue = `def main():
  print('Hello World !!')

if __name__ == '__main__':
  main()`;
  return (
    <>
      <Header />
      <Box sx={{ flexGrow: 1 }} style={{ padding: "0 10em" }}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <img src={user_picture} alt="" style={{ borderRadius: "50%" }} />
          </Grid>
          <Grid item xs={7}>
            <h1>{user_name}</h1>
          </Grid>
          <Grid item xs={3}>
            {localStorage.getItem("user_id") !== page_param_user_id ? (
              <></>
            ) : (
              <>
                <Button
                  onClick={handleClickOpen}
                  variant="contained"
                  disableElevation
                  size="large"
                >
                  編集
                </Button>
              </>
            )}
          </Grid>
          {/* ダイアログ プロフィールを編集 */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>ユーザー名を入力</DialogTitle>
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

          {/* ダイアログ コードを作成 */}
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
              <Button style={{ color: "red" }} onClick={handleCloseCode}>
                閉じる
              </Button>
              <Button onClick={createCode}>作成</Button>
            </DialogActions>
          </Dialog>
          {/* --ダイアログ-- */}
        </Grid>
        <Box
          sx={{ flexGrow: 1 }}
          style={{ padding: "0 0em", marginTop: "1em" }}
        >
          <Button
            style={{ marginTop: "1.3em" }}
            onClick={handleClickOpenCode}
            variant="contained"
            disableElevation
            size="large"
          >
            プロジェクトを作成する
          </Button>
          {codeData.message === "notfound" ? (
            <>
              <div style={{ textAlign: "center", marginBottom: 50 }}>
                <h2>
                  プロジェクトがありません。
                  <br />
                  プロジェクトを作成しましょう !!
                </h2>
              </div>
            </>
          ) : (
            <>
              <Grid container spacing={2}>
                {posts.map((data, idx) => (
                  <Grid item xs={4}>
                    <h2>title</h2>
                    <Editor
                      height="40vh"
                      theme="vs-dark"
                      language="python"
                      defaultValue={EditordefaultValue}
                      options={{
                        readOnly: "true",
                        minimap: {
                          enabled: false,
                        },
                      }}
                    />
                  </Grid>
                ))}
                <p>{JSON.stringify(codeData)}</p>
              </Grid>
            </>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
}

export default User;
