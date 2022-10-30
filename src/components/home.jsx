import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import HeroImg from "../img/heroImg.jpeg";
import { useState } from "react";
import { Button, Container, TextField } from "@mui/material";
import BoreholeAImg from "../img/boreholeA.jpeg";
import BoreholeBImg from "../img/boreholeB.jpeg";
import HardwareAImg from "../img/hardwareA.jpg";
import HardwareBImg from "../img/hardwareB.jpeg";
import LandImg from "../img/land.jpeg";
import ConstructionImg from "../img/construction.jpeg";
import { toast } from "material-react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../index.js";

const Home = () => {
  const [data, setData] = useState({
    name: "",
    mobile: "",
    subject: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageDetails = document.querySelector("#message-details").innerText;
    const name = data.name;
    const subject = data.subject;
    const mobile = data.mobile;
    const dateAdded = Date.now();
    console.log(name, mobile, subject, messageDetails);

    if (!data.name) {
      toast.error("Kindly enter your name in the space provided");
      return;
    } else if (!data.subject) {
      toast.error("Kindly add a message subject in the space provided");
      return;
    } else if (!data.mobile) {
      toast.error("Kindly provide your contact number in the space provided");
    } else if (!messageDetails) {
      toast.error(
        "Please write details of your message in the big space provided"
      );
      return;
    }

    const submitButton = document.getElementById("submit-button");
    console.log(submitButton);
    submitButton.disabled = true;
    submitButton.style.backgroundColor = "grey";

    const message = {
      name: name,
      subject: subject,
      mobile: mobile,
      messageDetails: messageDetails,
      dateAdded: dateAdded,
      from: "homepage",
    };

    setDoc(doc(db, "messages", dateAdded.toString()), message).then(() => {
      toast.success(
        "Your Message was submitted. You will hear from us soon. Thank You."
      );
      setData({
        name: "",
        mobile: "",
        subject: "",
      });
      const messageDetailsDom = document.querySelector("#message-details");
      messageDetailsDom.innerText = "";
      submitButton.disabled = false;
      submitButton.style.backgroundColor = "#a54414";
    });

    console.log("submitting the form");
  };

  const handleChange = ({ currentTarget: input }) => {
    const messageData = { ...data };
    messageData[input.name] = input.value;
    // console.log(messageData.name);
    setData(messageData);
  };

  return (
    <div className="home">
      <div id="header">
        <Paper
          className="hero-image"
          sx={{ backgroundImage: "url(" + HeroImg + ")" }}
        >
          <div className="hero-overlay" />
          <Grid container>
            <Grid style={{ width: "100%" }} item>
              <div className="header-content">
                <Typography component="h1" className="header-text-one">
                  SALKI GLOBAL COM. LIMITED
                </Typography>
                <Typography className="header-text-two">
                  Borehole Drilling
                </Typography>

                <Typography className="header-text-two">
                  Hardware and Construction Logistics
                </Typography>

                <Typography className="header-text-two">
                  {" "}
                  Land acquisition and Construction works.
                </Typography>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </div>

      <div id="services">
        <Typography
          variant="h4"
          component="h2"
          className="services-header section-header"
        >
          OUR SERVICES{" "}
        </Typography>

        <Grid container className="borehole-drilling service">
          <Grid item xs={12} className="borehole-drilling-text">
            <Typography
              variant="h4"
              component="h3"
              className="service-header-text"
            >
              Borehole Drilling
            </Typography>
            <Typography
              variant="body2"
              component="p"
              className="service-body-text"
            >
              We provide expert borehole drilling services at affordable prices
              at all locations in Accra and Kumasi. Get in touch and let's get
              the purest most consistent source of water for your home.
            </Typography>
            <br />
          </Grid>
          <Grid
            container
            className="borehole-drilling-images-container service-images-container"
          >
            <Grid
              item
              xs={12}
              md={6}
              className="borehole-drilling-image-1 service-image"
            >
              <img src={BoreholeAImg} alt="borehole" />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              className="borehole-drilling-image-2 service-image"
            >
              <img src={BoreholeBImg} alt="borehole" />
            </Grid>
          </Grid>
        </Grid>

        <Grid container className="land-and-constraction service">
          <Grid item xs={12} className="land-and-constraction-text">
            <Typography
              variant="h4"
              component="h3"
              className="service-header-text"
            >
              Land Acquisition and Construction Contracting
            </Typography>
            <Typography
              variant="body2"
              component="p"
              className="service-body-text"
            >
              Need a land to build your home or for business purposes? Come
              check out our lands at top locations in Ashanti Region at the most
              affordable pricing. Our expert constructors can also put up your
              building according to your plan.
            </Typography>
            <br />
          </Grid>
          <Grid
            container
            className="land-and-constraction-images-container service-images-container"
          >
            <Grid
              item
              xs={12}
              md={6}
              className="land-and-constraction-image-1 service-image"
            >
              <img src={LandImg} alt="land-and-construction" />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              className="land-and-constraction-image-2 service-image"
            >
              <img src={ConstructionImg} alt="land-and-construction" />
            </Grid>
          </Grid>
        </Grid>

        <Grid container className="hardware service">
          <Grid item xs={12} className="hardware-text">
            <Typography
              variant="h4"
              component="h3"
              className="service-header-text"
            >
              Hardware and Construction Logistics
            </Typography>
            <Typography
              variant="body2"
              component="p"
              className="service-body-text"
            >
              We have a variety of hardware for construction, plumbing,
              carpentary, and many more. We also have materials used for these
              purposes. Come check out our hardware shop or contact us to place
              an order and get your order delivered to your convenience.
            </Typography>
            <br />
          </Grid>
          <Grid
            container
            className="hardware-images-container service-images-container"
          >
            <Grid
              item
              xs={12}
              md={6}
              className="hardware-image-1 service-image"
            >
              <img src={HardwareAImg} alt="hardware" />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              className="hardware-image-2 service-image"
            >
              <img src={HardwareBImg} alt="hardware" />
            </Grid>
          </Grid>
        </Grid>
      </div>

      <div id="contact">
        <div style={{ textAlign: "center", margin: "20px 10px" }}>
          <Typography
            variant="h4"
            component="h2"
            className="contact-header section-header"
          >
            GET IN TOUCH{" "}
          </Typography>
          <Typography>
            <strong>Location:</strong> Pankrono Alignment, Adjacent the
            cemetary.
          </Typography>
          <Typography>
            <strong>Mobile:</strong> 050 5050 505 / 054 5454 545
          </Typography>
          <Typography>
            Send s a WhatsApp Message: <a href="#">Click Here</a>
          </Typography>
        </div>
        <Container
          component="main"
          maxWidth="sm"
          style={{
            margin: "30px auto",
            width: "95%",
            backgroundColor: "#fff",
            boxShadow:
              "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
            padding: "4rem 2rem",
            borderRadius: "10px",
          }}
        >
          <div>
            <Grid justifyContent="center" alignItems="center" item container>
              <Typography
                component="h3"
                variant="h5"
                style={{ marginLeft: "10px" }}
              >
                Leave us a message
              </Typography>
            </Grid>
            <form onSubmit={handleSubmit}>
              {/* {renderTextField("name", "Your Name")}
              {renderTextField("email", "Email Address")}
              {renderTextField("subject", "Message Subject")} */}
              <TextField
                variant="standard"
                margin="normal"
                fullWidth
                value={data.name}
                name="name"
                onChange={handleChange}
                label="Your name"
              />
              <TextField
                variant="standard"
                margin="normal"
                fullWidth
                value={data.subject}
                name="subject"
                onChange={handleChange}
                label="Message Subject"
              />
              <TextField
                variant="standard"
                margin="normal"
                fullWidth
                value={data.mobile}
                name="mobile"
                onChange={handleChange}
                label="Contact Number"
                type="number"
              />
              <div
                id="message-details"
                contentEditable="true"
                style={{
                  height: "200px",
                  padding: "10px",
                  border: "1px solid rgb(133, 133, 133)",
                  borderRadius: "5px",
                  margin: "15px auto",
                }}
              ></div>
              <br />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                id="submit-button"
              >
                Submit
              </Button>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Home;
