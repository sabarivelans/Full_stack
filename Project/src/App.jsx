import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Home from './Home';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Profile from './Profile.jsx'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/home/*" element={<Home/>}/>
      <Route path="/register/*" element={<Register/>}/>
      <Route path="/profile/*" element={<Profile/>}/>
    </Routes>
  );
}

export default App;