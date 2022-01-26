import Header from "../components/Header";
import Footer from "../components/Footer";
import Editor from "@monaco-editor/react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import cImg from "../images/c.png";
import haskellImg from "../images/haskell.png";
import javaImg from "../images/java.png";
import javascriptImg from "../images/javascript.png";
import pythonImg from "../images/python.png";
import rubyImg from "../images/Ruby.jpg";
import shellImg from "../images/shell.png";
import cppImg from "../images/cpp_logo.png";
import goImg from "../images/go.png";
import phpImg from "../images/php.png";
import perlImg from "../images/perl.png";
import brainfuckImg from "../images/brainfuck.png";
import nadesiko3Img from "../images/nadesiko3.png";
import csharpImg from "../images/csharp.png";
import wenyanImg from "../images/wenyan.png";

function Top() {
  const EditordefaultValue = `#include <stdio.h>

int main(){
  printf("Hello World !!");
  return 0;
}`;
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
            language="c"
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
              $ ./a.out <br />
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
