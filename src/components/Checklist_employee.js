// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck,faPenToSquare,faRectangleList,faMagnifyingGlass,faSpellCheck,faUser,faBuildingUser,faListCheck,faChartPie,faCircleCheck,faHouse,faArrowRightFromBracket,faArrowDownLong,faMessage } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import logo from './images/logo-white.png';
import TaskCount from './Taskscount';
import MassagesCount from './Massagescount';


function DisplayChecklist({logout}) {
  const [checklists, setChecklists] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({});
  const [area, setArea] = useState('waiters'); // Default value
  const [message, setMessage] = useState('');
  const [is_staff, setIs_staff] = useState('');
  const [Businessname, setBusinessname] = useState('');
  const [massages, setMassages] = useState([]);
  const [Notcompleted_yesterday, setNotcompleted_yesterday] = useState([]);
  const [checklists_today, setChecklists_today] = useState([]);
  const [Notcompleted_today, setNotcompleted_today] = useState([]);
  const [all_area, setAll_area] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [Massages_of_employee, setMassages_of_employee] = useState([]);


  useEffect(() => {
    const name = localStorage.getItem('username');
    if (name) {
        axios.get('https://mentor-app-h43vr.ondigitalocean.app/mentor/get_massages/', { params: { name } })
            .then(response => {
            
            
              
                setMassages_of_employee(response.data.massages);
               
            })
            .catch(error => {
                console.error("Error fetching massages:", error);
            });
    }
}, [])

    



    useEffect(() => {
        const name = localStorage.getItem('username');
        if (name) {
          axios.get('https://mentor-app-h43vr.ondigitalocean.app/mentor/get_employee_tasks_for_employee/', { params: { name } })
            .then(response => {
        
              setTasks(response.data.tasks_list);
             
            })
            .catch(error => {
              console.error("Error fetching massages:", error);
            });
        }
      }, [])



  useEffect(() => {
    const get_area = async () => {
        const name = localStorage.getItem('username');
        try {
            const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/get_areas/?name=${name}`);
            setAll_area(response.data.all_areas);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
  
    get_area();
  }, []);
  

  
  const getNewNotificationsCount = () => {
      const prevMessageCount = parseInt(localStorage.getItem('viewedMessagesCount') || '0');
      const prevTaskCount = parseInt(localStorage.getItem('viewedTasksCount') || '0');
      const prevNotCompletedTodayCount = parseInt(localStorage.getItem('viewedNotCompletedTodayCount') || '0');
      const prevNotCompletedYesterdayCount = parseInt(localStorage.getItem('viewedNotCompletedYesterdayCount') || '0');
      
      const totalNewItems = massages.length + checklists_today.length + Notcompleted_today.length + Notcompleted_yesterday.length - prevMessageCount - prevTaskCount - prevNotCompletedTodayCount - prevNotCompletedYesterdayCount;
      return totalNewItems;
  };
  
  const handleManageClick = () => {
      localStorage.setItem('viewedMessagesCount', massages.length.toString());
      localStorage.setItem('viewedTasksCount', checklists_today.length.toString());
      localStorage.setItem('viewedNotCompletedTodayCount', Notcompleted_today.length.toString());
      localStorage.setItem('viewedNotCompletedYesterdayCount', Notcompleted_yesterday.length.toString());
  };
 

  const fetchData = async () => {
    const name = localStorage.getItem('username');  // Get username from localStorage
    try {
      const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/create_check_list/?name=${name}&area=${area}`);
     
      setChecklists(response.data.checklists);
  
      // Initialize completedTasks state with all tasks set to false
      const initialCompletedTasks = {};
      response.data.checklists.forEach(task => {
        initialCompletedTasks[task.id] = false;
      });
      setCompletedTasks(initialCompletedTasks);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [area]); // Re-fetch when area changes

  const toggleCompleted = (id) => {
    setCompletedTasks(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };
  

  const sendChecklist = async () => {
    try {
      const response = await axios.post(`https://mentor-app-h43vr.ondigitalocean.app/mentor/update_checklist/`, {
        completedTasks,
        'name':localStorage.getItem('username'),
        'area':area

      });
   
      // Re-fetch the data to update the UI
      fetchData();
    } catch (error) {
      console.error('Error sending checklist:', error);
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const name = localStorage.getItem('username');
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
        {is_staff && (
            <>
                <li><a href="https://mentor-frontend.onrender.com/edit/"><FontAwesomeIcon icon={faPenToSquare} />Edit</a></li>
               <li><a href="https://mentor-frontend.onrender.com/manage/" onClick={handleManageClick}>
               <FontAwesomeIcon icon={faListCheck} />Manage {getNewNotificationsCount() > 0 && `(${getNewNotificationsCount()})`}
</a></li>


                <li><a href="https://mentor-frontend.onrender.com/analytics/"><FontAwesomeIcon icon={faChartPie} />Analytics</a></li>
                <li>
                <a href="https://mentor-frontend.onrender.com/"><FontAwesomeIcon icon={faHouse} />Home</a>
              </li>
            </>
        )}
        {!is_staff && (
            <>
                <li><a href="https://mentor-frontend.onrender.com/checklist/"><FontAwesomeIcon icon={faRectangleList} />Checklist</a></li>
                <li><a href="https://mentor-frontend.onrender.com/massages/"><FontAwesomeIcon icon={faMessage} />Massages <MassagesCount massages={Massages_of_employee} currentUser={name} /></a></li>
                <li><a href="https://mentor-frontend.onrender.com/tasks/"><FontAwesomeIcon icon={faSquareCheck} />Tasks <TaskCount tasks={tasks} /></a></li>
                <li>
                    <a href="https://mentor-frontend.onrender.com/exam_employee/"><FontAwesomeIcon icon={faSpellCheck} />Exam</a>
                    </li>
                <li><a href="https://mentor-frontend.onrender.com/search/"><FontAwesomeIcon icon={faMagnifyingGlass} />Search</a></li>
            </>
        )}
        <li>
            <NavLink to="/" onClick={logout}><FontAwesomeIcon icon={faArrowRightFromBracket} />Logout</NavLink>
        </li>
    </ul>
  </nav>
            </aside>
            <div className="main-content justify-content-center">
            <div className='page-part w50 pb-mobile-30'>
                <div className='page-content'>
                <div className='custom-card custom-card-minheight custom-card1 border-left-1'>
                <div className='custom-card-header'>
                    <h2 className='text-color1'>Checklists</h2>
                  </div>
                  <div className='custom-card-content h300'>
                    <div className='card-content-top'>
                    <label>
  Select Checklist: 
  <select value={area} onChange={(e) => setArea(e.target.value)}>
    <option value="">None</option>
    {all_area.map((areaOption) => (
      <option key={areaOption} value={areaOption}>{areaOption}</option>
    ))}
  </select>
</label>
                    </div>
                    <div className='table-cover'>
                    <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Area</th>
              <th>Finish Time</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {checklists.map((checklist, index) => (
              <tr key={index}>
                <td>{checklist.text}</td>
                <td>{checklist.area}</td>
                <td>{checklist.finish_time}</td>
                <td>
                  <input className='txtcheck'
                    type="checkbox" 
                    checked={completedTasks[checklist.id] || false} 
                    onChange={() => toggleCompleted(checklist.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
                    </div>
                  </div>
                  <button className='button0 button1 button-center mt-20' onClick={sendChecklist}>Send Checklist</button>
                </div>
                </div>
              </div>
            </div>
    </div>
  );
}

export default DisplayChecklist;
