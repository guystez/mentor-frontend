import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare,faListCheck,faChartPie,faCircleCheck,faHouse,faArrowRightFromBracket,faArrowDownLong,faDownLong,faCircleXmark,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import logo from './images/logo-white.png';

function Inbox({ logout }) {
    
  const [text, setText] = useState('');
  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [checklists, setChecklists] = useState([]);
  const [checklists_today, setChecklists_today] = useState([]);
  const [Notcompleted_today, setNotcompleted_today] = useState([]);
  const [Notcompleted_yesterday, setNotcompleted_yesterday] = useState([]);
  const [massages, setMassages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [Task_text, setTaskText] = useState('');
  const [employee_id, setEmployee_id] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showInput2, setShowInput2] = useState(false);
  const [showmassageInput, setShowmassageInput] = useState(false);
  const [employees, setEmployees] = useState('');
  const [all_area, setAll_area] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [image, setImage] = useState(null);
  const [visibleImage, setVisibleImage] = useState(null);
  const BACKEND_URL = "http://localhost:8000";
  const [messageText, setMessageText] = useState('');
  const [taskText, set_TaskText] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
    
  const handleButtonClick2 = async () => {  // added async keyword
    setMessageSent(true);
    const name = localStorage.getItem('username');
    try {
        const response = await axios.post('http://localhost:8000/mentor/post_massages/', {
            text: messageText,  // Assuming you have `messageText` state variable for input value
            name: name,
            manager: true,
            mark_read: 0,
            // selected_employee: employeeIds
        });
       
        setMessageText('');  // Clear the input after successful submission

        // Fetch updated messages list
        fetchMassages();
        
    } catch (error) {
        console.error('Error sending message:', error);
    }
    setTimeout(() => {
        setShowInput2(false);
        setMessageSent(false);
    }, 0);  // close after 0 second (based on your provided code)
};

  
useEffect(() => {
  const get_area = async () => {
      const name = localStorage.getItem('username');
      try {
          const response = await axios.get(`http://localhost:8000/mentor/get_areas/?name=${name}`);
          setAll_area(response.data.all_areas);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  };

  get_area();
}, []);


  useEffect(() => {
    const fetchEmployees = () => {
      const name = localStorage.getItem('username');
      if (name) {
        axios.get('http://localhost:8000/mentor/edit_employees_get/', { params: { name } })
          .then(response => {
           
            setEmployees(response.data.employee_list);
          })
          .catch(error => {
            console.error("Error fetching employees:", error);
          });
      }
    };

    fetchEmployees(); // Call the function inside useEffect
  }, []);
  




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


const handleButtonClick = () => {
  const name = localStorage.getItem('username');
  if (name) {
    axios.post('http://localhost:8000/mentor/post_employee_tasks/', { name, employee_id, Task_text, image })
      .then(response => {
        
        
        // Close the input field
        setShowInput(false);

        // Fetch the updated tasks list
        fetchTasks(name);

      })
      .catch(error => {
        console.error("Error fetching messages:", error);
      });
  }
};



  const fetchTasks = (username) => {
    axios.get('http://localhost:8000/mentor/get_employee_tasks/', { params: { name: username } })
        .then(response => {
            
            setTasks(response.data.tasks_list);
        })
        .catch(error => {
            console.error("Error fetching tasks:", error);
        });
}
useEffect(() => {
  const name = localStorage.getItem('username');
  if (name) {
      fetchTasks(name);
  }
}, []);

  

  useEffect(() => {
    setAnimate(true);
}, []);

const fetchMassages = () => {
  const name = localStorage.getItem('username');
  if (name) {
      axios.get('http://localhost:8000/mentor/get_massages/', { params: { name } })
          .then(response => {
             
              setMassages(response.data.massages);
          })
          .catch(error => {
              console.error("Error fetching massages:", error);
          });
  }
};

useEffect(fetchMassages, []);
const handleDelete = (id) => {
  const name = localStorage.getItem('username');
  axios.delete(`http://localhost:8000/mentor/delete_massage/${id}/?name=${name}`)
      .then(() => {
          // Update the prevMessageCount
          const prevMessageCount = parseInt(localStorage.getItem('viewedMessagesCount') || '0');
          if (prevMessageCount > 0) {
              localStorage.setItem('viewedMessagesCount', (prevMessageCount - 1).toString());
          }

          // Update the massages state
          setMassages(prevMassages => prevMassages.filter(massage => massage.id !== id));
      })
      .catch(error => {
          console.error("Error deleting massage:", error);
      });
};



const TaskDelete = (id) => {
  const name = localStorage.getItem('username');
  axios.delete(`http://localhost:8000/mentor/delete_tasks/${id}/?name=${name}`)
      .then(() => {
          setTasks(prevMassages => prevMassages.filter(massage => massage.id !== id));
      })
      .catch(error => {
          console.error("Error deleting massage:", error);
      });
};






const check_completed_yesterday = async () => {
  const name = localStorage.getItem('username');  // Get username from localStorage
  try {
    const response = await axios.get(`http://localhost:8000/mentor/check_completed_yesterday/?name=${name}&area=${area}&date=${selectedDate}`);
    
    setNotcompleted_yesterday(response.data.checklists);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


  const check_completed = async () => {
    const name = localStorage.getItem('username');  // Get username from localStorage
    try {
      const response = await axios.get(`http://localhost:8000/mentor/check_completed/?name=${name}&area=${area}&date=${date}`);
      
      setNotcompleted_today(response.data.checklists);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    check_completed();
  }, []);


  const fetchData_auto = async () => {
    const name = localStorage.getItem('username');  // Get username from localStorage
    try {
      const response = await axios.get(`http://localhost:8000/mentor/get_uncomplete_task_auto/?name=${name}&area=${area}&date=${date}`);
     
      setChecklists_today(response.data.checklists);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData_auto();
  }, []);



  const fetchData = async () => {
    const name = localStorage.getItem('username');  // Get username from localStorage
    try {
      const response = await axios.get(`http://localhost:8000/mentor/get_uncomplete_task/?name=${name}&area=${area}&date=${date}`);
     
      setChecklists(response.data.checklists);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []); // Fetch data once when the component mounts
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                    <li>
                        <a href="https://mentor-frontend.onrender.com/edit/"><FontAwesomeIcon icon={faPenToSquare} />Edit</a>
                    </li>
                    <li>
                        <a href="https://mentor-frontend.onrender.com/manage/"><FontAwesomeIcon icon={faListCheck} />Manage</a>
                    </li>
                    <li>
                        <a href="https://mentor-frontend.onrender.com/analytics/"><FontAwesomeIcon icon={faChartPie} />Analytics</a>
                    </li>
                    <li>
                    <a href="https://mentor-frontend.onrender.com/search/"><FontAwesomeIcon icon={faMagnifyingGlass} />Search</a>
                    </li>
                    <li>
                        <NavLink to="/" onClick={logout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />Logout
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
        <div className="main-content">
            <div className='page-part w33 pb-mobile-30'>
                <div className='page-content'>
                <div className='custom-card custom-card-minheight custom-card1 border-left-1'>
                    <div className='custom-card-header'>
                    <h2 className='text-color1'>Uncompleted tasks by filter</h2>
                    </div>
                <div className='custom-card-content'>
                <div className='custom-card-content-top'>
                <label>
  Select Checklist: 
  <select value={area} onChange={(e) => setArea(e.target.value)}>
    <option value="">None</option>
    {all_area.map((areaOption) => (
      <option key={areaOption} value={areaOption}>{areaOption}</option>
    ))}
  </select>
</label>

                <label>
                    Select Date:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>
                <button className='button0 button1 button-center mb-15 button-filter-task' onClick={fetchData}>Filter Tasks</button>
            </div>
            <div className='table-cover'>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Task</th>
                            <th>Area</th>
                            <th>Finish Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checklists.map((checklist, index) => (
                            <tr key={index}>
                                <td>{checklist.employee_name}</td>
                                <td>{checklist.text}</td>
                                <td>{checklist.area}</td>
                                <td>{checklist.finish_time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
        {/* <div className={`arrow-down ${animate ? 'arrow-animate slide-down-animation' : ''}`}></div> */}
        <div className={`longarrow1 text-color1 ${animate ? 'longarrow' : ''}`}><FontAwesomeIcon icon={faDownLong} /></div>
        <div className={`custom-card custom-card-minheight border-left-1 ${animate ? 'slide-down-animation' : ''}`}>
        <div className='custom-card-header'>
            <h2 className='text-color1'>Uncompleted tasks today</h2>
        </div>
        <div className='custom-card-content'>
            <div className='table-cover'>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Task</th>
                        <th>Area</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    </tr>
                    <tr>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    </tr>
                    <tr>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    </tr>
                    <tr>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    </tr>
                    <tr>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    </tr>
                    <tr>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    <td>adi</td>
                    </tr> */}
                    {checklists_today.map((checklist, index) => (
                        <tr key={index}>
                            <td>{checklist.employee_name }</td>
                            <td>{checklist.text}</td>
                            <td>{checklist.area}</td>
                            <td>{checklist.finish_time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            </div>
        </div>
                </div>
            </div>
            <div className='page-part w33'>
                <div className='page-content'>
                <div className='custom-card custom-card-minheight border-left-2 mb-100'>
                    <div className='custom-card-header'>
            <h2 className="text-color2">Employee massages</h2>
            </div>
            <div className='custom-card-content'>
            <button className='button0 button2' onClick={() => setShowInput2(!showInput2)}>Send new message to all</button>

            {showInput2 && (
    <div className="input-field">
        <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Enter message"
        />
        <button className='button0 button2' onClick={handleButtonClick2}>Create</button>
    </div>
)}


            {messageSent && <p>Message sent</p>}

            {/* Displaying the messages */}
            <div className="messages-display">
            {[...massages].reverse().map((massage, index) => (
    <div 
        key={index} 
        className="card-messages-tasks" 
        style={{
            backgroundColor: 
                massage.mark_read === employees.length ? '#5948ed' : 
                (massage.manager ? 'gray' : 'transparent')
        }} 
    >
        <div className='card-messages-tasks-item'>
            <p>{massage.massage}</p>
            <p title={massage.read_by_users.join(', ')}>{massage.employee_name}{massage.manager ? `: ${massage.mark_read}/${employees.length}` : ''}</p>

         
        </div>
        <div className='card-messages-tasks-item'>
            <div className='button-cover'>
                <button className='button0 button2' onClick={() => setVisibleImage(massage.image)}>Image</button>
            </div>
            <div className='button-cover'>
                <button className='button0 button2' onClick={() => handleDelete(massage.id)}>Delete</button>
            </div>
        </div>
    </div>
))}


            </div>
            </div>
        </div>
        
        <div className='custom-card custom-card-minheight border-left-2 '>
          
      <div className='custom-card-header'>
        
        <h2 className="text-color2">Employee tasks</h2>
      </div>

      <div className='custom-card-content'>
      <button className='button0 button2' onClick={() => setShowInput(!showInput)}>Add Task</button>
        
       
        {showInput && (
          <div className="input-field">
            <input
              value={Task_text}
              onChange={(e) => setTaskText(e.target.value)}
              placeholder="Enter task"
            />
            <input type="file" onChange={handleImageUpload} />

            <select
    value={employee_id}
    onChange={(e) => setEmployee_id(e.target.value)}
>
    <option value="" disabled={employee_id !== ""}>Select</option>
    {employees.map(emp => (
        <option key={emp.employee_id} value={emp.employee_id}>{emp.employee_username}</option>
    ))}
</select>

            <button className='button0 button2' onClick={handleButtonClick}>Create</button>
          </div>
        )}
      {[...tasks].reverse().map((task, index) => (
    <div 
        key={index} 
        className="card-messages-tasks" 
        style={{
            backgroundColor: task.completed ? '#018805df' : '#c80505b2',
            boxShadow: '0px 3px 4px #0a010184'
        }}
    >
        <div className='card-messages-tasks-item'>
            <p>{task.text}</p>
            <p>{task.employee_username}</p>
        </div>
      
        <div className='card-messages-tasks-item'>
            <div className='button-cover'>
                <button className='button0 button2' onClick={() => setVisibleImage(task.image)}>Image</button>
            </div>
            <div className='button-cover'>
                <button className='button0 button2' onClick={() => TaskDelete(task.id)}>Delete</button>
            </div>
        </div>
    </div>
))}


      {visibleImage && (
        <div className="image-popup">
          <img src={`${BACKEND_URL}${visibleImage}`} alt="Task" />

          <button onClick={() => setVisibleImage(null)}>Close Image</button>
        </div>
      )}
    </div>

    </div>
                    </div>
            </div>
            <div className='page-part w33'>
            <div className='page-content'>
            <div className={`custom-card custom-card-minheight border-left-3`}>
                <div className='custom-card-header'>
        <h2 className='text-color3'>Uncompleted Checklists By Filter</h2>
        </div>
        <div className='custom-card-content'>
  <div>
    <label>Select Date:</label>
    <input 
      type="date" 
      value={selectedDate} 
      onChange={(e) => setSelectedDate(e.target.value)} 
    />
    <button className='button0 button3' onClick={check_completed_yesterday}>Filter checklist</button>
  </div>
  <ul>
    {Notcompleted_yesterday.map((item, index) => (
      item.not_completed_yesterday && (
        <li key={index}>
          <span className='checklist'><FontAwesomeIcon className='text-color-red' icon={faCircleXmark}/>Checklist type:</span> {item.area}
        </li>
      )
    ))}
  </ul>
</div>

    </div>
    {/* <div className={`arrow2-down ${animate ? 'arrow2-animate' : ''}`}></div> */}
    <div className={`longarrow1 text-color3 ${animate ? 'longarrow' : ''}`}><FontAwesomeIcon icon={faDownLong} /></div>
           
            <div className={`custom-card custom-card-minheight border-left-3 ${animate ? 'slide-down-animation' : ''}`}>
        <div className='custom-card-header'>
        <h2 className='text-color3'>Uncompleted Checklists Today</h2>
        </div>
        <div className='custom-card-content'>
        <ul>
            {Notcompleted_today.map((item, index) => (
                item.not_completed_today && (
                    <li key={index}>
                        <span className='checklist'><FontAwesomeIcon className='text-color-red' icon={faCircleXmark}/>Checklist type:</span> {item.area}
                    </li>
                )
            ))}
        </ul>
        </div>
    </div>
     </div>
            </div>
</div>
</div>
);
}
export default Inbox;
