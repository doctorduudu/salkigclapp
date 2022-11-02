import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { useState } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const NavBar = () => {
  const [sideBarOpened, SetSideBarOpened] = useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    SetSideBarOpened({ ...sideBarOpened, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <Link to="/" style={{ textDecoration: "none" }}>
          <ListItem disablePadding>
            <ListItemButton>
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}{" "}
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <List>
        <Link to="/db" style={{ textDecoration: "none" }}>
          <ListItem disablePadding>
            <ListItemButton>
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}{" "}
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <List>
        <Link to="/ims" style={{ textDecoration: "none" }}>
          <ListItem disablePadding>
            <ListItemButton>
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}{" "}
              <ListItemText primary="Inventory MS" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <List>
        <Link to="/inventory-sales" style={{ textDecoration: "none" }}>
          <ListItem disablePadding>
            <ListItemButton>
              {/* <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon> */}{" "}
              <ListItemText primary="Sales Records" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <Divider />
    </Box>
  );

  return (
    <div className="nav-bar">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              component={Link}
              variant="h6"
              to="/"
              sx={{ flexGrow: 1 }}
              className="navbar-brand"
              style={{
                textDecoration: "none",
                color: "#fff",
                fontWeight: "bolder",
                fontFamily: "Helvetica",
              }}
            >
              SALKI GCL
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer("right", true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div>
          {["right"].map((anchor) => (
            <div key={anchor}>
              <SwipeableDrawer
                anchor={anchor}
                open={sideBarOpened[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer>
            </div>
          ))}
        </div>
      </Box>
    </div>
  );
};

export default NavBar;
