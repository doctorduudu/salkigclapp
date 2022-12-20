import Grid from "@mui/material/Grid";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@mui/material";

const Footer = () => {
  return (
    <footer id="footer">
      <Grid
        container
        style={{
          color: "#fff",
          textAlign: "center",
          paddingLeft: "5px",
        }}
      >
        <Grid
          item
          xs={4}
          className="nav-button ims"
          style={{ borderRight: "2px solid #fff" }}
          component={Link}
          to="./ims"
        >
          <InventoryIcon />
        </Grid>
        <Grid
          item
          xs={4}
          className="nav-button dashboard"
          component={Link}
          to="./db"
        >
          <HomeIcon />
        </Grid>
        <Grid
          item
          xs={4}
          className="nav-button sales"
          style={{ borderLeft: "2px solid #fff" }}
          component={Link}
          to="./inventory-sales"
        >
          <MonetizationOnIcon />
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
