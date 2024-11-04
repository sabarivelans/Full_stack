import React from 'react'
import Avatar from '@mui/material/Avatar';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';

import { PieChart } from '@mui/x-charts/PieChart';

import './Profile.css'
function Profile() {
  return (
    <div className='bg'>
        <div id='nav'>
            <nav>
                <ul style={{display:'flex'}}>
                    <li>
                        <img src=".\src\assets\logo.png" alt="" height={50} width={50}/>
                    </li>
                    <li title='KEC' style={{color:'white',fontSize:'20px',marginRight:'30px'}}>
                        KEC ATTENDANCE
                    </li>
                    <li title='Logout'style={{display:'flex',marginLeft:'auto',marginRight:'-10px',position:'relative',marginTop:'-15px',cursor:'pointer'}}>
                        <icon>
                            <LogoutIcon sx={{fontSize:40}} />
                        </icon>
                    </li  >
                    <li title='Profile' style={{display:'flex',marginRight:'10px',position: 'relative',top:'-10px',cursor:'pointer'}}>
                        <Avatar alt="Remy Sharp" src="./src/assets/BLACK.png" sx={{ width: 60, height: 60 }} />
                    </li>
                </ul>
            </nav>
        </div>
        <div className='sidebar'>
            <ul className='sidebarlist' >
                <li title='Home'>
                    <icon>
                        <HomeRoundedIcon sx={{fontSize:35}}/>
                    </icon> 
                </li>
                <li title='Profile'>
                    <icon>
                        <PersonIcon sx={{fontSize:35}}/>
                    </icon> 
                </li>
                <li title='Calender'>
                    <icon>
                        <EventNoteIcon sx={{fontSize:35}}/>
                    </icon> 
                </li>
            </ul>

        </div>
        <div className='MainB'>
            <div className='Detail' >
                <p>STUDENT PROFILE</p>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" sx={{ width: 200, height: 200 }}/>
                <div>
                    <p>Name: John Doe</p>
                    <p>Department: Computer Science</p>
                    <p>Year of study: 2</p>
                    <p>Roll Number: 123456</p>
                </div>
                <Button sx={{height:'auto', width: '170px'}}>Change Password</Button>
            </div>
            <div className='Report'>
                <p>No of Days Present: </p>
                <p>No of Days Absent:</p>
                <p>Total no of Days:</p> 
            </div>
            <div className='Chartpi'>
            <PieChart
                series={[
                    {
                    data: [{ value: 10},
                            {  value: 15},
                            {  value: 20},],
                    innerRadius: 160,
                    outerRadius: 200,
                    paddingAngle: 1,
                    cornerRadius: 5,
                    startAngle: -45,
                    endAngle: 360,
                    cx: 290,
                    cy: 300,
                    }
                ]}
                />
            </div>
            
        </div>
    </div>
  )
}

export default Profile