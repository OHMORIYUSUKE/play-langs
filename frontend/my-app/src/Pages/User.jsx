import Header from "../components/Header";
import Footer from "../components/Footer";
import Editor from "@monaco-editor/react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

import { dateTime2Tokyo } from "../utils/dateTime2Tokyo";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, useParams } from "react-router-dom";

import loadingImage from "../images/Spinner-2.gif";

function User() {
  let history = useHistory();
  let { page_param_user_id } = useParams();
  // get Code
  const [codeData, setCodeData] = React.useState({});

  // プロフィール
  const [open, setOpen] = React.useState(false);

  //コード削除
  const [delFlag, setDelFlag] = React.useState(false);

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

  useEffect(() => {
    (async () => {
      try {
        axios
          .get(
            "https://play-lang.herokuapp.com/code/getUserId/" +
              page_param_user_id
          )
          .then((res) => {
            setCodeData(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [openCode, delFlag]);

  //userInfo
  useEffect(() => {
    (async () => {
      try {
        axios
          .get("https://play-lang.herokuapp.com/user/" + page_param_user_id)
          .then((res) => {
            // window.alert(JSON.stringify(res.data.user));
            console.log(res.data.user);
            if (res.data.message === "notfound") {
              history.push("/error/ユーザーが存在しません。");
              return;
            }
            setUserInfo({
              user_name: res.data.user.name,
              user_picture: res.data.user.picture,
              user_id: res.data.user.id,
              created_at: res.data.user.created_at,
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
        setOpenCode(false);
        window.alert("ファイルを作成しました。");
        history.push(`/play/${res.data.id.max}`);
      })
      .catch((error) => {
        console.log("Error : " + JSON.stringify(error));
        window.alert("サーバーでエラーが発生しました。/code/create");
      });

    setOpen(false);
  }

  function deleteCode(id) {
    var result = window.confirm("コードを削除しますか？");

    if (result) {
    } else {
      return;
    }
    axios
      .post(
        "https://play-lang.herokuapp.com/code/delete",
        {
          id: id,
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
        window.alert("ファイルを削除しました。");
        setDelFlag(true);
      })
      .catch((error) => {
        console.log("Error : " + JSON.stringify(error));
        window.alert("サーバーでエラーが発生しました。/code/delete");
      });
  }

  const { user_id, user_name, user_picture } = userInfo;

  //base64
  const [imageData, setImageData] = React.useState(null);
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
      <Header />
      <Box sx={{ flexGrow: 1 }} style={{ padding: "0 10em" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}>
            {user_picture ? (
              <img
                src={user_picture}
                alt="プロフィール画像"
                style={{
                  borderRadius: "50%",
                  width: "110px",
                  height: "110px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <img
                src={loadingImage}
                alt="プロフィール画像"
                style={{
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                }}
              />
            )}
          </Grid>
          <Grid item xs={7}>
            <h1>{user_name}</h1>
          </Grid>
          <Grid item xs={2}>
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
          <Grid item xs={1}>
            <a
              class="twitter"
              href={`http://twitter.com/share?text=${user_name}&hashtags=${"PlayLang"}&url=${
                "https://play-lang.netlify.app/play/" + user_id
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.icons8.com/color/48/000000/twitter-circled--v1.png"
                alt=""
              />
            </a>
          </Grid>
          {/* ダイアログ プロフィールを編集 */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>ユーザー情報を入力</DialogTitle>
            <DialogContent>
              <DialogContent>
                このWEBサイトで使用されるアカウント情報を編集できます。
              </DialogContent>
              <DialogContentText>
                アカウント名を変更できます。
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
              <div style={{ marginTop: "20px" }}>
                <DialogContentText>
                  アイコン画像を変更できます。
                </DialogContentText>
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
          {localStorage.getItem("user_id") !== page_param_user_id ? (
            <></>
          ) : (
            <>
              <Button
                style={{ marginTop: "1.3em", marginBottom: "1.3em" }}
                onClick={handleClickOpenCode}
                variant="contained"
                disableElevation
                size="large"
              >
                プロジェクトを作成する
              </Button>
            </>
          )}
          {codeData.message === "notfound" &&
          localStorage.getItem("user_id") === page_param_user_id ? (
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
                {codeData.code?.map((data, i) => (
                  <Grid item xs={4} style={{ order: -i }}>
                    <Link
                      href={`/play/${data.id}`}
                      style={{ fontSize: "1.2rem" }}
                    >
                      {data.title}
                    </Link>
                    {localStorage.getItem("user_id") !== page_param_user_id ? (
                      <></>
                    ) : (
                      <>
                        <div style={{ float: "right" }}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => deleteCode(data.id)}
                          >
                            削除
                          </Button>
                        </div>
                      </>
                    )}
                    <Editor
                      height="40vh"
                      theme="vs-dark"
                      language="python"
                      defaultValue={data.code_text}
                      options={{
                        readOnly: "true",
                        lineNumbers: false,
                        minimap: {
                          enabled: false,
                        },
                      }}
                    />
                  </Grid>
                ))}
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
