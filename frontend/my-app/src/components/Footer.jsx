import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

function Footer() {
  return (
    <>
      <AppBar
        sx={{ flexGrow: 1 }}
        position="static"
        color="primary"
        style={{ marginTop: "2rem" }}
      >
        <Toolbar>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            &copy; {`2021 - ${new Date().getFullYear()}`} Play Langs{"　"}
            {"version 1.0.3"}
          </Typography>
          <Stack direction="row">
            <Link href={"https://twitter.com/uutan1108"}>
              <IconButton size="large">
                <Avatar
                  style={{ filter: "invert()" }}
                  alt="Twitterアイコン"
                  src="https://img.icons8.com/ios-filled/144/000000/twitter-circled--v1.png"
                />
              </IconButton>
            </Link>
            <Link href={"https://github.com/OHMORIYUSUKE/play-langs"}>
              <IconButton size="large">
                <Avatar
                  alt="GitHubアイコン"
                  style={{ filter: "invert()" }}
                  src="https://img.icons8.com/glyph-neue/144/000000/github.png"
                />
              </IconButton>
            </Link>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Footer;
