import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function Footer() {
  return (
    <>
      <AppBar position="static" color="primary" style={{ marginTop: "2rem" }}>
        <Container maxWidth="md">
          <Toolbar>
            <Typography variant="body1" color="inherit">
              &copy; {`2021 - ${new Date().getFullYear()}`} Play Langs{"　"}
              {"version 1.0.1"}
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Footer;
