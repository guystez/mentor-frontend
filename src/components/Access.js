import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck,faPenToSquare,faMagnifyingGlass,faRectangleList,faUser,faBuildingUser,faListCheck,faChartPie,faCircleCheck,faHouse,faArrowRightFromBracket,faArrowDownLong,faMessage } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import logo from './images/logo-white.png';



function Access({ logout }) {
    
  

    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [all_businesses, setAllBusinesses] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [reloadBusinesses, setReloadBusinesses] = useState(false);


    useEffect(() => {
        // Fetch businesses from the server on component mount
        axios.get('http://localhost:8000/mentor/get_all_business_access/')
            .then(response => {
                setAllBusinesses(response.data.all_businesses);
                setReloadBusinesses(false); 
            })
            .catch(error => {
                console.error('Error fetching data from the server: ', error);
            });
    }, [reloadBusinesses]);



    const handleAccessChange = (action) => {
      if (!selectedBusiness) {
        alert('Please select a business first.');
        return;
      }
  
      // Make a POST request to your server with the selected business and action
      axios.post('http://localhost:8000/mentor/post_all_business_access/', {
        'businessId': selectedBusiness,
        'action': action
      })
      .then(response => {
       
        setReloadBusinesses(true);
        // Handle the response as per your needs
      })
      .catch(error => {
        console.error('Error sending data to the server: ', error);
      });
    };


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

  return (
    <div  className="custom-page custom-page-manage">
        <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
        <div className={`hamburger-icon ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
                ☰
        </div>
        <div className={`close-icon ${sidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
                &times;
        </div>
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} >
            <nav>
            <a className='sidebar-logo' href='https://mentor-frontend.onrender.com/search/'><img className='sidebar-logo-image' src={logo} alt="Logo" /></a>
                <ul>
                    
                    
                <li><a href="https://mentor-frontend.onrender.com/checklist/"><FontAwesomeIcon icon={faRectangleList} />Checklist</a></li>
                <li><a href="https://mentor-frontend.onrender.com/massages/"><FontAwesomeIcon icon={faMessage} />Massages</a></li>
                <li><a href="https://mentor-frontend.onrender.com/tasks/"><FontAwesomeIcon icon={faSquareCheck} />Tasks</a></li>
                <li><a href="https://mentor-frontend.onrender.com/search/"><FontAwesomeIcon icon={faMagnifyingGlass} />Search</a></li>
                    <li>
                        <NavLink to="/" onClick={logout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />Logout
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
        <div className="main-content">
                <div className='page-part w33 pb-mobile-30'></div>
                <div className='page-part w33'>
                    <div className='page-content'>
                        <div className='custom-card custom-card-minheight border-left-2 '>
                            <div className='custom-card-header'>
                                <h2 className="text-color2">Give Access</h2>

                                {/* Dropdown for businesses */}
                                <select onChange={e => setSelectedBusiness(e.target.value)}>
                                    <option value="" disabled selected>Select a Business</option>
                                    {all_businesses.map((business) => (
                                        <option key={business.id} value={business.id}>
                                            {business.business_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='custom-card-content'>
                                {/* Display business details in table if a business is selected */}
                                {selectedBusiness && 
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Business Name</th>
                                                <th>Business Code</th>
                                                <th>Access</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {all_businesses.filter(business => business.id == selectedBusiness).map((filteredBusiness) => (
                                                <tr key={filteredBusiness.id}>
                                                    <td>{filteredBusiness.business_name}</td>
                                                    <td>{filteredBusiness.business_code}</td>
                                                    <td>{filteredBusiness.access ? 'true' : 'false'}</td>

                                                    <td>
                                                        <button onClick={() => handleAccessChange('give')}>Give Access</button>
                                                        <button onClick={() => handleAccessChange('cancel')}>Cancel Access</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
);
}
export default Access;