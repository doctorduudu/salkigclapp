import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Typography } from "@mui/material";

const Footer = () => {
  return (
    <footer id="footer">
      <Grid container style={{ color: "#fff" }}>
        {/* <Grid className="footer-sections" item xs={6} sm={6} md={4} lg={3} style={{ marginBottom: "20px" }}>
          <Typography variant="h5">Company</Typography>
          <a href="about">About Us</a>
          <br />
          <a href="contact">Contact Us</a>
          <br />
          <a href="contact">Partnership</a>
        </Grid>

        <br />
        <br />

        <Grid className="footer-sections" item xs={6} sm={6} md={4} lg={3} style={{ marginBottom: "20px" }}>
          <Typography variant="h5">Resources</Typography>
          <a href="/questionbank">Question Bank</a>
          <br />
          <a href="/osce">OSCE Guides</a>
          <br />

          <a href="/spaced-repetition">Automated Revision</a>
          <br />
          <a href="/flashcards">Flashcards</a>
        </Grid>

        <br />
        <br /> */}

        {/* <Grid
          className="footer-sections"
          item
          xs={6}
          sm={6}
          md={4}
          lg={3}
          style={{ marginBottom: "20px" }}
        >
          <Typography variant="h5">Legal</Typography>
          <a href="#">Privacy Policy</a>
          <br />
          <a href="#">Terms of Use</a>
        </Grid>

        <br />
        <br /> */}

        {/* <Grid
          className="footer-sections"
          item
          xs={6}
          sm={6}
          md={4}
          lg={3}
          style={{ marginBottom: "20px" }}
        >
          <Typography variant="h5">Social Media</Typography>
          <a style={{ margin: "auto 8px" }} href="#">
            <YouTubeIcon />
          </a>
          <a style={{ margin: "auto 8px" }} href="#">
            <FacebookIcon />
          </a>
          <a style={{ margin: "auto 8px" }} href="#">
            <TwitterIcon />
          </a>
        </Grid> */}
      </Grid>
      <Grid
        container
        style={{
          color: "#fff",
          textAlign: "center",
          paddingLeft: "5px",
        }}
      >
        <p>
          &copy; <span>{new Date().getFullYear()}</span> SALKI GLOBAL CO. LTD.
          All Rights Reserved
        </p>
      </Grid>
    </footer>
  );
};

export default Footer;
