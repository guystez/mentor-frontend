import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck,faPenToSquare,faMagnifyingGlass,faRectangleList,faUser,faBuildingUser,faListCheck,faChartPie,faCircleCheck,faSpellCheck,faHouse,faArrowRightFromBracket,faArrowDownLong,faMessage } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import logo from './images/logo-white.png';
import TaskCount from './Taskscount';
import MassagesCount from './Massagescount';

function Task({ logout }) {
    
 
  

  const [tasks, setTasks] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [Task_text, setTaskText] = useState('');
  const [employee_id, setEmployee_id] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [employees, setEmployees] = useState('');
  const [visibleImage, setVisibleImage] = useState(null);
  const [update, setUpdate] = useState(false);
  const [Massages_of_employee, setMassages_of_employee] = useState([]);

  useEffect(() => {
    const name = localStorage.getItem('username');
    if (name) {
        axios.get('https://mentor-app-h43vr.ondigitalocean.app/mentor/get_massages/', { params: { name } })
            .then(response => {
            

              // Filter out messages where the manager field matches the current username
              // Assuming that massage.manager contains the username of the manager who sent the message
              const filteredMessages = response.data.massages.filter(massage => massage.manager !== name);
            
              setMassages_of_employee(filteredMessages);
               
            })
            .catch(error => {
                console.error("Error fetching massages:", error);
            });
    }
}, []);


  const handleButtonClick = (task_id) => {
    const name = localStorage.getItem('username');
    if (name) {
      axios.post('https://mentor-app-h43vr.ondigitalocean.app/mentor/post_employee_tasks_for_employee/', { name, employee_id, task_id })
        .then(response => {
         
          setUpdate(prev => !prev); // Toggle the state to trigger useEffect
        })
        .catch(error => {
          console.error("Error fetching messages:", error);
        });
    }
  };

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
  }, [update]); // Include the state variable in the dependency array
  

  useEffect(() => {
    setAnimate(true);
}, []);

  


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
                    
                    
                <li><a href="https://mentor-frontend.onrender.com/checklist/"><FontAwesomeIcon icon={faRectangleList} />Checklist</a></li>
                <li><a href="https://mentor-frontend.onrender.com/massages/"><FontAwesomeIcon icon={faMessage} />Massages <MassagesCount massages={Massages_of_employee} currentUser={name} /></a></li>
                <li><a href="https://mentor-frontend.onrender.com/tasks/"><FontAwesomeIcon icon={faSquareCheck} />Tasks <TaskCount tasks={tasks} /></a> </li>
                <li>
                    <a href="https://mentor-frontend.onrender.com/exam_employee/"><FontAwesomeIcon icon={faSpellCheck} />Exam</a>
                    </li>
                <li><a href="https://mentor-frontend.onrender.com/search/"><FontAwesomeIcon icon={faMagnifyingGlass} />Search</a></li>
                    <li>
                        <NavLink to="/" onClick={logout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />Logout
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
        <div className="main-content justify-content-center">
            <div className='page-part w75'>
                <div className='page-content'>
               
        <div className='custom-card custom-card-minheight border-left-2 '>
      <div className='custom-card-header'>
        <h2 className="text-color2">Employee tasks</h2>
      </div>
      <div className='custom-card-content'>
  {tasks.length > 0 ? (
    tasks.map((task, index) => (
      <div key={index} className="card-messages2" style={{
        backgroundColor: task.completed ? '#018805df' : '#c80505b2',
        boxShadow: '0px 3px 4px #0a010184'
      }}>
        <p>{task.text}</p>
        <p>{task.employee_username}</p>
        {/* Assuming task has an image property */}
        <button className='button0 button2' onClick={() => setVisibleImage(task.image)}>Image</button>
        <button className='button0 button2' onClick={() => handleButtonClick(task.id)}>Completed</button>
      </div>
    ))
  ) : (
    <p>No tasks yet.</p> // Message displayed when there are no tasks
  )}

  {visibleImage && (
    <div className="image-popup">
      <img src={`https://mentor-app-h43vr.ondigitalocean.app${visibleImage}`} alt="Task" />
      <button onClick={() => setVisibleImage(null)}>Close Image</button>
    </div>
  )}
</div>


    </div>
                    </div>
            </div>
           
</div>
</div>
);
}
export default Task;
