import Header from "../components/Header";
import Footer from "../components/Footer";

import { Button } from "@mui/material";

import { BrowserRouter as Router, useParams } from "react-router-dom";

function CustomError() {
  let { customErrorMessage } = useParams();
  return (
    <>
      <Header />
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <h1>{customErrorMessage}</h1>
        <Button href="/" variant="contained" disableElevation size="large">
          トップページに戻る
        </Button>
      </div>
      <Footer />
    </>
  );
}

export default CustomError;
