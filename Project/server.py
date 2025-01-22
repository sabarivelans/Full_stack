from flask import Flask, request, jsonify
import base64
import os
import subprocess
from datetime import datetime
from flask_cors import CORS
import face_recognition
import numpy as np
from io import BytesIO
from PIL import Image

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Paths for saving images
UNKNOWN_IMAGE_SAVE_PATH = "D:/PROJECTS/Face_Recognition/Unknown/"
REGISTER_IMAGE_SAVE_PATH = "D:/PROJECTS/Face_Recognition/Std/"

# Script path for verification
SCRIPT_PATH = "D:/PROJECTS/Face_Recognition/recognition.py"

@app.route('/save-image', methods=['POST'])
def save_image():
    data = request.json
    image_data = data['image']
    
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    image_filename = f"{current_time}.jpg"
    image_path = os.path.join(UNKNOWN_IMAGE_SAVE_PATH, image_filename)
    
    with open(image_path, "wb") as f:
        f.write(base64.b64decode(image_data))
    
    try:
        # Run the Python script for verification
        result = subprocess.run(["python", SCRIPT_PATH], capture_output=True, text=True)
        script_output = result.stdout.strip()

        print("Script Output: ", script_output)

        lines = script_output.splitlines()

        if lines[0].strip().lower() == "verified":
            return jsonify({
                "status": "success",
                "script_output": "Verified",
                "mac_address": lines[1].strip(),
                "bssid": lines[2].strip(),
                "signal_strength": lines[3].strip(),
                "ip_address": lines[4].strip()
            })
        else:
            return jsonify({
                "status": "success",
                "script_output": script_output
            })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


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
