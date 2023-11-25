import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function Create_business({ logout }) {

  const [businessname, setBusinessname] = useState('');
  const [businesscode, setBusinesscode] = useState('');
  const [businesstype, setBusinesstype] = useState('');
  const [businessdata, setBusinessdata] = useState('');
  const [massage, setMassage] = useState('');

  const handleSearchChange = (e) => {
    setBusinessname(e.target.value);
  };

  const handleSearchChange2 = (e) => {
    setBusinesscode(e.target.value);
  };

  const handleSearchChange3 = (e) => {
    setBusinesstype(e.target.value);
  };

  const handleSearchChange4 = (e) => {
    setBusinessdata(e.target.value);
  };

  // Function to send the search query to the backend
  const sendSearchQueryToBackend = async () => {
    try {
      const response = await axios.post('http://localhost:8000/mentor/business_insert_db/', {
        business_name: businessname,
        business_code: businesscode,
        business_type: businesstype,
        business_data: businessdata
      });
     
      setMassage(response.data)
      
    } catch (error) {
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div>
     
       <div class="custom-login-page">
       <div className='margin-bottom'>
           <div className="login-footer">
       
            <a className="button0 button1" href="http://localhost:3000/login/">Login</a>
            <a className="button0 button2" href="http://localhost:3000/signup/">Signup</a>
            </div>
           
            </div>
            
     
        
     
      <div className="main-content">
          
                <div className='page-content'>
                <div className='custom-card custom-card-minheight custom-card1 border-left-1'>
      <div className="search-box">
      Business name :<input 
          type="text" 
          placeholder="insert name" 
          value={businessname}
          onChange={handleSearchChange}
        />
      </div>
      <div className="search-box">
     Business code :<input 
          type="text" 
          placeholder="insert code" 
          value={businesscode}
          onChange={handleSearchChange2}
        />
      </div>
      <div className="search-box">
     Business type :<input 
          type="text" 
          placeholder="Restaurant/Secutiry/Cleaning/etc" 
          value={businesstype}
          onChange={handleSearchChange3}
        />
      </div>
      <div className="search-box">
      Business data :<input 
          type="text" 
          placeholder="insert data" 
          value={businessdata}
          onChange={handleSearchChange4}
        />
      </div>
      <div className="button-container">
      <button className='button0 button2' onClick={sendSearchQueryToBackend}>
     
        Create
      </button>
      </div>
      <div>{massage}</div>
      </div>
      </div>
      </div>
     
    </div>
    </div>
  );
}

export default Create_business;
