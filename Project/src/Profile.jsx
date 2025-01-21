import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import { PieChart } from '@mui/x-charts/PieChart';
import { useNavigate } from 'react-router-dom';  // For navigation
import { db, doc, getDoc } from './firebase';  // Import Firestore methods
import './Profile.css';

function Profile() {
  const navigate = useNavigate();  // Hook to navigate programmatically
  const [attendance, setAttendance] = useState({ present: 0, absent: 0, total: 0 });
  const studentID = '22ECR157'; // Replace this with dynamic student ID if needed

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Reference to the student's attendance document
        const attendanceDocRef = doc(db, 'attendance_data', studentID);
        const attendanceDoc = await getDoc(attendanceDocRef);
        
        if (attendanceDoc.exists()) {
          const data = attendanceDoc.data();
          setAttendance({
            present: data.present || 0,
            absent: data.absent || 0,
            total: data.total || 0
          });
        } else {
          console.log("No attendance data found");
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, []);

  const handleHomeClick = () => {
    navigate('/home');  // Navigate to the Home page when the Home button is clicked
  };

  return (
    <div className='bg'>
        <div id='nav'>
            <nav>
                <ul style={{display:'flex'}}>
                    <li>
                    <img src=".\src\assets\logo.png" alt="hi" style={{ height: '50px', width: '50px' }} />
                    </li>
                    <li title='KEC' style={{color:'white',fontSize:'20px',marginRight:'30px'}}>
                        KEC ATTENDANCE
                    </li>
                    <li title='Logout' style={{display:'flex',marginLeft:'auto',marginRight:'-10px',position:'relative',marginTop:'-15px',cursor:'pointer'}}>
                        <icon>
                            <LogoutIcon sx={{fontSize:40}} />
                        </icon>
                    </li>
                    <li title='Profile' style={{display:'flex',marginRight:'10px',position: 'relative',top:'-10px',cursor:'pointer'}}>
                        <Avatar alt="Remy Sharp" src="src\assets\SABARIVELAN S.jpg" sx={{ width: 60, height: 60 }} />
                    </li>
                </ul>
            </nav>
        </div>
        <div className='sidebar'>
            <ul className='sidebarlist' >
                <li title='Home' onClick={handleHomeClick} style={{cursor: 'pointer'}}>
                    <icon>
                        <HomeRoundedIcon sx={{fontSize:35}}/>
                    </icon> 
                </li>
                <li title='Profile'>
                    <icon>
                        <PersonIcon sx={{fontSize:35}}/>
                    </icon> 
                </li>
                <li title='Calendar'>
                    <icon>
                        <EventNoteIcon sx={{fontSize:35}}/>
                    </icon> 
                </li>
            </ul>
        </div>
        <div className='MainB'>
            <div className='Detail' >
                <p>STUDENT PROFILE</p>
                <Avatar alt="Remy Sharp" src="src\assets\SABARIVELAN S.jpg" sx={{ width: 200, height: 200}}/>
                <div>
                    <p>Name: SABARIVELAN S</p>
                    <p>Department: ELECTRONIC AND COMMUNICATION</p>
                    <p>Year of study: 3</p>
                    <p>Roll Number: 22ECR157</p>
                </div>
                <Button sx={{height:'auto', width: '170px'}}>Change Password</Button>
            </div>
            <div className='Report'>
                <p>No of Days Present: {attendance.present}</p>
                <p>No of Days Absent: {attendance.absent}</p>
                <p>Remaining no of Days: {attendance.total-attendance.absent-attendance.present}</p>
                <p>Total no of Days: {attendance.total}</p> 
            </div>
            <div className='Chartpi'>
                <PieChart
                    series={[{
                        data: [
                            { value: attendance.present },
                            { value: attendance.absent },
                            { value: attendance.total - attendance.present - attendance.absent }  // Assuming total = present + absent + other
                        ],
                        innerRadius: 160,
                        outerRadius: 200,
                        paddingAngle: 1,
                        cornerRadius: 5,
                        startAngle: -45,
                        endAngle: 360,
                        cx: 290,
                        cy: 300,
                    }]}
                />
            </div>
        </div>
    </div>
  );
}

export default Profile;
