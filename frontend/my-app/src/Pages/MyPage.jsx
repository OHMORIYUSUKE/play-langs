import Header from "../components/Header";
import Footer from "../components/Footer";
import Editor from "@monaco-editor/react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function MyPage() {
  const user_name = localStorage.getItem("user_name");
  const user_picture = localStorage.getItem("user_picture");
  const user_id = localStorage.getItem("user_id");
  return (
    <>
      <Header />
      <Box sx={{ flexGrow: 1 }} style={{ padding: "0 10em" }}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <img src={user_picture} alt="" style={{ borderRadius: "50%" }} />
          </Grid>
          <Grid item xs={10}>
            <p>{user_id}</p>
            <h1>{user_name}</h1>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default MyPage;
