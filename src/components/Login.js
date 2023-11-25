
import { Button } from "react-bootstrap"
import { Link, Navigate, NavLink } from "react-router-dom"
import logo from './images/custom-logo.png';

function LoginPage({login,logout}){
   function formlogin(e){
       e.preventDefault()
       login(e.target.username.value, e.target.password.value)
       
   }
return (
    <div class="custom-login-page">
    <nav className="login-page-nav">
          <ul>
        
          {localStorage.getItem('username') ? (
  <>
 <Navigate to="/search" />
    <NavLink to="/" className="me-auto" onClick={logout}>Logout</NavLink>
    <div className='me-auto3'>
      <span className='me-auto3__text'>Logged in as: {localStorage.getItem('username')}</span>
    </div>
  </>
) : (
  <>
                  <li>
              {/* <a href="https://mentor-frontend.onrender.com/create_business/">Create</a> */}
            </li>
  </>
)}


            
          </ul>
        </nav>
        
       <div className="login-form-cover">
       <img className='login-page-logo' src={logo} alt="Logo" />
       <h2 className="login-page-title">Please Login</h2>

           <form className="login-page" onSubmit={formlogin}>
               <input className="heading6" type="text" name="username" placeholder="Enter Username" />
               <input type="password" name="password" placeholder="Enter Password" />
               <input className="login-button" value="Login" type="submit"/>
               <div className="login-footer">
               <a className="button0 button1" href="https://mentor-frontend.onrender.com/signup/">Signup</a>
               <a className="button0 button2" href="https://mentor-frontend.onrender.com/create_business/">Create</a>
              </div>
           </form>
       </div>
       </div>
   )
}


export default LoginPage
