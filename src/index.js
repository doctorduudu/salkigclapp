import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";
import { getDoc, getFirestore, doc } from "firebase/firestore";
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

// onAuthStateChanged(auth, (user) => {
//   console.log(user);
//   if (user) {
//     console.log("user", user);
//     const userId = user.uid;
//     const docRef = doc(db, "users", userId);
//     const user = docRef.getDoc();
//     if (user.exists()) {
//       console.log("user", user);
//     } else {
//       console.log("there is no user");
//     }
//     localStorage.setItem("currentUserId", userId);
//   } else {
//     // User is signed out.
//     // console.log("user signed out");
//     localStorage.removeItem("currentUser");
//     localStorage.removeItem("currentUserId");
//   }
// });

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
