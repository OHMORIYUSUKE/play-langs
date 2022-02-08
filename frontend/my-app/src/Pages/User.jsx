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
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { dateTime2Tokyo } from "../utils/dateTime2Tokyo";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, useParams } from "react-router-dom";

import loadingImage from "../images/Spinner-2.gif";

import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/Auth/auth";

import Skeleton from "@mui/material/Skeleton";

import EditUserProfileDialog from "../components/EditUserProfileDialog";
import CreateCodeDialog from "../components/CreateCodeDialog";

function User() {
  let history = useHistory();
  let { page_param_user_id } = useParams();

  //
  const [auth, setAuth] = useRecoilState(authState);
  // get Code
  const [codeData, setCodeData] = React.useState({});

  //コード削除
  const [delFlag, setDelFlag] = React.useState(false);

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
  }, [delFlag]);

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
              <Skeleton
                variant="circular"
                style={{ width: "110px", height: "110px" }}
              />
            )}
          </Grid>
          <Grid item xs={7}>
            {user_picture ? (
              <h1>{user_name}</h1>
            ) : (
              <Typography variant="h2" style={{ width: "80%" }}>
                <Skeleton />
              </Typography>
            )}
          </Grid>
          <Grid item xs={2}>
            {auth.id !== page_param_user_id ? (
              <></>
            ) : (
              <>
                <EditUserProfileDialog />
              </>
            )}
          </Grid>
          <Grid item xs={1}>
            <a
              class="twitter"
              href={`http://twitter.com/share?text=${user_name}&hashtags=${"PlayLang"}&url=${
                "https://play-lang.netlify.app/user/" + user_id
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Avatar
                sx={{ width: 50, height: 50 }}
                src="https://img.icons8.com/color/240/000000/twitter-circled--v1.png"
                alt=""
              />
            </a>
          </Grid>
        </Grid>
        <Box
          sx={{ flexGrow: 1 }}
          style={{ padding: "0 0em", marginTop: "2.3em" }}
        >
          {auth.id !== page_param_user_id ? (
            <></>
          ) : (
            <>
              <CreateCodeDialog />
            </>
          )}
          {codeData.message === "notfound" && auth.id === page_param_user_id ? (
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
                    {auth.id !== page_param_user_id ? (
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
