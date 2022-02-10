import Header from "../components/Header";
import Footer from "../components/Footer";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, useParams } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import { authState } from "../store/Auth/auth";
import { deleteFlagState } from "../store/User/deleteFlag";

import Skeleton from "@mui/material/Skeleton";
import Pagination from "@mui/material/Pagination";

import EditUserProfileDialog from "../components/EditUserProfileDialog";
import CreateCodeDialog from "../components/CreateCodeDialog";

import CodeCard from "../components/CodeCard";

function User() {
  let history = useHistory();
  let { page_param_user_id } = useParams();
  // auth
  const [auth, setAuth] = useRecoilState(authState);
  // get Code
  const [codeData, setCodeData] = React.useState([]);
  //コード削除
  const [deleteFlag, setDeleteFlagState] = useRecoilState(deleteFlagState);

  //pagenation
  const dataPerPage = 6;
  const [displayedItems, setDisplayedItems] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const handlePageChange = (event, value) => {
    setPageNum(value);
    setDisplayedItems(
      codeData.slice((value - 1) * dataPerPage, value * dataPerPage)
    );
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
            console.log(res.data);
            if (res.data.message === "notfound") {
              setCodeData([]);
            } else {
              const reversedData = res.data.code?.reverse();
              setCodeData(reversedData);
              setDisplayedItems(reversedData.slice(0, dataPerPage));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    })();
  }, [deleteFlag]);

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
  }, [page_param_user_id, auth.name, auth.picrure]);

  const [userInfo, setUserInfo] = useState({
    user_name: null,
    user_picture: null,
    user_id: null,
  });

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
          {codeData.length === 0 && auth.id === page_param_user_id ? (
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
                {displayedItems?.map((data, i) => (
                  <CodeCard
                    id={data.id}
                    title={data.title}
                    code_text={data.code_text}
                    page_param_user_id={page_param_user_id}
                  />
                ))}
              </Grid>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{ marginTop: "20px" }}
              >
                <Pagination
                  count={Math.ceil(codeData.length / dataPerPage)}
                  page={pageNum}
                  onChange={handlePageChange}
                  size="large"
                  color="primary"
                  style={{ marginTop: "10px" }}
                />
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
