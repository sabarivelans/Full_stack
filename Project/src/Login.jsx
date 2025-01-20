import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, doc, getDoc } from './firebase'; // Import Firebase functions and db
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("Username:", username); // Log username for debugging

      // Reference to the "details" document inside the user's collection
      const userDocRef = doc(db, username, 'details'); // Accessing the "details" document

      // Get the document data from Firebase
      const userDoc = await getDoc(userDocRef);
      
      // Check if the document exists
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Check if password matches
        if (userData.PASS === password) {
          alert("Login successful!");
          navigate('/home');  // Redirect to Home page upon successful login
        } else {
          alert("Invalid password");
        }
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("An error occurred while logging in");
    }
  };

  return (
    <div>
      <div className='whole'>
        <div className='img'>
          <img src="./1.png" alt="Logo" />
          <br /><br /><br />
          <h1>Welcome Back! <br /><br />Please Log In to Continue.</h1>
          
          <div className="footer">
            <p>If you don't have an account <a href="/register" onClick={() => navigate('/register')}>Register</a></p>
          </div>
        </div>
        <div className='login'>
          <h1 id='heading'>LOGIN</h1>
          <br /><br /><br />
          
          {/* Input fields bound to state */}
          <input 
            type="text" 
            placeholder='Username' 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <br /><br /><br />
          <input 
            type="password" 
            placeholder='Password' 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <br /><br />
          <a href="#">Forgot Password?</a>
          <br /><br /><br /><br />
          
          {/* Trigger handleLogin on click */}
          <button onClick={handleLogin}>Login</button>
          <br /><br />
        </div>
      </div>
    </div>
  );
}

export default Login;
