import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes ,Route, NavLink, Router } from 'react-router-dom';
import HomePage from './components/Homepage';
import LoginPage from './components/Login';
import Search from './components/gpt-search';
// import SignupPage from './components/Upgrade';
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import PrivateRoute from './components/PrivateRoute';
import SignupFree from './components/SignupFree';
import Create_business from './components/Business';
import Analytics from './components/Analytics';
import Inbox from './components/Inbox';
import Edit from './components/Edit';
import DisplayChecklist from './components/Checklist_employee';

import Massages from './components/Massages';
import Task from './components/Tasks';
import Access from './components/Access';
import PaymentLockMessage from './components/Userlocked';
import SuperuserRoute from './components/SuperuserRoute';
// import PrivateRoute from './components/PrivateRoute';

// import SignupFree from './components/SignupFree';





function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('session') === 'logged-in');
  const [is_staff, setIs_staff] = useState('');
  const [is_superuser, setIs_superuser] = useState('');
  const [Businessname, setBusinessname] = useState('');
   // this function logs the user in
   const [session, setSession] = useState(localStorage.getItem('session'))


   const [all_businesses, setAllBusinesses] = useState([]);
   useEffect(() => {
     const name = localStorage.getItem('username');
     
     // Include the name in the endpoint URL
     const apiUrl = `http://localhost:8000/mentor/get_access_of_specific_business/?name=${name}`;
 
     // Fetch businesses from the server on component mount
     axios.get(apiUrl)
         .then(response => {
             setAllBusinesses(response.data.all_businesses);
         })
         .catch(error => {
             console.error('Error fetching data from the server: ', error);
         });
 }, []);

   useEffect(() => {
    const fetchData = async () => {
        const name = localStorage.getItem('username');
        try {
            const response = await axios.get(`http://localhost:8000/mentor/business_insert_db/?name=${name}`);
            setBusinessname(response.data.business_name);
            setIs_staff(response.data.is_staff);
            setIs_superuser(response.data.is_superuser);
            localStorage.setItem('is_superuser',response.data.is_superuser)
           
           
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);



  
   function login(user, pass) {
   
    axios.post('http://localhost:8000/login/', {
        username: user,
        password: pass,
    })
        .then(response => {
            
            setSession('logged-in')
            localStorage.setItem('session', 'logged-in')
            localStorage.setItem('username',user)
        })
        .catch(error => {
            console.log(error);
            let status = error.message
               switch (error.code) {case "ERR_BAD_REQUEST":
               status = "username or password not correct plese try again"
               break
           case "ERR_NETWORK":
               status = "could not reach the server. check if the server is down!"
               break
           case "ERR_BAD_RESPONSE":
               status = "server is up. but had an error. you can try again in a fews seconds"
               break
           default:
               break
       }
       alert("something went wrong: " + status)


        });
}
// document.cookie = "username=John Doe; max-age=86400"; // 86400 seconds = 1 day
window.onbeforeunload = function() {
  localStorage.removeItem('key');
};

function logout() {
  axios.get("http://localhost:8000/logout/")
  setSession(null)
  localStorage.removeItem('session')
  localStorage.removeItem('username')



}


const hasAccessToAllPages = () => {
  for (let business of all_businesses) {
      if (business.access === false) {
       
          return false;
      }
  }
  
  return true;
}



const isLoggedIn = !!localStorage.getItem('username');
            
  return (
  
    
    <BrowserRouter>
    <div className="App">
    
        <Fragment>
            <Routes>
                <Route path='/' element={<HomePage logout={logout} />} />
                
                <Route path='/signup' element={<SignupFree />} />
                <Route path='/login' element={<LoginPage login={login} logout={logout} />} />
                <Route path='/create_business' element={<Create_business login={login} />} />
            

                {/* If has access to all pages, render these routes */}
                {hasAccessToAllPages() && isLoggedIn ? (
                    <>
                        <Route path='/search' element={<Search logout={logout} />} />
                        <Route path='/checklist' element={<DisplayChecklist logout={logout} />} />
                        <Route path='/tasks' element={<Task logout={logout} />} />
                        <Route path='/massages' element={<Massages logout={logout} />} />

                        {/* These routes are only for staff */}
                        {is_staff && (
                            <>
                                <Route path='/search' element={<Search logout={logout} />} />
                                <Route path='/Analytics' element={<Analytics logout={logout} />} />
                                <Route path='/manage' element={<Inbox logout={logout} />} />
                                <Route path='/edit' element={<Edit logout={logout} />} />
                            </>
                        )}

                    </>
                ) : (
                  <Route path="*" element={<PaymentLockMessage />} />
                )}

             
                <Route path='/access' element={<SuperuserRoute />}>
  <Route path='' element={<Access logout={logout} />} />
</Route>


            </Routes>
        </Fragment>
    </div>
</BrowserRouter>

 
  );
}


export default App;