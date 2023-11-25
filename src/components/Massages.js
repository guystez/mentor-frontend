// import React, { useState } from 'react';
// import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck,faPenToSquare,faMagnifyingGlass,faRectangleList,faUser,faBuildingUser,faListCheck,faChartPie,faCircleCheck,faHouse,faArrowRightFromBracket,faArrowDownLong,faMessage } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import logo from './images/logo-white.png';
import TaskCount from './Taskscount';
import MassagesCount from './Massagescount';

function Massages({logout}) {
    const [message, setMessage] = useState('');
    const [is_staff, setIs_staff] = useState('');
    const [Businessname, setBusinessname] = useState('');
    const [massages, setMassages] = useState([]);
    const [massages2, setMassages2] = useState([]);
    const [Notcompleted_yesterday, setNotcompleted_yesterday] = useState([]);
    const [checklists_today, setChecklists_today] = useState([]);
    const [Notcompleted_today, setNotcompleted_today] = useState([]);
    const [showSendMessage, setShowSendMessage] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [image, setImage] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [shouldReload, setShouldReload] = useState(false);
    



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


    const name = localStorage.getItem('username'); 


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            const reader = new FileReader();
    
            reader.onloadend = () => {
                setImage(reader.result);
            };
    
            reader.readAsDataURL(file);
        }
    };
    
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
    



    useEffect(() => {
        const fetchData = async () => {
            const name = localStorage.getItem('username');
            try {
                const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/business_insert_db/?name=${name}`);
                setBusinessname(response.data.business_name);
                setIs_staff(response.data.is_staff);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        const name = localStorage.getItem('username');
        if (name) {
            axios.get('https://mentor-app-h43vr.ondigitalocean.app/mentor/get_massages/', { params: { name } })
                .then(response => {
                
                
                  
                    setMassages(response.data.massages);
                    // setMassages2(response.data.massages);
                   
                })
                .catch(error => {
                    console.error("Error fetching massages:", error);
                });
        }
    }, [reloadTrigger]);








    const handleSubmit = async () => {
        const name = localStorage.getItem('username');

        try {
            const response = await axios.post('https://mentor-app-h43vr.ondigitalocean.app/mentor/post_massages/', {
                text: message,
                name: name,
                manager:false,
                mark_read:0,
                image:image
            });

           
            setMessage('');  // Clear the input after successful submission
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };


    
    const handleMarkRead = async (massageId) => { // <- Added async keyword
        const name = localStorage.getItem('username');
    
        try {
            const response = await axios.post('https://mentor-app-h43vr.ondigitalocean.app/mentor/mark_read/', {
                massageId: massageId,
                name: name,
            });
    
          
            
            setMessage('');  // Clear the input after successful submission
            setMassages([])
    
            setReloadTrigger(prev => !prev); // <- Toggle the value of reloadTrigger
    
        } catch (error) {
            console.error('Error sending message:', error);
        }
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
                <li><a href="https://mentor-frontend.onrender.com/massages/"><FontAwesomeIcon icon={faMessage} />Massages <MassagesCount massages={massages} currentUser={name} /></a></li>
                <li><a href="https://mentor-frontend.onrender.com/tasks/"><FontAwesomeIcon icon={faSquareCheck} />Tasks <TaskCount tasks={tasks} /></a></li>
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
                    <h2 className='text-color1'>Messages</h2>
                    </div>
                    <button className='button0 button1' onClick={() => setShowSendMessage(!showSendMessage)}>Send New Message</button>
                   
{/* Textarea to send message */}
{showSendMessage && (
    <div className='custom-card-content h300'>
         <input type="file" onChange={handleImageUpload} />

        <textarea className='textarea1 textarea-h200'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
        />
        <button className='button0 button1 button-center mt-15' onClick={handleSubmit}>Send</button>
    </div>
)}

{/* Displaying the massages with massage.manager true */}
<div className="messages-display">
    
{massages
    .filter(massage => massage.manager && !massage.read_by_users.includes(name))
    .map((massage, index) => (
    <div 
        key={index} 
        className="card-messages-tasks" 
        style={{ backgroundColor: 'gray' }} 
    >
        <div className='card-messages-tasks-item'>
            <p>{massage.massage}</p>
            <p>{massage.employee_name}</p>
           
        </div>
        <div className='card-messages-tasks-item'>
            <div className='button-cover'>
                {/* <button className='button0 button2' onClick={() => setVisibleImage(massage.image)}>Image</button> */}
                <button className='button0 button1' onClick={() => handleMarkRead(massage.id)}>Mark Read</button>
            </div>
           
            <div className='button-cover'>
                {/* <button className='button0 button2' onClick={() => handleDelete(massage.id)}>Delete</button> */}
            </div>
        </div>
    </div>
))}

</div>
</div>
        </div>
        </div>
        </div>
        </div>
    );
}

export default Massages;
