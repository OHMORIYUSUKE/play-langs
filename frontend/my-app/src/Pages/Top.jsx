import Header from "../components/Header";
import Footer from "../components/Footer";
import Editor from "@monaco-editor/react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import pythonImg from "../images/python.png";

function Top() {
  const EditordefaultValue = `def main():
    print('Hello World !!')

if __name__ == '__main__':
    main()`;
  const logoList = [{ src: pythonImg, name: "Python" }];
  const logoStyle = {
    width: "60%",
  };
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
          <h3>ユーザー登録なしでPythonを実行できます。</h3>
          <Box sx={{ bgcolor: "info.main", color: "error.contrastText", p: 2 }}>
            <h3>ユーザー登録すると...</h3>
            <ul>
              <li>書いたコードを共有・保存できます</li>
            </ul>
          </Box>

          <h3
            style={{
              textAlign: "center",
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            実行できる言語
          </h3>
          <Grid container spacing={2} style={{ padding: "0 3em" }}>
            {logoList.map((logo) => (
              <Grid
                item
                xs={4}
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <img src={logo.src} alt={logo.name} style={logoStyle} />
                <p>{logo.name}</p>
              </Grid>
            ))}
          </Grid>
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
