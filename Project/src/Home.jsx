import React, { useRef, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { Link, Route, Routes } from 'react-router-dom';
import Profile from './Profile';
import './Home.css';
import { db, doc, getDoc, collection, getDocs, setDoc } from './firebase.js'; 
import Webcam from "react-webcam";

function Home() {
    const webcamRef = useRef(null);
    const [time, setTime] = useState("");
    const [status, setStatus] = useState('');
    const [showStatus, setShowStatus] = useState(false);
    const [periods, setPeriods] = useState({});
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [username, setUsername] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState({});

    // Fetch username from localStorage
    useEffect(() => {
        const loggedInUser = localStorage.getItem("username");
        if (loggedInUser) {
            setUsername(loggedInUser);
        } else {
            console.log("No username found in localStorage");
        }
    }, []);

    const fetchAllPeriods = async () => {
        const periodsCollection = collection(db, "subjects");
        const periodsSnapshot = await getDocs(periodsCollection);
        const periodsData = {};
        periodsSnapshot.forEach((doc) => {
            periodsData[doc.id] = doc.data();
        });
        console.log("Fetched periods data:", periodsData);
        setPeriods(periodsData);

        // Fetch attendance status for each period
        const newAttendanceStatus = {};
        for (let periodId of ['period1', 'period2', 'period3', 'period4', 'period5', 'period6', 'period7', 'period8']) {
            const periodDocRef = doc(db, "students", username, periodId, "attendance");
            const periodDocSnapshot = await getDoc(periodDocRef);
            if (periodDocSnapshot.exists()) {
                newAttendanceStatus[periodId] = periodDocSnapshot.data().status;
            } else {
                newAttendanceStatus[periodId] = 'Not Verified';
            }
        }
        setAttendanceStatus(newAttendanceStatus);
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
                console.log("Script Output:", result.script_output);
                setStatus(result.script_output);  // Display the exact output
    
                if (result.script_output === "Verified") {
                    const periodId = selectedPeriod ? selectedPeriod.id : null;
    
                    if (periodId && ['period1', 'period2', 'period3', 'period4', 'period5', 'period6', 'period7', 'period8'].includes(periodId)) {
                        // Reference to student collection -> username document
                        const studentRef = doc(db, "students", username); // Referring to the document of the current user
                        
                        // Reference to the period sub-collection under the username document
                        const periodRef = doc(collection(studentRef, periodId), "attendance");
    
                        // Update period data inside the sub-collection
                        await setDoc(periodRef, {
                            mac_address: result.mac_address,
                            bssid: result.bssid,
                            signal_strength: result.signal_strength,
                            ip_address: result.ip_address,
                            status: "Verified",
                            subject: selectedPeriod?.subject,
                            timing: selectedPeriod?.timing,
                            facultyName: selectedPeriod?.facultyName
                        });
    
                        console.log(`Firebase updated for ${username} in ${periodId} sub-collection`);
                        setStatus(`Verified attendance for ${selectedPeriod?.subject}`);
                    } else {
                        console.error("Invalid period selected.");
                        setStatus("No valid period selected.");
                    }
                } else {
                    setStatus(result.script_output);
                }
    
                if (result.script_output === "Verified") {
                    await fetchAllPeriods(); // Refresh periods data and attendance status
                }
            } else {
                console.error("Error:", result.message);
                setStatus("Error processing image.");
            }
        } catch (error) {
            console.error("Error saving image:", error);
            setStatus("Error saving image.");
        }
    
        // Show status popup for 5 seconds
        setShowStatus(true);
        setTimeout(() => {
            setShowStatus(false);
        }, 5000);
    };

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? String(hours).padStart(2, '0') : '12';
            setTime(`${hours}:${minutes} ${ampm}`);
        };
        updateClock(); // Initial call
        const intervalId = setInterval(updateClock, 60000);

        return () => clearInterval(intervalId); // Clean up on component unmount
    }, []);

    useEffect(() => {
        fetchAllPeriods();
    }, [username]);

    const handlePeriodClick = async (periodId) => {
        const selectedPeriodData = periods[periodId];
    
        // Fetch attendance status from Firebase
        const periodDocRef = doc(db, "students", username, periodId, "attendance");
        const periodDocSnapshot = await getDoc(periodDocRef);
    
        if (periodDocSnapshot.exists()) {
            setSelectedPeriod({
                id: periodId,
                subject: selectedPeriodData?.subject,
                timing: selectedPeriodData?.timing,
                facultyName: selectedPeriodData?.facultyName,
                status: periodDocSnapshot.data().status, // Fetch status from Firebase
            });
        } else {
            setSelectedPeriod({
                id: periodId,
                subject: selectedPeriodData?.subject,
                timing: selectedPeriodData?.timing,
                facultyName: selectedPeriodData?.facultyName,
                status: 'Not Verified', // Default status if not found in Firebase
            });
        }
    
        // Refresh the periods data if necessary
        await fetchAllPeriods();
    };
    
    return (
        <div className='bg'>
            <div id='nav'>
                <nav>
                    <ul style={{ display: 'flex' }}>
                    <li>
                        <img src=".\src\assets\logo.png" alt="hi" style={{ height: '50px', width: '50px' }} />
                    </li>
                        <li title='KEC' style={{ color: 'white', fontSize: '20px', marginRight: '30px' }}>
                            KEC ATTENDANCE
                        </li>
                        <li title='Logout' style={{ display: 'flex', marginLeft: 'auto', marginRight: '-10px', position: 'relative', marginTop: '-15px', cursor: 'pointer' }} >
                            <LogoutIcon sx={{ fontSize: 40 }} />
                        </li>
                        <li title='Profile' style={{ display: 'flex', marginRight: '10px', position: 'relative', top: '-10px', cursor: 'pointer' }} >
                            <Avatar alt="Remy Sharp" src="src\assets\SABARIVELAN S.jpg" sx={{ width: 60, height: 60 }} />
                        </li>
                    </ul>
                </nav>
            </div>
            <div className='sidebar'>
                <ul className='sidebarlist'>
                    <li title='Home'>
                        <HomeRoundedIcon sx={{ fontSize: 35 }} />
                    </li>
                    <li title='Profile'>
                        <Link to='/Profile' style={{ textDecoration: 'none', color: 'inherit' }} >
                            <PersonIcon sx={{ fontSize: 35 }} />
                        </Link>
                    </li>
                    <li title='Calender'>
                        <EventNoteIcon sx={{ fontSize: 35 }} />
                    </li>
                </ul>
            </div>
            <div className='main'>
                <div className='details'>
                    <ul style={{ flexDirection: 'column', alignItems: 'flex-start' }} className='detailsList'>
                        <li>
                            Username: {username || 'Not logged in'}
                        </li>
                        <li>
                            Subject : {selectedPeriod ? selectedPeriod.subject : ''}
                        </li>
                        <li>
                            Timing : {selectedPeriod ? selectedPeriod.timing : ''}
                        </li>
                        <li>
                            Faculty Name : {selectedPeriod ? selectedPeriod.facultyName : ''}
                        </li>
                        <li>
                            Status : {selectedPeriod ? selectedPeriod.status : ''}
                        </li>
                    </ul>
                </div>
                <div className="webcam-container">
                    <div>
                        {time}
                    </div>

                    <div className="webcam-box">
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
                        {showStatus && (
                            <div className="status-popup">
                                <h3>{status}</h3>
                            </div>
                        )}
                    </div>
                    <div>
                        <Button variant="contained" color="success" onClick={handleSubmit}>Submit</Button>
                    </div>
                </div>
                <div>
                    <div className='TimeTable'>
                        {['period1', 'period2', 'period3', 'period4', 'period5', 'period6', 'period7', 'period8'].map((periodId, index) => (
                            <div id='table' key={index}>
                                <Button
                                    onClick={() => handlePeriodClick(periodId)}
                                    sx={{
                                        width: 110,
                                        height: 75,
                                        borderRadius: 0,
                                        borderTopLeftRadius: 20,
                                        borderBottomLeftRadius: 20,
                                        background: attendanceStatus[periodId] === 'Verified'
                                            ? 'linear-gradient(to right, #00C851, #007E33)' // Green gradient for Verified
                                            : 'linear-gradient(to right, #4A90E2, #007AFF)', // Original gradient for non-Verified
                                        color: 'White',
                                        fontSize: 'medium',
                                        fontFamily: 'sans-serif'
                                    }}
                                >
                                    {periods[periodId]?.subject || 'Loading...'}
                                </Button>
                                <Box sx={{ width: 80, height: 75, borderRadius: 0, backgroundColor: 'orange', color: 'White', fontSize: '15PX', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                    <div className='period'>{periods[periodId]?.timing || ''}</div>
                                </Box>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
