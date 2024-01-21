import React, { useState, useEffect } from "react";
import "../css/SidebarChat.css";
import { Avatar, IconButton } from "@mui/material";
import db from "../firebase";
import { collection, addDoc, query,onSnapshot, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';


function SidebarChat({ id, name, addNewChat,search }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if(id){
      const docref = collection(db,"rooms",id,"messages");
      const q = query(docref, orderBy("timestamp","desc"));
      onSnapshot(q,(querySnapshot) => {
        setMessages(querySnapshot.docs.map(doc => doc.data()))
          });
    }
  },[id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = () => {
    const roomName = prompt("Please enter the name for a chat");
    if (roomName) {
      addDoc(collection(db, "rooms"), {
        name: roomName,
      });
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar
          src={`https://api.dicebear.com/7.x/personas/svg?seed=${seed}`}
        />
        <div className="info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat addChat">
    <div className="left">
      <h2>Add new Chat</h2>
      <IconButton>
      <PersonAddAlt1Icon />
      </IconButton>
    </div>
      <p>To delete any message, click on it continuously.</p>
      <p>(System generated messages will not delete!)</p>
    </div>
  );
}

export default SidebarChat;