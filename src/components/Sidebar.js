import React, { useEffect, useState } from "react";
import "../css/Sidebar.css";
import { Avatar, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import { SearchOutlined } from "@mui/icons-material";
import SidebarChat from "./SidebarChat";
import db,{auth} from "../firebase";
import { collection, onSnapshot,query,getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import CloseIcon from '@mui/icons-material/Close';

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const [active] = useAuthState(auth);
  const [username,setUsername] = useState("");
  const [user,setUser] = useState(null);
  const [err,setErr] = useState(false);

  useEffect(() => {
    const q = collection(db,"rooms");
    const unsubscribe =  onSnapshot(q,(querySnapshot) => {
      setRooms(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    })
    return() => {
      unsubscribe();
    };
  }, []);

  const logout = () => {
    if(window.confirm("Are you sure you want to logout?")){
      signOut(auth);
      navigate('/');
    }
  }

  const handleSearch = async () =>{
    const q = query(collection(db,"rooms"));
    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if(doc.data().name === username){
          setUser(doc);
        }
      });
    } catch(err){
      setErr(true);
    }
  }

  const handlekey = (e) => {
    e.code === "Enter" && handleSearch();
  }
  
  const closebtn = () => {
    setUser(null);
  }

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <IconButton>
        <Avatar src={active.photoURL} />
        </IconButton>
        <div className="header_right">
          <IconButton>
            <ChatIcon />
          </IconButton>
          <Link to="/about">
          <IconButton>
            <InfoIcon style={{color : "black"}}/>
          </IconButton>
          </Link>
          <IconButton onClick={logout} >
           <LogoutIcon style={{"color" : "black", "background": "#a19d9d", "padding" : "5px"}}/>
          </IconButton>
        </div>
      </div>

      <div className="sidebar_search">
        {err && <span>Chat not found</span>}
        <div className="search_container">
          <SearchOutlined />
          <input placeholder="Search a chat" type="text" onKeyDown={handlekey} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        {user && <div className="userChat">
          <SidebarChat name={user.data().name} id= {user.id} search/>
          <CloseIcon style={{"font-size":"25px"}} onClick={closebtn}/>
        </div>
        }
      </div>

      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
