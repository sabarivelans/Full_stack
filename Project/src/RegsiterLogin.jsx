import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function RegsiterFace() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:9000/id');
      const users = await response.json();

      // Check if the user exists and the password matches
      const user = users.find((user) => user.name === username && user.password === password);

      if (user) {
        // Redirect to home.jsx if login is successful
        navigate('/home');
      } else {
        // Set an error message if credentials are invalid
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred. Please try again.');
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
            <p>If you don't have an account <a href="/register">Register</a></p>
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
          <br /><br />
          
          {/* Display error message if login fails */}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <br />
          
          {/* Trigger handleLogin on click */}
          <button onClick={handleLogin}>Login</button>
          <br /><br />
        </div>
      </div>
    </div>
  );
}

export default RegsiterFace;
