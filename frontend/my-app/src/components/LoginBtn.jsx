import axios from "axios";
import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

import firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from "../utils/firebase/firebaseConfig";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/Auth/auth";

function FirebaseAuthGoogleButton() {
  const [auth, setAuth] = useRecoilState(authState);
  //ログインから1時間
  useEffect(() => {
    (async () => {
      //
      setAuth({
        Token: localStorage.getItem("Token"),
        refreshToken: localStorage.getItem("refreshToken"),
        name: localStorage.getItem("user_name"),
        picrure: localStorage.getItem("user_picture"),
        id: localStorage.getItem("user_id"),
        login_time: localStorage.getItem("login_time"),
      });
      //
      const loginTime = new Date(localStorage.getItem("login_time"));
      const D = new Date();
      const y = D.getFullYear();
      const month = D.getMonth();
      const d = D.getDate();
      const h = D.getHours() - 1;
      const min = D.getMinutes();
      const sec = D.getSeconds();
      var nowTime = new Date(y, month, d, h, min, sec);
      // window.alert(loginTime + "\n" + nowTime);
      if (loginTime < nowTime) {
        localStorage.removeItem("Token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_picture");
        localStorage.removeItem("user_id");
        setAuth({
          Token: "",
          refreshToken: "",
          name: "",
          picrure: "",
          id: "",
          login_time: "",
        });
      } else {
        // nothing
        //window.alert("ログイン中");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      axios
        .get(
          "https://play-lang.herokuapp.com/user/" +
            localStorage.getItem("user_id")
        )
        .then((res) => {
          localStorage.setItem("user_name", res.data.user.name);
          localStorage.setItem("user_picture", res.data.user.picture);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, []);

  const clickButton = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //ユーザー情報変数
    // DB情報
    let tmp_id = "";
    let tmp_name = "";
    let tmp_picrure = "";
    // 認証情報
    let tmp_Token = "";
    let tmp_login_time = "";
    let tmp_refreshToken = "";

    // 認証処理
    // signInWithPopupメソッドを叩くと、認証用のポップアップ画面が表示される。
    // それにTwitterのIDとパスワードを入力すると、コールバックをfirebase側が処理し、
    // 認証成功時はPromise型で認証情報を返す
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const credential = result.credential;
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const user = result.user;
        // refreshTokenはトークンを再発行させるために使う
        const refreshToken = user.refreshToken;
        // ローカルストレージにrefreshTokenを保存
        localStorage.setItem("refreshToken", refreshToken);
        tmp_refreshToken = refreshToken;

        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(function (idToken) {
            // idTokenをheadsに入れてサーバーに送信
            // idTokenはローカルストレージに保存する
            console.log(idToken);
            //ローカルストレージにTokenを保存
            localStorage.setItem("Token", idToken);
            tmp_Token = idToken;
            // ログイン時間
            localStorage.setItem("login_time", String(new Date()));
            tmp_login_time = String(new Date());
            axios
              .post(
                "https://play-lang.herokuapp.com/login",
                {},
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `${idToken}`,
                  },
                }
              )
              .then((res) => {
                console.log(res);
                // window.alert(JSON.stringify(res.data));
                localStorage.setItem("user_name", res.data.user_name);
                localStorage.setItem("user_picture", res.data.user_picture);
                localStorage.setItem("user_id", res.data.user_id);
                //
                tmp_name = res.data.user_name;
                tmp_picrure = res.data.user_picture;
                tmp_id = res.data.user_id;
                // /user/createにPost
                axios
                  .post(
                    "https://play-lang.herokuapp.com/user/create",
                    {
                      name: res.data.user_name,
                      user_id: res.data.user_id,
                      picture: res.data.user_picture,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `${idToken}`,
                      },
                    }
                  )
                  .then(function (res) {
                    console.log(res.data);
                    // userが存在していた場合
                    if (res.data.message === "already user exist") {
                      axios
                        .get(
                          "https://play-lang.herokuapp.com/user/" +
                            localStorage.getItem("user_id")
                        )
                        .then((res) => {
                          localStorage.setItem("user_name", res.data.user.name);
                          localStorage.setItem(
                            "user_picture",
                            res.data.user.picture
                          );
                          //
                          tmp_name = res.data.user.name;
                          tmp_picrure = res.data.user.picture;
                          tmp_id = res.data.user.id;
                          setAuth({
                            Token: tmp_Token,
                            refreshToken: tmp_refreshToken,
                            name: tmp_name,
                            picrure: tmp_picrure,
                            id: tmp_id,
                            login_time: tmp_login_time,
                          });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    } else {
                      //ユーザーが存在していなかった場合
                      setAuth({
                        Token: tmp_Token,
                        refreshToken: tmp_refreshToken,
                        name: tmp_name,
                        picrure: tmp_picrure,
                        id: tmp_id,
                        login_time: tmp_login_time,
                      });
                    }
                  })
                  .catch((error) => {
                    console.log("Error : " + JSON.stringify(error));
                    window.alert(
                      "サーバーでエラーが発生しました。/create/user"
                    );
                  });
                setAnchorElUser(false);
                //Login!!
                // setAuth({
                //   Token: tmp_Token,
                //   refreshToken: tmp_refreshToken,
                //   name: tmp_name,
                //   picrure: tmp_picrure,
                //   id: tmp_id,
                //   login_time: tmp_login_time,
                // });
              })
              .catch((error) => {
                console.log("Error : " + JSON.stringify(error));
                window.alert("サーバーでエラーが発生しました。");
              });
          })
          .catch(function (error) {
            window.alert("error can not get current user:" + error);
          });
        // ...
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // logOut
  function logOut() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase
      .auth()
      .signOut()
      .then((response) => {
        localStorage.removeItem("Token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_picture");
        localStorage.removeItem("user_id");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("login_time");
        setAuth({
          Token: "",
          refreshToken: "",
          name: "",
          picrure: "",
          id: "",
          login_time: "",
        });
        window.alert("ログアウトしました。");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElUser(true);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      {auth.Token ? (
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title={auth.name}>
            <IconButton sx={{ p: 0 }} onClick={handleOpenNavMenu}>
              <Avatar alt={auth.name} src={auth.picrure} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem>
              <Typography textAlign="center">
                <Link
                  href={`/user/${auth.id}`}
                  underline="none"
                  color="#1A2027"
                >
                  🧑 マイページ
                </Link>
              </Typography>
            </MenuItem>
            <MenuItem onClick={logOut}>
              <Typography textAlign="center" style={{ color: "red" }}>
                🚪 ログアウト
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Button
          color="inherit"
          onClick={clickButton}
          style={{ textTransform: "none" }}
        >
          Googleアカウントでログイン
        </Button>
      )}
    </>
  );
}

export default FirebaseAuthGoogleButton;
