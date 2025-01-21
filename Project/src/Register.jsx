import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, doc, setDoc, collection, getDocs } from './firebase'; // Import Firebase functions and db
import './Login.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for registration process
  const navigate = useNavigate();

  const handleRegister = async () => {
    setIsLoading(true); // Set loading to true when starting the registration
    try {
      console.log("Registering Username:", username);

      // Save the username and password in the specified format
      await saveCredentialsToFirebase(username, password);

      // Copy all data from 'subjects' collection to the new user
      await copySubjectsCollection(username);

      console.log("Registration and data copy completed.");
      alert("Registration successful! Please log in.");

      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration");
    } finally {
      setIsLoading(false); // Set loading to false once process is complete
    }
  };

  const saveCredentialsToFirebase = async (username, password) => {
    try {
      // Reference to the collection named after the username and the `details` document
      const userDocRef = doc(db, username, 'details');

      // Save the credentials in the specified format
      await setDoc(userDocRef, {
        PASS: password, // Add the password under the field "PASS"
      });

      console.log("Credentials saved successfully for", username);
    } catch (error) {
      console.error("Error saving credentials:", error);
      throw new Error("Failed to save credentials.");
    }
  };

  const copySubjectsCollection = async (username) => {
    try {
      // Reference to the 'subjects' collection
      const subjectsCollectionRef = collection(db, 'subjects');
      const userSubjectsCollectionRef = collection(db, username, 'subjects'); // Correctly reference sub-collection under user

      // Get all documents in the 'subjects' collection
      const querySnapshot = await getDocs(subjectsCollectionRef);

      // Copy each document's sub-collections (subjects) to the user's collection
      const copyPromises = querySnapshot.docs.map(async (docSnapshot) => {
        const docId = docSnapshot.id;
        const docData = docSnapshot.data();

        // Create a new document in the user's collection with the same ID and data
        const userDocRef = doc(userSubjectsCollectionRef, docId);
        await setDoc(userDocRef, docData);

        // Now copy any sub-collections for each subject (sub-collection to sub-collection)
        await copySubCollections(docSnapshot.ref, userDocRef);
      });

      await Promise.all(copyPromises); // Wait for all copy operations to complete

      console.log("Subjects collection copied successfully for", username);
    } catch (error) {
      console.error("Error copying subjects collection:", error);
      throw new Error("Failed to copy subjects collection.");
    }
  };

  // Function to copy sub-collections from one subject document to the new user's subject document
  const copySubCollections = async (subjectDocRef, userDocRef) => {
    try {
      // Get all sub-collections of the subject document
      const subCollections = await subjectDocRef.listCollections();

      for (let subCollection of subCollections) {
        // Get all documents in the sub-collection
        const subCollectionSnapshot = await getDocs(subCollection);

        // Create the corresponding sub-collection under the user's document
        const userSubCollectionRef = collection(db, userDocRef.path, subCollection.id);

        // Copy documents to the user's sub-collection
        const copyPromises = subCollectionSnapshot.docs.map(async (subDocSnapshot) => {
          const subDocData = subDocSnapshot.data();
          const userSubDocRef = doc(userSubCollectionRef, subDocSnapshot.id);
          await setDoc(userSubDocRef, subDocData);
        });

        await Promise.all(copyPromises);
      }
    } catch (error) {
      console.error("Error copying sub-collections:", error);
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
          <button onClick={handleRegister} disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <br /><br />
        </div>
      </div>
    </div>
  );
}

export default Register;
