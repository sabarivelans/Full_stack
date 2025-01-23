import os
import base64
import subprocess
import re
import numpy as np
import face_recognition
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import sys
import importlib.util
from PIL import Image

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)
REGISTER_IMAGE_SAVE_PATH = "D:/PROJECTS/Face_Recognition/Std/"
cred = credentials.Certificate(r'D:\BE_ECE\SEM_5\html\fullstack_class\FullStack_Project\Project\smart.json')  # Make sure the path is correct
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()

# Paths for saving images
UNKNOWN_IMAGE_SAVE_PATH = "D:/PROJECTS/Face_Recognition/Unknown/"
SCRIPT_PATH = "D:/PROJECTS/Face_Recognition/recognition.py"

# Function to get the face vector from Firebase
def get_firebase_vector(username):
    try:
        # Fetch vector from Firebase for the username
        user_ref = db.collection('students').document(username)
        user_doc = user_ref.get()

        if user_doc.exists:
            firebase_vector = user_doc.to_dict().get('VECTOR')
            
            return np.array(firebase_vector)  # Return the vector as a numpy array
        else:
            print(f"User {username} not found in Firebase.")
            return None
    except Exception as e:
        print(f"Error retrieving Firebase vector for {username}: {e}")
        return None

# Function to compare the face encoding with the Firebase vector
def compare_faces(firebase_vector, unknown_image_path, tolerance):
    # Load the unknown image
    unknown_image = face_recognition.load_image_file(unknown_image_path)
    
    # Get face encodings from the unknown image
    unknown_encodings = face_recognition.face_encodings(unknown_image)
    
    if not unknown_encodings:
        return "Not Verified", False, True  # No face detected

    unknown_encoding = unknown_encodings[0]  # Consider the first face found in the image

    # Compare the extracted encoding with the Firebase vector using face_distance
    results = face_recognition.face_distance([firebase_vector], unknown_encoding)

    if results[0] <= tolerance:
        return "Verified"  # Verified
    else:
        return "Not Verified"  # Not Verified

# Flask route for saving and comparing the image
@app.route('/save-image', methods=['POST'])
def save_image():
    data = request.json
    image_data = data['image']
    username = data['username']  # assuming username is passed with the image data

    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    image_filename = f"{current_time}.jpg"
    image_path = os.path.join(UNKNOWN_IMAGE_SAVE_PATH, image_filename)

    # Save the image
    with open(image_path, "wb") as f:
        f.write(base64.b64decode(image_data))

    try:
        # Fetch the vector for the given username from Firebase
        firebase_vector = get_firebase_vector(username)
        if firebase_vector is None:
            return jsonify({"status": "error", "message": "User not found in Firebase."})

        # Compare the extracted face encoding with the Firebase vector
        tolerance = 0.40  # Set tolerance level for face comparison
        result= compare_faces(firebase_vector, image_path, tolerance)
        
        # Delete the image if not verified
        print(result)
        if result == "Verified":
            try:
                # Run recognition.py to get Wi-Fi info
                resut = subprocess.run(
                    ["python", SCRIPT_PATH], 
                    capture_output=True, 
                    text=True,  # Ensure that stdout is returned as text
                )
                # Parse the output from recognition.py (assuming each line contains the info)
                script_output = resut.stdout.strip()
                print("Script Output: ", script_output)

                # Split the string using regex
                match = re.match(r"([0-9a-fA-F:]+)\s([0-9a-fA-F:]+)\s(\d+)\s([\d\.]+)", script_output)

                if match:
                    mac_address = match.group(1).strip().lower()  # First MAC address
                    bssid = match.group(2).strip()  # Second MAC address (BSSID)
                    signal_strength = match.group(3).strip()  # Signal strength
                    ip_address = match.group(4).strip()  # IP address

                    print(f"mac_address: {mac_address}")
                    print(f"bssid: {bssid}")
                    print(f"signal_strength: {signal_strength}")
                    print(f"ip_address: {ip_address}")
                    
                    return jsonify({
                        "status": "success",
                        "script_output": "Verified",
                        "mac_address": mac_address,
                        "bssid": bssid,
                        "signal_strength": signal_strength,
                        "ip_address": ip_address
                    })
                else:
                    print("Failed to parse the script output.")
                    return jsonify({
                        "status": "error",
                        "message": "Failed to parse script output."
                    })

            except subprocess.CalledProcessError as e:
                return jsonify({
                    "status": "error",
                    "message": f"Error running recognition.py: {e}"
                })
        else:
            return jsonify({
                "status": "error",
                "message": "Face not verified."
            })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })




@app.route('/register-image', methods=['POST'])
def register_image():
    data = request.json
    image_data = data['image']
    
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    image_filename = f"{current_time}.jpg"
    image_path = os.path.join(REGISTER_IMAGE_SAVE_PATH, image_filename)
    
    try:
        # Save the image for registration
        with open(image_path, "wb") as f:
            f.write(base64.b64decode(image_data))
        
        # Convert the saved image to a format suitable for face_recognition
        image = Image.open(image_path)
        image_np = np.array(image)
        
        # Detect faces and extract the face encoding (vector)
        face_locations = face_recognition.face_locations(image_np)
        if face_locations:
            face_encodings = face_recognition.face_encodings(image_np, face_locations)
            if face_encodings:
                face_vector = face_encodings[0].tolist()  # Convert numpy array to list for JSON serialization
                return jsonify({
                    "status": "success",
                    "message": "Image saved and face vector extracted.",
                    "vector": face_vector
                })
            else:
                return jsonify({
                    "status": "error",
                    "message": "Face encoding extraction failed."
                })
        else:
            return jsonify({
                "status": "error",
                "message": "No face detected in the image."
            })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })


@app.route('/')
def index():
    return "Server is running."


if __name__ == '__main__':
    app.run(debug=True, port=5000)
