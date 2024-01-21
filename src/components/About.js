import React from 'react';
import "../css/About.css";
import logo from "../logo.png"

function About() {
  return (
    <div className='about'>
    <div className="about_header">
      <img src={logo} alt="logo" />
      <h1>About Connectify</h1>
      <p>Connectify is a chat application which provides a user-friendly interface to chat and connect with others.</p>
    </div>

      <div className="about_body">
      <h1 className='inst'>Instructions</h1>
        <ul>
          <li>Create a room by clicking on Add new Chat and start chatting😃</li>
          <li>Switch between chat groups by clicking on any chat🔀</li>
          <li>Search your chat by typing the chat name in the search box🔍</li>
          <li>To send a message, type your message in the input box and press enter or press the send button📨</li>
          <li>Send any image or gif by pressing the image add icon and choose your desired image 📷</li>
          <li>Delete any message by clicking on it continuously.🗑️</li>
          <li>Logout yourself by clicking on logout icon at the top right corner of sidebar↪️</li>
        </ul>
        <img src="https://www.picpedia.org/chalkboard/images/instructions.jpg" alt="instruction" />
      </div>

      <div className="about_footer">
        &copy; 2023 Connectify Inc.
      </div>
    </div>
  )
}

export default About
 