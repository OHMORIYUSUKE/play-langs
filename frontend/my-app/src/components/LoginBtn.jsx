import axios from "axios";

import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

import firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from "../utils/firebase/firebaseConfig";

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
              window.alert(JSON.stringify(res.data));
              localStorage.setItem("user_name", res.data.user_name);
              localStorage.setItem("user_picture", res.data.user_picture);
              localStorage.setItem("user_id", res.data.user_id);
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

function FirebaseAuthGoogleButton() {
  return (
    <>
      <Button
        color="inherit"
        onClick={clickButton}
        style={{ textTransform: "none" }}
      >
        Googleアカウントでログイン
      </Button>
    </>
  );
}

export default FirebaseAuthGoogleButton;
