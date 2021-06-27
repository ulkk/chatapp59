import React, { useState, useEffect, useContexr } from "react";
import { AuthContext } from "../AuthService";

import Login from "./Login";
import SignUp from "./SignUp";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const user = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
};
