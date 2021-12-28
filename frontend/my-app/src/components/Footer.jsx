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
              © 2021 Play Langs
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Footer;
