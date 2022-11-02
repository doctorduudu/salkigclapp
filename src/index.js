import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxuWYptdAQgUaMPd8x87DwwxIsrehuWWY",
  authDomain: "salkigcl.firebaseapp.com",
  projectId: "salkigcl",
  storageBucket: "salkigcl.appspot.com",
  messagingSenderId: "559234356201",
  appId: "1:559234356201:web:608efc62e8c978edeb7178",
  measurementId: "G-XR4TRZF5K4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // console.log(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    console.log("user is logged  out");
    localStorage.removeItem("currentUser");
  }
});

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
    console.log("something went wrong with the firebase persistence");
  } else if (err.code == "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
