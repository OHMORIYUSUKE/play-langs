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

function FirebaseAuthGoogleButton() {
  //リフレッシュ
  useEffect(() => {
    (async () => {
      try {
        // リフレッシュトークン
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", localStorage.getItem("refresh_token"));
        axios
          .post(
            `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`,
            params,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
          .then((response) => {
            localStorage.removeItem("Token");
            localStorage.setItem("Token", response.data.access_token);
            localStorage.removeItem("refreshToken");
            localStorage.setItem("refreshToken", response.data.refresh_token);
          })
          .catch((err) => {
            console.log(err);
          });
        ////////////////////////////////////////////////////////////////////
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);
  const clickButton = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

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

        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(function (idToken) {
            // idTokenをheadsに入れてサーバーに送信
            // idTokenはローカルストレージに保存する
            console.log(idToken);
            //ローカルストレージにTokenを保存
            localStorage.setItem("Token", idToken);
            axios
              .post(
                // http://localhost:3031/api/v1/play
                // https://play-lang.herokuapp.com/play
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
                setToken(true);
                // window.alert(JSON.stringify(res.data));
                localStorage.setItem("user_name", res.data.user_name);
                localStorage.setItem("user_picture", res.data.user_picture);
                localStorage.setItem("user_id", res.data.user_id);

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
                      },
                    }
                  )
                  .then(function (res) {
                    console.log(res.data);
                  })
                  .catch((error) => {
                    console.log("Error : " + JSON.stringify(error));
                    window.alert(
                      "サーバーでエラーが発生しました。/create/user"
                    );
                  });
                setUserInfo({
                  user_name: localStorage.getItem("user_name"),
                  user_picture: localStorage.getItem("user_picture"),
                });
                setAnchorElUser(false);
                //Login!!
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
        setUserInfo({
          user_name: localStorage.getItem("user_name"),
          user_picture: localStorage.getItem("user_picture"),
        });
        setToken(false);
        window.alert("ログアウトしました。");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const TokenFlag = localStorage.getItem("Token") ? true : false;
  const [Token, setToken] = useState(TokenFlag);
  const [userInfo, setUserInfo] = useState({
    user_name: localStorage.getItem("user_name"),
    user_picture: localStorage.getItem("user_picture"),
  });
  const { user_name, user_picture } = userInfo;

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElUser(true);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      {Token ? (
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title={user_name}>
            <IconButton sx={{ p: 0 }} onClick={handleOpenNavMenu}>
              <Avatar alt={user_name} src={user_picture} />
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
                <Link href="/myPage" underline="none" color="#1A2027">
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
