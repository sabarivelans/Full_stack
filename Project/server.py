from flask import Flask, request, jsonify
import base64
import os
import subprocess
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)


IMAGE_SAVE_PATH = "D:/PROJECTS/Face_Recognition/Unknown/"  

SCRIPT_PATH = "D:/PROJECTS/Face_Recognition/recognition.py"  

@app.route('/save-image', methods=['POST'])
def save_image():
    data = request.json
    image_data = data['image']
    
    
    current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
    image_filename = f"{current_time}.jpg"
    image_path = os.path.join(IMAGE_SAVE_PATH, image_filename)
    
   
    with open(image_path, "wb") as f:
        f.write(base64.b64decode(image_data))
    
    # After saving the image, run the Python script
    try:
        # Run the script using subprocess and capture the output
        result = subprocess.run(["python", SCRIPT_PATH], capture_output=True, text=True)
        
        # Get the output of the script
        script_output = result.stdout.strip()  # Remove extra whitespace
        
        # Print script output in the Python server terminal
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

@app.route('/')
def index():
    return "Server is running."

if __name__ == '__main__':
    app.run(debug=True, port=5000)
