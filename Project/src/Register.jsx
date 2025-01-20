import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, doc, setDoc } from './firebase'; // Import Firebase functions and db
import './Login.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showCamera, setShowCamera] = useState(false); // To toggle camera popup visibility
  const videoRef = useRef(null); // Ref for video element
  const canvasRef = useRef(null); // Ref for canvas element
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      console.log("Registering Username:", username); // Log username for debugging

      // Show camera for capturing image
      setShowCamera(true);
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred during registration");
    }
  };

  // Start the camera when the camera popup is shown
  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      // Stop the camera when the popup is closed
      const stream = videoRef.current?.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  }, [showCamera]);

  const startCamera = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const captureImage = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size to match the video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video to the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image to a base64 string
    const imageData = canvas.toDataURL('image/jpeg');

    // Save the image data to Firebase with the username
    await saveImageToFirebase(imageData);

    // Hide camera popup after capture
    setShowCamera(false);
  };

  const saveImageToFirebase = async (imageData) => {
    try {
      const userCollectionRef = collection(db, username); // Reference to the user's collection
      const userDocRef = doc(userCollectionRef, 'image'); // Document where the image will be saved

      // Save the image data as a base64 string
      await setDoc(userDocRef, { image: imageData });

      console.log("Image saved successfully for", username);
      alert("Registration successful! Please log in.");

      // Redirect to login page after successful registration
      navigate('/');
    } catch (error) {
      console.error("Error saving image:", error);
      alert("An error occurred while saving the image.");
    }
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
          <br /><br /><br /><br />
          
          {/* Trigger handleRegister on click */}
          <button onClick={handleRegister}>Register</button>
          <br /><br />
        </div>
      </div>

      {/* Camera Popup */}
      {showCamera && (
        <div className="camera-popup">
          <h2>Capture Your Image</h2>
          <video ref={videoRef} autoPlay width="300" height="200"></video>
          <br />
          <button onClick={captureImage}>Capture</button>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas> {/* Hidden canvas for capturing image */}
          <br />
          <button onClick={() => setShowCamera(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Register;
