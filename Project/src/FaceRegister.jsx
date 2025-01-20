import React, { useRef, useState } from 'react';
import Webcam from "react-webcam";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function FaceRegister() {
    const webcamRef = useRef(null);
    const [openDialog, setOpenDialog] = useState(true);  // Initially show the dialog to register
    const [status, setStatus] = useState('');
    
    const handleCloseDialog = () => {
        setOpenDialog(false);  // Close the dialog
    };

    const handleSubmit = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const imageData = imageSrc.replace("data:image/jpeg;base64,", "");

        try {
            const response = await fetch("http://127.0.0.1:5000/save-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: imageData }),
            });

            const result = await response.json();

            if (result.status === "success") {
                setStatus("Face registered successfully.");
            } else {
                setStatus("Error processing image.");
            }
        } catch (error) {
            setStatus("Error saving image.");
        }
    };

    return (
        <div>
            {/* Simple Popup Dialog asking for face registration */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Register Face</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                facingMode: "user",
                                width: 600,
                                height: 400,
                            }}
                        />
                    </div>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>Register</Button>
                    </div>
                    {status && <p>{status}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default FaceRegister;
