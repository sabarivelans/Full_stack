import React from 'react'
import Avatar from '@mui/material/Avatar';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import {Link,Route,Routes} from 'react-router-dom'
import Profile from './Profile';
import './Home.css'
import { Icon } from '@mui/material';
function Home() {
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
                    <Link to='/Profile' style={{ textDecoration: 'none', color: 'inherit' }} ><PersonIcon sx={{fontSize:35}}/></Link> 
                </li>
                <li title='Calender'>
                    <icon>
                        <EventNoteIcon sx={{fontSize:35}}/>
                    </icon> 
                </li>
            </ul>

        </div>
        <div className='main'>
            <div className='Details'>
                <ul style={{flexDirection:'column',alignItems:'flex-start'}} className='DetailsList'>
                    <li>
                        Subject :
                    </li>
                    <li>
                        Timing :
                    </li>
                    <li>
                        Faculty Name :
                    </li>
                </ul>
            </div>
            <div className="webcam-container">
                <div>
                    12:30 PM
                </div>
                <div className="webcam-box" />
                <div>
                    <button>
                        submit
                    </button>
                </div>
            </div>
            <div>
                <div className='TimeTable'>
                    <div id='table'>
                        <Button sx={{ width: 110,height: 75,borderRadius: 0,borderTopLeftRadius: 20,borderBottomLeftRadius:20,background:'linear-gradient(to right, #4A90E2, #007AFF)',color:'White',fontSize:'medium',fontFamily:'sans-serif'}} >ESI</Button>
                        <Box sx={{ width: 80,height: 75,borderRadius: 0,borderTopRightRadius:10, background: 'orange',color:'White',fontSize:'15PX',fontFamily:'sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}> <div className='period' >08:45 AM <br />to<br />09:40 AM </div> </Box>
                    </div>
                    <div id='table'>
                        <Button sx={{ width: 110,height: 75,borderRadius: 0,borderTopLeftRadius: 20,borderBottomLeftRadius:20,background:'linear-gradient(to right, #4A90E2, #007AFF)',color:'White',fontSize:'medium',fontFamily:'sans-serif'}} >ESI</Button>
                        <Box sx={{ width: 80,height: 75,borderRadius: 0,backgroundColor:'orange',color:'White',fontSize:'15PX',fontFamily:'sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}> <div className='period' > 09:40 AM <br />to<br /> 10:25 AM </div> </Box>
                    </div>
                    <div id='table'>
                        <Button sx={{ width: 110,height: 75,borderRadius: 0,borderTopLeftRadius: 20,borderBottomLeftRadius:20,background:'linear-gradient(to right, #4A90E2, #007AFF)',color:'White',fontSize:'medium',fontFamily:'sans-serif'}} >ESI</Button>
                        <Box sx={{ width: 80,height: 75,borderRadius: 0,backgroundColor:'orange',color:'White',fontSize:'15PX',fontFamily:'sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}> <div className='period' > 10:45 AM <br />to<br /> 11:30 AM </div> </Box>
                    </div>
                    <div id='table'>
                        <Button sx={{ width: 110,height: 75,borderRadius: 0,borderTopLeftRadius: 20,borderBottomLeftRadius:20,background:'linear-gradient(to right, #4A90E2, #007AFF)',color:'White',fontSize:'medium',fontFamily:'sans-serif'}} >ESI</Button>
                        <Box sx={{ width: 80,height: 75,borderRadius: 0,backgroundColor:'orange',color:'White',fontSize:'15PX',fontFamily:'sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}> <div className='period' > 11:30 AM <br />to<br />12:15 PM </div> </Box>
                    </div>
                    <div id='table'>
                        <Button sx={{ width: 110,height: 75,borderRadius: 0,borderTopLeftRadius: 20,borderBottomLeftRadius:20,background:'linear-gradient(to right, #4A90E2, #007AFF)',color:'White',fontSize:'medium',fontFamily:'sans-serif'}} >ESI</Button>
                        <Box sx={{ width: 80,height: 75,borderRadius: 0,backgroundColor:'orange',color:'White',fontSize:'15PX',fontFamily:'sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}> <div className='period' > 01:15 PM <br />to<br /> 02:00 PM </div> </Box>
                    </div>
                    <div id='table'>
                        <Button sx={{ width: 110,height: 75,borderRadius: 0,borderTopLeftRadius: 20,borderBottomLeftRadius:20,background:'linear-gradient(to right, #4A90E2, #007AFF)',color:'White',fontSize:'medium',fontFamily:'sans-serif'}} >ESI</Button>
                        <Box sx={{ width: 80,height: 75,borderRadius: 0,backgroundColor:'orange',color:'White',fontSize:'15PX',fontFamily:'sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}> <div className='period' > 02:00 PM <br />to<br /> 02:45 PM </div> </Box>
                    </div>
                    <div id='table'>
                        <Button sx={{ width: 110,height: 75,borderRadius: 0,borderTopLeftRadius: 20,borderBottomLeftRadius:20,background:'linear-gradient(to right, #4A90E2, #007AFF)',color:'White',fontSize:'medium',fontFamily:'sans-serif'}} >ESI</Button>
                        <Box sx={{ width: 80,height: 75,borderRadius: 0,backgroundColor: 'orange',color:'White',fontSize:'15PX',fontFamily:'sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}> <div className='period' > 03:00 PM <br />to<br /> 03:45 PM </div> </Box>
                    </div>
                    <div id='table'>
                        <Button sx={{ width: 110,height: 75,borderRadius: 0,borderTopLeftRadius: 20,borderBottomLeftRadius:20,background:'linear-gradient(to right, #4A90E2, #007AFF)',color:'White',fontSize:'medium',fontFamily:'sans-serif'}}>ESI</Button>
                        <Box sx={{ width: 80,height: 75,borderRadius: 0,borderBottomRightRadius:10,backgroundColor:'orange',color:'White',fontSize:'15PX',fontFamily:'sans-serif',display:'flex',alignItems:'center',justifyContent:'center'}}> <div className='period' > 03:45 PM <br />to<br /> 4:30 PM </div> </Box >
                    </div>         
                </div>
            </div>
            
        </div>
        <Routes>
        <Route path="/profile" element={<Profile />} />
        </Routes>
    </div>
  )
}

export default Home