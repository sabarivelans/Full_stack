import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, doc, setDoc } from './firebase'; // Import Firebase functions and db
import Webcam from 'react-webcam'; // Import react-webcam
import axios from 'axios'; // Axios for sending image data
import './Login.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for registration process
  const [showCamera, setShowCamera] = useState(false); // Control for camera popup
  const [imageData, setImageData] = useState(null); // State to store captured image data
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!imageData) {
      alert("Please capture an image before registering.");
      return;
    }

    setIsLoading(true);
    try {
      // Send the captured image to the Flask server and get the vector
      const vector = await saveImageAndGetVector(imageData);

      // Save credentials and vector to Firebase
      await saveCredentialsToFirebase(username, password, vector);

      console.log("Registration completed.");
      alert("Registration successful! Please log in.");
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveImageAndGetVector = async (capturedImage) => {
    try {
      // Send the image to the Flask server
      const response = await axios.post('http://127.0.0.1:5000/register-image', {
        image: capturedImage.split(',')[1], // Send only the base64 data
      });

      if (response.data && response.data.vector) {
        console.log("Vector received from the server:", response.data.vector);
        return response.data.vector; // Return the vector
      } else {
        throw new Error("Failed to retrieve vector from the server.");
      }
    } catch (error) {
      console.error("Error saving image or retrieving vector:", error);
      throw new Error("Failed to save image or retrieve vector.");
    }
  };

  const saveCredentialsToFirebase = async (username, password, vector) => {
    try {
      const userDocRef = doc(db, 'students', username);
      await setDoc(userDocRef, {
        PASS: password,
        VECTOR: vector, // Store the vector in Firebase
      });
      console.log("Credentials and vector saved successfully for", username);
    } catch (error) {
      console.error("Error saving credentials and vector:", error);
      throw new Error("Failed to save credentials and vector.");
    }
  };

  const WebcamPopup = () => {
    const webcamRef = React.useRef(null);

    const handleCapture = () => {
      const capturedImage = webcamRef.current.getScreenshot();
      if (capturedImage) {
        setImageData(capturedImage);
        alert("Image captured successfully!");
        setShowCamera(false); // Close the camera popup after capturing
      } else {
        alert("Failed to capture image. Please try again.");
      }
    };

    return (
      <div className="webcam-popup-overlay">
        <div className="webcam-popup">
          <Webcam 
            audio={false} 
            ref={webcamRef} 
            screenshotFormat="image/jpeg" 
            style={{ width: '100%', height: 'auto' }}
          />
          <div className="webcam-buttons">
            <button onClick={handleCapture}>Capture Image</button>
            <button onClick={() => setShowCamera(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className='whole'>
        <div className='img'>
          <img src="./1.png" alt="Logo" />
          <br /><br /><br />
          <h1>Create a New Account<br /><br />Register to Get Started</h1>

          <div className="footer">
            <p>Already have an account? <a href="/" onClick={() => navigate('/')}>Login</a></p>
          </div>
        </div>
        <div className='login'>
          <h1 id='heading'>REGISTER</h1>
          <br /><br /><br />

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
          <br /><br /><br /><br />

          <button 
            onClick={() => setShowCamera(true)} 
            disabled={isLoading || !username || !password}
          >
            {isLoading ? 'Loading...' : 'Register'}
          </button>
          <br /><br />

          <button 
            onClick={handleRegister} 
            disabled={isLoading || !imageData}
          >
            {isLoading ? 'Registering...' : 'Submit'}
          </button>
          <br /><br />
        </div>
      </div>

      {showCamera && <WebcamPopup />}
    </div>
  );
}

export default Register;
