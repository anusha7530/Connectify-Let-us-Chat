import React from "react";
import "../css/Login.css";
import logo from "../logo.png";
import { Button } from "@mui/material";
import { auth, provider } from "../firebase";
import { signInWithPopup} from "firebase/auth";

function Login() {

  const signIn = () => {
    signInWithPopup(auth, provider)
    .then(() => {
       console.log("Logged in successfully.");
    })
    .catch(() => alert("No internet connection. Network change has been detected."));
  };
  return (
    <div className="login">
      <div className="login_container">
        <img src={logo} alt="logo" />
        <div className="login_text">
          <h1>Sign in to Connectify</h1>
        </div>
        <Button onClick={signIn}>Sign in With Google</Button>
      </div>
    </div>
  );
}

export default Login;
