import React from 'react';
import { NavLink } from 'react-router-dom';
import Search from './gpt-search';  // Import the Search component

function HomePage({ logout }) {
  
  const isLoggedIn = localStorage.getItem('username');

  // If logged in, only show the Search component
  // if (isLoggedIn) {
  //   return <Search logout={logout} />;
  // }
  
  return (
    <div className="custom-home-page">
     
      
        <div className="hero">
       
          <div className="cool-move">
            <h1>Mentor</h1>
            <p>Workflow</p>
            <p1>Efficiency</p1>
          </div>
          </div>
          <div className="sub">
          <NavLink to="/login"className="btn-login" >
              <button className='log-button button0 button2'>
                  Login
              </button>
          </NavLink>

          <NavLink to="/signup" className="btn-signup">
              <button className='log-button button0 button2'>
                  Signup
              </button>
          </NavLink>

          </div>
   
        
    
      
    </div>
  );
}

export default HomePage;
