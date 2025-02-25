import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import './Faculty.css';
import { db, doc, getDoc, collection, getDocs, setDoc, updateDoc } from './firebase.js';

function Faculty() {
    const [tabIndex, setTabIndex] = useState(0);
    const [time, setTime] = useState("");
    const [status, setStatus] = useState('');
    const [showStatus, setShowStatus] = useState(false);
    const [periods, setPeriods] = useState({});
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const handleAccept = (username) => {
        // Handle student acceptance logic here, e.g., updating their status
        console.log(`${username} has been accepted`);
    };
    const handleReject = async (username) => {
        try {
            // Reference to the user's attendance document for the selected period
            const periodDocRef = doc(db, "students", username, selectedPeriod.id, "attendance");

            // Fetch the current attendance data for the selected period
            const periodDocSnapshot = await getDoc(periodDocRef);

            if (periodDocSnapshot.exists()) {
                console.log("Existing Data for User: ", periodDocSnapshot.data());

                // Update the `status` field to "Not Verified"
                await updateDoc(periodDocRef, {
                    status: "Not Verified", // Set status to "Not Verified"
                });

                alert(`${username}'s status has been updated to "Not Verified" for Period ${selectedPeriod.id}.`);

                // Optionally, update the local state or UI to reflect the removal
                setSelectedPeriod((prev) => ({
                    ...prev,
                    presentStudents: prev.presentStudents.filter((student) => student !== username),
                }));
            } else {
                alert(`No attendance data found for ${username} in Period ${selectedPeriod.id}.`);
            }
        } catch (error) {
            console.error("Error updating the user's status:", error);
            alert("Failed to update the user's status. Please try again.");
        }
    };







    const fetchAllPeriods = async () => {
        const periodsCollection = collection(db, "subjects");
        const periodsSnapshot = await getDocs(periodsCollection);
        const periodsData = {};
        periodsSnapshot.forEach((doc) => {
            periodsData[doc.id] = doc.data();
        });
        console.log("Fetched periods data:", periodsData);
        setPeriods(periodsData);
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
    }, []);

    const handlePeriodClick = async (periodId) => {
        const selectedPeriodData = periods[periodId];  // Get period details

        // Fetch all students from the 'students' collection
        const studentsCollectionRef = collection(db, "students");
        const studentsSnapshot = await getDocs(studentsCollectionRef);

        const presentStudents = [];
        const remainingStudents = [];
        const signalStrengths = {}; // Store signal strengths for present students

        // Iterate through each student in the 'students' collection
        for (const docSnapshot of studentsSnapshot.docs) {
            const studentData = docSnapshot.data();

            // Get the attendance document for the specific period of this student
            const attendanceRef = doc(db, "students", docSnapshot.id, periodId, "attendance");

            try {
                const attendanceDoc = await getDoc(attendanceRef);

                // If attendance document exists, check its status
                if (attendanceDoc.exists()) {
                    const attendanceStatus = attendanceDoc.data().status;

                    // Get signal strength if available
                    const signalStrength = attendanceDoc.data().signal_strength || 'N/A';

                    // Classify student as present or remaining based on attendance status
                    if (attendanceStatus === 'Verified') {
                        presentStudents.push(docSnapshot.id);  // Use docSnapshot.id (username) for the student
                        signalStrengths[docSnapshot.id] = signalStrength; // Store signal strength
                    } else {
                        remainingStudents.push(docSnapshot.id);  // Use docSnapshot.id (username) for the student
                    }
                } else {
                    console.log(`Attendance document not found for student: ${docSnapshot.id} in ${periodId}`);
                    remainingStudents.push(docSnapshot.id);  // If no attendance status, treat as remaining
                }
            } catch (error) {
                console.error(`Error fetching attendance for student: ${docSnapshot.id} in period: ${periodId}`, error);
            }
        }

        // Set the selected period with present and remaining students
        setSelectedPeriod({
            id: periodId,
            subject: selectedPeriodData?.subject,
            timing: selectedPeriodData?.timing,
            facultyName: selectedPeriodData?.facultyName,
            min_signal: selectedPeriodData?.min_signal,
            presentStudents,
            remainingStudents,
            signalStrengths // Add signal strengths to the selected period
        });
    };


    return (
        <div className='bgf'>
            <div id='navf'>
                <nav>
                    <ul style={{ display: 'flex' }}>
                        <li>
                            <img src=".\src\assets\logo.png" alt="hi" style={{ height: '50px', width: '50px' }} />
                        </li>
                        <li title='KEC' style={{ color: 'white', fontSize: '20px', marginRight: '30px' }}>
                            KEC ATTENDANCE
                        </li>
                        <li title='Logout' style={{ display: 'flex', marginLeft: 'auto', marginRight: '-10px', position: 'relative', marginTop: '-15px', cursor: 'pointer' }}>
                            <LogoutIcon sx={{ fontSize: 40 }} />
                        </li>
                        <li title='Profile' style={{ display: 'flex', marginRight: '10px', position: 'relative', top: '-10px', cursor: 'pointer' }}>
                            <Avatar alt="Remy Sharp" src="src\assets\SABARIVELAN S.jpg" sx={{ width: 60, height: 60 }} />
                        </li>
                    </ul>
                </nav>
            </div>
            <div className='sidebarf'>
                <ul className='sidebarlistf'>
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
            <div className='mainf'>
                <div className="detailsf">
                    <Box sx={{ width: '100%' }}>
                        <Tabs
                            value={tabIndex}
                            onChange={(event, newValue) => setTabIndex(newValue)}
                            centered
                            textColor="inherit"
                            indicatorColor="primary"
                            sx={{
                                '& .MuiTabs-flexContainer': {
                                    justifyContent: 'left',
                                },
                            }}
                        >
                            <Tab label="Present" sx={{ width: 'auto', minWidth: '80px', padding: '6px 12px' }} />
                            <Tab label="Remaining" sx={{ width: 'auto', minWidth: '80px', padding: '6px 12px' }} />
                        </Tabs>
                        <Box sx={{ padding: 2 }}>
                            {tabIndex === 0 && selectedPeriod && (
                                <div>
                                    <h3>Present Students</h3>
                                    {selectedPeriod.presentStudents.length > 0 ? (
                                        <>
                                            {/* Present Students Table */}
                                            <table style={{ borderCollapse: 'collapse', width: '75%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ borderBottom: '1px solid blue', padding: '8px', textAlign: 'center' }}>S.No</th>
                                                        <th style={{ borderBottom: '1px solid blue', padding: '8px', textAlign: 'center' }}>Name</th>
                                                        <th style={{ borderBottom: '1px solid blue', padding: '1px', textAlign: 'center' }}>Signal Strength</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedPeriod.presentStudents
                                                        .filter((username) =>
                                                            selectedPeriod.signalStrengths[username] >= (selectedPeriod.min_signal || 0)
                                                        )
                                                        .map((username, index) => (
                                                            <tr key={index}>
                                                                <td style={{ borderBottom: '1px solid blue', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                                                                <td style={{ borderBottom: '1px solid blue', padding: '8px', textAlign: 'center' }}>{username}</td>
                                                                <td style={{ borderBottom: '1px solid blue', padding: '1px', textAlign: 'center' }}>
                                                                    {selectedPeriod.signalStrengths[username]
                                                                        ? `${selectedPeriod.signalStrengths[username]}%`
                                                                        : 'N/A'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>

                                            {/* Suspect Students Table */}
                                            <h3>Suspect Students</h3>
                                            <table style={{ borderCollapse: 'collapse', width: '75%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>S.No</th>
                                                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Name</th>
                                                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Signal Strength</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedPeriod.presentStudents
                                                        .filter((username) =>
                                                            selectedPeriod.signalStrengths[username] < (selectedPeriod.min_signal || 0)
                                                        )
                                                        .map((username, index) => (
                                                            <tr key={index}>
                                                                <td style={{ padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                                                                <td style={{ padding: '8px', textAlign: 'center' }}>{username}</td>
                                                                <td style={{ padding: '8px', textAlign: 'center' }}>
                                                                    {selectedPeriod.signalStrengths[username]
                                                                        ? `${selectedPeriod.signalStrengths[username]}%`
                                                                        : 'N/A'}
                                                                </td>
                                                                <td style={{ padding: '8px', textAlign: 'center' }}>
                                                                    <button
                                                                        onClick={() => handleReject(username)}
                                                                        style={{
                                                                            backgroundColor: 'red',
                                                                            color: 'white',
                                                                            border: 'none',
                                                                            padding: '5px 10px',
                                                                            borderRadius: '4px',
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>

                                        </>
                                    ) : (
                                        <p>No students present</p>
                                    )}
                                </div>
                            )}

                            {tabIndex === 1 && selectedPeriod && (
                                <div>
                                    <h3>Remaining Students</h3>
                                    <div>
                                        {selectedPeriod.remainingStudents.length > 0 ? (
                                            <table style={{ borderCollapse: 'collapse', width: '75%' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>S.No</th>
                                                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Name</th>
                                                        <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedPeriod.remainingStudents.slice(0, 5).map((username, index) => (
                                                        <tr key={index}>
                                                            <td style={{ padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                                                            <td style={{ padding: '8px', textAlign: 'center' }}>{username}</td>
                                                            <td style={{ padding: '8px', textAlign: 'center' }}>
                                                                <button
                                                                    onClick={() => handleAccept(username)}
                                                                    style={{
                                                                        backgroundColor: 'green',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        padding: '5px 10px',
                                                                        borderRadius: '4px',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    Accept
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>No remaining students</p>
                                        )}
                                    </div>
                                </div>
                            )}


                        </Box>
                    </Box>
                    {/* Period Details Sidebar - Keep Faculty Name and Timing Constant */}
                    {selectedPeriod && (
                        <div className="period-detailsf">
                            <h3>{selectedPeriod.subject}</h3>
                            <p>Timing: {selectedPeriod.timing}</p>
                            <p>Faculty: {selectedPeriod.facultyName}</p>
                            <p>Min: {selectedPeriod.min_signal}</p>
                        </div>
                    )}
                </div>
                <div>
                    <div className='TimeTablef'>
                        {['period1', 'period2', 'period3', 'period4', 'period5', 'period6', 'period7', 'period8'].map((periodId, index) => (
                            <div id='tablef' key={index}>
                                <Button
                                    onClick={() => handlePeriodClick(periodId)}
                                    sx={{
                                        width: 110,
                                        height: 75,
                                        borderRadius: 0,
                                        borderTopLeftRadius: 20,
                                        borderBottomLeftRadius: 20,
                                        background: periods[periodId]?.status === 'Verified'
                                            ? 'linear-gradient(to right, #00C851, #007E33)' // Green gradient for Verified
                                            : 'linear-gradient(to right, #4A90E2, #007AFF)', // Original gradient for non-Verified
                                        color: 'White',
                                        fontSize: 'medium',
                                        fontFamily: 'sans-serif'
                                    }}
                                >
                                    {periods[periodId]?.subject || 'Loading...'}
                                </Button>
                                <Box sx={{ width: 80, height: 75, borderRadius: 0, backgroundColor: 'orange', color: 'White', fontSize: '15PX', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div className='periodf'>{periods[periodId]?.timing || ''}</div>
                                </Box>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Faculty;
