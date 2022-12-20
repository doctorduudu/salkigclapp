import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { toast } from "material-react-toastify";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../index.js";
import CircleIcon from "@mui/icons-material/Circle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, setUser] = useState({});
  const [productsData, setProductsData] = useState([]);
  const [productsInShortage, setProductsInShortage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [viewingMessage, setViewingMessage] = useState({});
  const [openViewMessage, setOpenViewMessage] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState({});
  const [openSignInUser, setOpenSignInUser] = useState(false);
  const [userAuthData, setUserAuthData] = useState({ email: "", password: "" });
  const [openAllProductsInShortage, setOpenAllProductsInShortage] =
    useState(false);

  useEffect(() => {
    const colRef = collection(db, "products");
    onSnapshot(colRef, (snapshot) => {
      let productsArray = [...productsData];
      let shortageProducts = [...productsInShortage];

      snapshot.docs.forEach((doc) => {
        // console.log(doc.id, doc.data());
        const product = doc.data();
        productsArray.push(product);

        if (product.sellingPrice < 50 && product.quantityAvailable < 7) {
          shortageProducts.push(product);
        } else if (
          product.sellingPrice < 100 &&
          product.quantityAvailable < 5
        ) {
          shortageProducts.push(product);
        } else if (
          product.sellingPrice < 250 &&
          product.quantityAvailable < 4
        ) {
          shortageProducts.push(product);
        } else if (
          product.sellingPrice > 250 &&
          product.quantityAvailable < 3
        ) {
          shortageProducts.push(product);
        }

        setProductsData(productsArray);
        setProductsInShortage(shortageProducts);
      });
    });

    const messagesColRef = collection(db, "messages");
    onSnapshot(messagesColRef, (snapshot) => {
      let messagesArray = [...messages];

      snapshot.docs.forEach((doc) => {
        const message = doc.data();
        //   console.log(message);
        messagesArray.push(message);
      });

      setMessages(messagesArray);
    });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user data obtained online", user);
        setUser(user);
      } else {
        // console.log("user is logged  out");
        const localUserData = JSON.parse(localStorage.getItem("currentUser"));
        if (localUserData) {
          console.log("user data obtained offline");
          setUser(localUserData);
        }
      }
    });
  }, []);

  const signInUser = (e) => {
    e.preventDefault();
    if (!navigator.onLine) {
      toast.error("You must be online to sign in!");
      return;
    }

    const signInButton = document.getElementById("sign-in-button");
    signInButton.disabled = true;
    signInButton.style.backgroundColor = "grey";

    // console.log(userAuthData.email, userAuthData.password);
    signInWithEmailAndPassword(auth, userAuthData.email, userAuthData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        signInButton.disabled = true;
        signInButton.style.backgroundColor = "grey";
        setUserAuthData({ email: "", password: "" });
        setUser(user);
        setOpenSignInUser(false);
      })
      .catch((error) => {
        // console.log(error.code);
        if (error.code === "auth/wrong-password") {
          toast.error("Wrong password");
        } else if (error.code === "auth/user-not-found") {
          toast.error("The account does not exist");
        } else {
          toast.error(
            "Something went wrong. Check your internet connection and try again later"
          );
        }
        // toast.error(error.message);
      });
  };

  const signOutUser = () => {
    toast.success("You have been signed out");
    setUser({});
    signOut(auth).then(() => {
      window.location.reload();
    });
  };

  const showMessage = (message) => {
    // console.log(message);
    setViewingMessage(message);
    setOpenViewMessage(true);
  };

  const hideMessage = () => {
    setOpenViewMessage(false);
  };

  const showConfirmDelete = (message) => {
    setMessageToDelete(message);
    setOpenConfirmDelete(true);
  };
  const hideConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const showSignInUser = (message) => {
    setOpenSignInUser(true);
  };
  const hideSignInUser = () => {
    setOpenSignInUser(false);
  };

  const showAllProductsInShortage = (message) => {
    setOpenAllProductsInShortage(true);
  };
  const hideAllProductsInShortage = () => {
    setOpenAllProductsInShortage(false);
  };

  const doDeleteMessage = (e) => {
    e.preventDefault();
    const deletingMessage = { ...messageToDelete };
    // console.log(deletingMessage);

    const removeMessageButton = document.getElementById(
      "remove-message-button"
    );
    // console.log(removeMessageButton);
    removeMessageButton.disabled = true;
    removeMessageButton.style.backgroundColor = "grey";
    // return;

    const currentMessages = [...messages];
    deleteDoc(doc(db, "messages", deletingMessage.dateAdded.toString()));
    toast.success("Message deleted");
    removeMessageButton.disabled = false;
    setOpenConfirmDelete(false);

    const newMessagesArray = currentMessages.filter(
      (message) => message.dateAdded !== deletingMessage.dateAdded
    );
    setMessages(newMessagesArray);
  };

  const handleSignInDataChange = ({ currentTarget: input }) => {
    const authData = { ...userAuthData };
    authData[input.name] = input.value;
    // console.log(authData[input.name]);
    setUserAuthData(authData);
  };

  return (
    <div id="dashboard">
      <Typography
        component="h1"
        variant="h5"
        style={{ textAlign: "center", marginTop: "10px" }}
      >
        DASHBOARD
      </Typography>

      <div
        id="login-section"
        style={{ textAlign: "center", margin: "10px 10px" }}
      >
        <Typography
          variant="body1"
          component="span"
          style={{
            paddingRight: "10px",
            fontSize: "20px",
          }}
        >
          {user && user.email}
        </Typography>
        {!user.email > 0 && (
          <Button
            color="secondary"
            variant="contained"
            onClick={showSignInUser}
            style={{ color: "#fff" }}
            id="sign-in-button"
          >
            Sign In
          </Button>
        )}
        {user.email && (
          <Button
            color="secondary"
            variant="contained"
            style={{ marginLeft: "20px", color: "#fff" }}
            onClick={signOutUser}
          >
            Sign Out
          </Button>
        )}
      </div>

      {user.email && (
        <div id="alerts">
          <Grid
            container
            style={{
              padding: "20px",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Card
              style={{ width: "350px", marginTop: "25px", textAlign: "left" }}
            >
              <CardContent>
                <Typography style={{ fontWeight: "700" }}>
                  {" "}
                  Inventory Alerts
                </Typography>
                <Divider />
                <br />
                {productsInShortage.slice(0, 5).map((product) => (
                  <Typography key={product.productCode}>
                    <CircleIcon style={{ fontSize: "10px" }} /> {product.name} (
                    {product.description}): {product.quantityAvailable} left
                  </Typography>
                ))}
                {productsInShortage.length < 1 && (
                  <Typography>There is currently no inventory alert</Typography>
                )}
                <br />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={showAllProductsInShortage}
                >
                  View All
                </Button>
              </CardContent>
              <Divider />
              {/* <CardActions
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/ims"
                  size="small"
                  style={{ color: "#fff" }}
                >
                  Inventory MS
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/inventory-sales"
                  size="small"
                  style={{ color: "#fff" }}
                >
                  Sales Records
                </Button>
              </CardActions> */}
            </Card>
          </Grid>
          <Grid
            container
            style={{
              padding: "20px",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Card
              style={{ width: "350px", marginTop: "25px", textAlign: "left" }}
            >
              <CardContent>
                <Typography style={{ fontWeight: "700" }}> Messages</Typography>
                <Divider />
                <br />
                {messages.map((message) => (
                  <div key={message.dateAdded} style={{ marginBottom: "25px" }}>
                    <Typography variant="caption">
                      A message from <strong>{message.name}</strong> with
                      subject "<strong>{message.subject}</strong>" <br />
                    </Typography>
                    <div style={{ marginTop: "20px" }}>
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        style={{
                          color: "#fff",
                          fontSize: "10px",
                          marginLeft: "15px",
                        }}
                        onClick={() => showMessage(message)}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        style={{
                          color: "#fff",
                          fontSize: "10px",
                          marginLeft: "15px",
                        }}
                        onClick={() => showConfirmDelete(message)}
                      >
                        Remove
                      </Button>
                    </div>
                    <Divider style={{ marginTop: "20px" }} />
                  </div>
                ))}
                {messages.length < 1 && (
                  <Typography>There are no new messages</Typography>
                )}
                <br />
              </CardContent>
              <CardActions>
                <Typography style={{ margin: "0 auto" }}></Typography>
              </CardActions>
            </Card>
          </Grid>
        </div>
      )}
      {!user.email && (
        <div style={{ textAlign: "center", padding: "10px" }}>
          <Typography>Please login to view dashboard.</Typography>{" "}
          <Typography>
            If you are already logged In, Click to{" "}
            <Button
              variant="contained"
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh
            </Button>
          </Typography>
          <Typography style={{ marginTop: "10px" }}>
            If refresh doesn't help, your internet may be disconnected
          </Typography>
        </div>
      )}

      <div id="dialogs">
        <Dialog open={openViewMessage} onClose={hideMessage}>
          <DialogTitle>Message from {viewingMessage.name}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {viewingMessage.messageDetails}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              size="medium"
              color="secondary"
              style={{ color: "#fff" }}
              onClick={hideMessage}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openConfirmDelete} onClose={hideConfirmDelete}>
          <DialogTitle>Are you sure?</DialogTitle>
          <form onSubmit={doDeleteMessage}>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete message from{" "}
                {messageToDelete.name} with subject "{messageToDelete.subject}"?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={hideConfirmDelete}>Cancel</Button>
              <Button
                variant="contained"
                type="submit"
                id="remove-message-button"
                style={{ backgroundColor: "red" }}
              >
                Delete
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={openSignInUser} onClose={hideSignInUser}>
          <DialogTitle>Sign In</DialogTitle>
          <form onSubmit={signInUser}>
            <DialogContent>
              <Grid
                item
                xs={12}
                style={{ paddingBottom: "20px", marginBottom: "30px" }}
              >
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  id="email"
                  value={userAuthData.email}
                  type="email"
                  fullWidth
                  variant="standard"
                  onChange={handleSignInDataChange}
                />
                <TextField
                  margin="dense"
                  name="password"
                  label="Passord"
                  id="password"
                  value={userAuthData.password}
                  type="password"
                  fullWidth
                  variant="standard"
                  onChange={handleSignInDataChange}
                />
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button size="small" onClick={hideSignInUser}>
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                id="sign-in-user-button"
                style={{ backgroundColor: "green" }}
              >
                Sign In
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={openAllProductsInShortage}
          onClose={hideAllProductsInShortage}
        >
          <DialogTitle>These Products may be in shortage.</DialogTitle>
          <DialogContent>
            {productsInShortage.map((product) => (
              <Typography key={product.productCode}>
                <CircleIcon style={{ fontSize: "10px" }} /> {product.name} (
                {product.description}): {product.quantityAvailable} left
              </Typography>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={hideAllProductsInShortage}>Okay</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
