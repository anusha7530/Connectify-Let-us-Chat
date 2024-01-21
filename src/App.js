import React from 'react';
import '../src/css/App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Login from './components/Login';
import About from './components/About'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "./firebase"

function App() {
  const [active] = useAuthState(auth);
  return (
    <div className="app">
    {!active ? (
      <Router>
      <Routes>
      <Route path="/" element ={ <Login />}></Route>
      </Routes>
      </Router>
    ): (
      <div className="app_body">
      <Router>
      <Routes>
          <Route path="/rooms/:roomId" element={<><Sidebar /><Chat /></>}></Route>
          <Route path="/" element={<Sidebar />}></Route>
          <Route path="about" element={<About />}></Route>
      </Routes>
      </Router>
      </div>
    )}
    </div>
  );
}

export default App;
