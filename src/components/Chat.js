import React, { useState, useEffect } from "react";
import "../css/Chat.css";
import { Avatar, IconButton } from "@mui/material";
import { AttachFile, SearchOutlined } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { collection, query,onSnapshot,doc, orderBy,addDoc,serverTimestamp,deleteDoc,getDocs} from "firebase/firestore";
import db from "../firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth,storage } from "../firebase";
import { ref ,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress';

function Chat() {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const {roomId} = useParams();
  const [roomName,setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [active] = useAuthState(auth);
  const [uid,setUid] = useState(null);
  const [img, setImg] = useState(null);
  const [upload,setUpload] = useState(null)

  useEffect(() => {
        if(roomId){
            onSnapshot(doc(db, "rooms", roomId), (snapshot) => {
                setRoomName(snapshot.data().name);
    })
    const docref = collection(db,"rooms",roomId,"messages");
    const q = query(docref, orderBy("timestamp","asc"));
    onSnapshot(q,(querySnapshot) => {
      setMessages(querySnapshot.docs.map(doc => doc.data()))
        });    
    };          
  },[roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = (e) => {
      e.preventDefault();
      if(img != null){
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

         uploadTask.on('state_changed', 
         (snapshot) => {
           const progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
           setUpload(progress);
          if(progress === 100){
            setUpload(null);
          }
           switch (snapshot.state) {
             case 'paused':
              alert('Upload is paused.Check your internet connection.');
               break;
              case 'running':
                console.log('Upload is running');
                break;
           }
         },
          (error) => {
            alert("Upload unsuccessful due to any network error>>",error)
          },
          () => {
             getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              await addDoc(collection(db,"rooms",roomId,"messages"), {
                message: input,
                name : active.displayName,
                timestamp : serverTimestamp(),
                photoURL : active.photoURL,
                img: downloadURL,
              });
            })
          }
        );
        setInput("");
        setImg(null);
        
      }
      else{
        const q =collection(db,"rooms",roomId,"messages");
        addDoc(q, {
          message: input,
          name : active.displayName,
          timestamp : serverTimestamp(),
          photoURL : active.photoURL,
          img : null
        });
        setInput("");
        setImg(null);
      }
  };


  const dele = async (e) => {
    const val = ((e.target.id).slice(13,22));
    const q = query(collection(db,"rooms",roomId,"messages"));
    const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if(doc.data().timestamp.nanoseconds == val){
          setUid(doc.id);
        }
      });
      if(uid){
        deleteDoc(doc(db,"rooms",roomId,"messages",uid));
      }
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar
          src={`https://api.dicebear.com/7.x/personas/svg?seed=${seed}`}
        />
        <div className="header_info">
          <h3>{roomName}</h3>
          <p>Last seen{" "}
          {new Date(messages[messages.length-1]?.timestamp?.toDate()).toUTCString()}</p>
        </div>
        <div className="chatHeader_right">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat_body">
      {messages.map((messages) => (
        <>
        {(messages.name === active.displayName) ? (
        <div className="chatWithImage" key={messages.timestamp}>
        <div className="innerchat">
        <p className="chat_message chat_reciever"  onDoubleClick={dele} id={messages.timestamp}>
          <span className="chat_name">{messages.name}</span>
          {messages.message}
          <span className="chat_time">{new Date(messages.timestamp?.toDate()).toUTCString()}</span>
        </p>
        <Avatar src={messages.photoURL}/>
        </div>
        <div className="chat_imgdiv">
        {messages.img && <img src={messages.img} alt="video/other document file" className="chat_img"/>}
        </div>
        </div>
        ): (
          <div className="chatWithImage" key={messages.timestamp}>
          <div className="innerchat">
        <Avatar src={messages.photoURL}/>
        <p className="chat_message" key={messages.timestamp} >
          <span className="chat_name">{messages.name}</span>
          {messages.message}
          <span className="chat_time">{new Date(messages.timestamp?.toDate()).toUTCString()}</span>
        </p>
        </div>
        <div>
        {messages.img && <img src={messages.img} alt="video/other document file" className="chat_img"/>}
        </div>
        </div>
        )}
        </>
      ))}
      </div>
      <div className="upload">
      {upload && <CircularProgress value={upload} variant="determinate"/>}
      </div>
      <div className="chat_footer">
        <form>
      <IconButton>
              <input type="file" style={{display:"none"}} id="file" onChange={(e) => setImg(e.target.files[0])} />
              <label htmlFor="file">
              <AddPhotoAlternateIcon />
              {img && <DoneIcon id="done"/>}
              </label>
      </IconButton>
          <input
            value={input}
            type="text"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <MicIcon />
          <button type="submit" onClick={sendMessage}>
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
