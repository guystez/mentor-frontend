import React, { useState } from 'react';
import axios from 'axios';
// import Thanks, {status} from './thanks';




const SignupFree = () => {
  const [formData, setFormData] = useState({
    username: '',
    last_name: '',
    // email: '',
    password: '',
    confirm_password: '',
    is_staff: false,
    code: '', // Field for the superuser code
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the provided code matches the superuser code
    const isSuperuser = formData.code === 'superuseradmin14';
    // Exclude the code from the data sent to the backend
    const { code, ...dataToSend } = formData;
    // If the code matches, set the superuser property accordingly
    dataToSend.is_superuser = isSuperuser;
   

    axios.post('http://localhost:8000/register/', dataToSend)
      .then((response) => {
        // Success
       
        alert('Registration Successful');
        // Redirect to the login page
        window.location.replace('/login');
      })
      .catch((error) => {
        // Error handling
        console.error('Registration failed:', error.response);
        alert('Registration Failed');
      });
  };

  return (
    
    
          <div>
             <div class="custom-login-page">
              
      <section  >
      
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          
              <div className="signup-form">
              <div className='margin-bottom2'>
           <div className="login-footer">
       
            <a className="button0 button1" href="http://localhost:3000/login/">Login</a>
            <a className="button0 button2" href="http://localhost:3000/create_business/">Create</a>
            </div>
           
            </div>
                <form onSubmit={handleSubmit}>
                  
                  <div className="form-outline mb-4">
                    <input type="text" className="form-control form-control-lg" name="username" value={formData.username} onChange={handleInputChange} placeholder="Enter Username" />
                    <label className="form-label" >
                      Username:
                    </label>
                  </div>
                  <div className="form-outline mb-4">
                    <input type="text" className="form-control form-control-lg" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Enter code" />
                    <label className="form-label" >
                      Business code:
                    </label>
                  </div>
                  <div id='iframeContainer'>
      </div>
                    {/* <div className="form-outline mb-4">
                      <input
                        type="email"
                        //   id="typePasswordX-2"
                        className="form-control form-control-lg"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email} onChange={handleInputChange}
                      />
                      <label className="form-label" >
                        Email
                      </label>
                    </div> */}
                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        //   id="typePasswordX-2"
                        className="form-control form-control-lg"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password} onChange={handleInputChange}
                      />
                      <label className="form-label" >
                        Password
                      </label>
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        //   id="typePasswordX-2"
                        className="form-control form-control-lg"
                        name="confirm_password"
                        placeholder="confirm password"
                        value={formData.confirm_password} onChange={handleInputChange}
                      />
                      <label className="form-label" >
                        confirm password
                      </label>
                    </div>
                    <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="is_staff"
                      checked={formData.is_staff}
                      onChange={e => setFormData({ ...formData, is_staff: e.target.checked })}
                    />
                    <label className="form-check-label">
                      Is Staff
                    </label>
                  </div>
<div><br></br></div>
                  <div className="form-outline mb-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Enter Code"
                  />
                  <label className="form-label"></label>
                </div>

                    <button className="button0 button2" type="submit">
                      Register
                    </button>
                  </form>
                </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};
export let formData
export default SignupFree;