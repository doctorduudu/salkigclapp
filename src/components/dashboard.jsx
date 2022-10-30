import { Button, Divider, Grid, Typography } from "@mui/material";
import {
  getAuth,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { toast } from "material-react-toastify";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../index.js";
import CircleIcon from "@mui/icons-material/Circle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setUser(user);
    if (!user) {
      return;
    }
    console.log(user);

    let productsArray = [...productsData];
    let shortageProducts = [...productsInShortage];
    let messagesArray = [...messages];

    const colRef = collection(db, "products");
    getDocs(colRef)
      .then((snapshot) => {
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
        });
      })
      .then(() => {
        console.log("all products obtained", productsArray);
        console.log("products in shortage", shortageProducts);
        setProductsData(productsArray);
        setProductsInShortage(shortageProducts);
      });

    const messagesColRef = collection(db, "messages");
    getDocs(messagesColRef)
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const message = doc.data();
          //   console.log(message);
          messagesArray.push(message);
        });
      })
      .then(() => {
        console.log("messages", messagesArray);
        setMessages(messagesArray);
      });
  }, []);

  const signInUser = () => {
    signInWithRedirect(auth, provider);
  };

  const signOutUser = () => {
    toast.success("You have been signed out");
    setUser({});
    signOut(auth).then(() => {
      window.location.reload();
    });
  };

  const showMessage = (message) => {
    console.log(message);
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

  const doDeleteMessage = (e) => {
    e.preventDefault();
    const deletingMessage = { ...messageToDelete };
    console.log(deletingMessage);

    const removeMessageButton = document.getElementById(
      "remove-message-button"
    );
    console.log(removeMessageButton);
    removeMessageButton.disabled = true;
    removeMessageButton.style.backgroundColor = "grey";
    // return;

    const currentMessages = [...messages];
    deleteDoc(doc(db, "messages", deletingMessage.dateAdded.toString())).then(
      () => {
        toast.success("Message deleted");
        removeMessageButton.disabled = false;
        setOpenConfirmDelete(false);
      }
    );
    const newMessagesArray = currentMessages.filter(
      (message) => message.dateAdded !== deletingMessage.dateAdded
    );
    setMessages(newMessagesArray);
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
        style={{ textAlign: "center", margin: "10px auto" }}
      >
        <Typography
          variant="body1"
          component="span"
          style={{
            textTransform: "capitalize",
            paddingRight: "10px",
            fontSize: "20px",
          }}
        >
          {user && user.displayName}
        </Typography>
        {!user && (
          <Button
            color="secondary"
            variant="contained"
            onClick={signInUser}
            style={{ color: "#fff" }}
          >
            Sign In / Up
          </Button>
        )}
        {user && (
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

      {user && (
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
                {productsInShortage.map((product) => (
                  <Typography key={product.productCode}>
                    <CircleIcon style={{ fontSize: "10px" }} /> {product.name} (
                    {product.description}): {product.quantityAvailable} left
                  </Typography>
                ))}
                {productsInShortage.length < 1 && (
                  <Typography>There is currently no inventory alert</Typography>
                )}
                <br />
              </CardContent>
              <CardActions>
                <Typography style={{ margin: "0 auto" }}></Typography>
              </CardActions>
            </Card>

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
      {!user && (
        <div style={{ textAlign: "center" }}>
          <Typography>Please login to view dashboard</Typography>{" "}
          <Typography>
            If you are already logged In, Click here to{" "}
            <Button
              variant="contained"
              onClick={() => {
                window.location.reload();
              }}
            >
              Refresh
            </Button>
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
      </div>
    </div>
  );
};

export default Dashboard;
