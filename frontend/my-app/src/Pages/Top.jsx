import Header from "../components/Header";
import Footer from "../components/Footer";
import Editor from "@monaco-editor/react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import pythonImg from "../images/python.png";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/Auth/auth";

function Top() {
  const [auth, setAuth] = useRecoilState(authState);
  //user情報(自分のみ)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        axios
          .get("https://play-lang.herokuapp.com/user/" + "all")
          .then((res) => {
            // window.alert(JSON.stringify(res.data.user));
            console.log(res.data.user);
            setUserInfo(res.data.user);
            setLoading(false);
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

  const [userInfo, setUserInfo] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const EditordefaultValue = `def main():
    print('Hello World !!')

if __name__ == '__main__':
    main()`;
  const logoList = [{ src: pythonImg, name: "Python" }];

  const ToPlayBtn = () => {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          marginBottom: "60px",
        }}
      >
        <Button href="/play" variant="contained" disableElevation size="large">
          試してみる ▶
        </Button>
      </div>
    );
  };
  return (
    <>
      <Header />
      <Grid container spacing={2} style={{ padding: "0 2em" }}>
        <Grid item xs={6}>
          <h1>プログラムを実行しよう !! 🏃🏻</h1>
          <ul>
            <li>
              <h3>ユーザー登録なしでPythonを実行できます。</h3>
            </li>
            <li>
              <h3>
                他のユーザーが書いたコードを編集して実行することもできます。
              </h3>
            </li>
          </ul>
          <h2 style={{ fontWeight: "bolder" }}>
            他のユーザーのコードを編集しながら、プログラミングを学びましょう 🎉
          </h2>
          {auth.Token ? (
            <></>
          ) : (
            <>
              <Box
                sx={{
                  bgcolor: "info.light",
                  color: "error.contrastText",
                  p: 2,
                }}
              >
                <h3>ユーザー登録すると...</h3>
                <ul>
                  <li>書いたコードを共有・保存できます</li>
                </ul>
              </Box>
            </>
          )}

          <h3
            style={{
              textAlign: "center",
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            実行できる言語
          </h3>

          <Grid container spacing={2} style={{ padding: "0 1em" }}>
            {logoList.map((logo) => (
              <Grid
                item
                xs={4}
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  style={{ width: "100px" }}
                />
                <p>{logo.name}</p>
              </Grid>
            ))}
          </Grid>
          <h3
            style={{
              textAlign: "center",
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            ユーザー
          </h3>
          {isLoading ? (
            <Grid container spacing={2} style={{ padding: "0 1em" }}>
              <p>Loading...</p>
            </Grid>
          ) : (
            <Grid container spacing={2} style={{ padding: "0 1em" }}>
              {userInfo?.map((user, i) => (
                <Grid
                  item
                  xs={4}
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    order: -i,
                  }}
                >
                  <a
                    href={`/user/${user.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div>
                      <img
                        src={user.picture}
                        alt={user.name}
                        style={{
                          borderRadius: "50%",
                          height: "100px",
                          objectFit: "cover",
                          width: "100px",
                        }}
                      />
                      <p style={{ color: "black" }}>{user.name}</p>
                    </div>
                  </a>
                </Grid>
              ))}
            </Grid>
          )}
          <ToPlayBtn />
        </Grid>
        <Grid item xs={6}>
          <Editor
            height="40vh"
            theme="vs-dark"
            language="python"
            defaultValue={EditordefaultValue}
            options={{ readOnly: "true" }}
          />
          <div
            style={{
              backgroundColor: "#1E1E1E",
              minHeight: "130px",
              padding: "10px",
              position: "relative",
            }}
          >
            <code
              id="outPut"
              style={{
                whiteSpace: "pre-wrap",
                color: "white",
                overflowWrap: "break-word",
              }}
            >
              $ python main.py <br />
              Hello World !!
            </code>
          </div>
          <ToPlayBtn />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default Top;
