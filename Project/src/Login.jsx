import React from 'react'
import './Login.css'
function Login() {
  return (
    <div>
            <div className='whole'>
                <div className='img'>
                    <img src="./1.png" alt="" />
                    <br /><br /><br />
                    <h1>Welcome Back! <br /><br />Please Log In to Continue.</h1>
                    
                    <div className="footer"><p>If Dont have Account <a href="#">Register</a></p></div>
                </div>
                <div className='login'>
                    <h1 id='heading'>LOGIN</h1>
                    <br /><br /><br />
                    <input type="text" placeholder='Username'/>
                    <br /><br /><br />
                    <input type="password" placeholder='Password' />
                    <br /><br />
                    <a href="#">Forget Password?</a><br /><br /><br /><br />
                    <button >Login</button> {/* Change to handleHost */}
                    <br /><br />
                </div>
            </div>
        </div>
  )
}

export default Login