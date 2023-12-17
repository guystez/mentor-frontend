import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare,faListCheck,faChartPie,faCircleCheck,faHouse,faArrowRightFromBracket,faSpellCheck,faArrowDownLong,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import logo from './images/logo-white.png';

function Edit({ logout }) {
  const [text, setText] = useState('');
  const [area, setArea] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [checklists, setChecklists] = useState([]);
  const [dataofbusiness, setDataofbusiness] = useState([]);
  const [dataUpdate, setDataUpdate] = useState('');
  const [date, setDate] = useState('');
  const [checklists_today, setChecklists_today] = useState([]);
  const [Notcompleted_today, setNotcompleted_today] = useState([]);
  const [massages, setMassages] = useState([]);
  const [Notcompleted_yesterday, setNotcompleted_yesterday] = useState([]);
  const [employees, setemployees] = useState([]);
  const [all_area, setAll_area] = useState([]);
  const [useTextInput, setUseTextInput] = useState(false);
  const [highlightInput, setHighlightInput] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [textAreaContents, setTextAreaContents] = useState({});


  useEffect(() => {
    const initialContents = {};
    dataofbusiness.forEach(item => {
      initialContents[item.id] = item.data;
    });
    setTextAreaContents(initialContents);
  }, [dataofbusiness]);
  

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


const fetchEmployees = () => {
  const name = localStorage.getItem('username');
  if (name) {
      axios.get('https://mentor-app-h43vr.ondigitalocean.app/mentor/edit_employees_get/', { params: { name } })
          .then(response => {
              
              setemployees(response.data.employee_list);
          })
          .catch(error => {
              console.error("Error fetching employees:", error);
          });
  }
}


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


  useEffect(() => {
      const name = localStorage.getItem('username');
      if (name) {
          axios.get('https://mentor-app-h43vr.ondigitalocean.app/mentor/get_massages/', { params: { name } })
              .then(response => {
               
                  setMassages(response.data.massages);
                  // localStorage.setItem('viewedMessagesCount', response.data.massages.length.toString());
              })
              .catch(error => {
                  console.error("Error fetching massages:", error);
              });
      }
  }, []);

  const deleteEmployee = async (employeeId) => {
    

    const name = localStorage.getItem('username');
    try {
        const url = `https://mentor-app-h43vr.ondigitalocean.app/mentor/edit_employees_delete/${employeeId}/?name=${name}`;
        const response = await axios.delete(url);
       
        
        // Refetch the employees
        fetchEmployees();
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
};


useEffect(() => {
  fetchEmployees();
}, []);

  const check_completed_yesterday = async () => {
    const name = localStorage.getItem('username');  // Get username from localStorage
    try {
      const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/check_completed_yesterday/?name=${name}&area=${area}&date=${date}`);
     
      setNotcompleted_yesterday(response.data.checklists);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    check_completed_yesterday();
  }, []);

  const check_completed = async () => {
    const name = localStorage.getItem('username');  // Get username from localStorage
    try {
      const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/check_completed/?name=${name}&area=${area}&date=${date}`);
     
      setNotcompleted_today(response.data.checklists);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    check_completed();
  }, []);

    const getNewTasksCount = () => {
        const prevCount = parseInt(localStorage.getItem('viewedTasksCount') || '0');
        return checklists_today.length - prevCount;
    };

    const handleInboxClick = () => {
        localStorage.setItem('viewedTasksCount', checklists_today.length.toString());
    };


    useEffect(() => {
      const fetchData_auto = async () => {
          const name = localStorage.getItem('username');
          try {
              const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/get_uncomplete_task_auto/?name=${name}`);
              setChecklists_today(response.data.checklists);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData_auto();
  }, []);

  const update_data_of_business = async (id, updatedContent) => {
    const name = localStorage.getItem('username');
    try {
      const response = await axios.post('https://mentor-app-h43vr.ondigitalocean.app/mentor/update_business_data/', {
        name,
        data_update: updatedContent
      });
     
      fetchData_of_business(); // Re-fetch the data to update the UI after updating
    } catch (error) {
      console.error('Error updating data:', error);
    }
};

  

  const fetchData_of_business = async () => {
    const name = localStorage.getItem('username');  // Get username from localStorage
    try {
      const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/get_business_data/?name=${name}`);
     
      setDataofbusiness(response.data.business);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData_of_business();
  }, []); 




  const deleteChecklistItem = async (id) => {
    const name = localStorage.getItem('username'); 
    try {
      // Construct the URL with both id and name as query parameters
      const url = `https://mentor-app-h43vr.ondigitalocean.app/mentor/delete_checklist_item/${id}/?name=${name}`;
      
      const response = await axios.delete(url);
     
      fetchData(); // Re-fetch the data to update the UI after deletion
    } catch (error) {
      console.error('Error deleting checklist item:', error);
    }
  };
  
  


  const fetchData = async () => {
    const name = localStorage.getItem('username');  // Get username from localStorage
    try {
      const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/create_check_list/?name=${name}&area=${area}`);
     
      setChecklists(response.data.checklists);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [area]); // Re-fetch when area changes

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = localStorage.getItem('username');
    try {
      const response = await axios.post('https://mentor-app-h43vr.ondigitalocean.app/mentor/create_check_list/', {
        name,
        text,
        area,
        finish_time: finishTime,
      });
     
      fetchData(); // Call fetchData after successful post request
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
  
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
  <a href="https://mentor-frontend.onrender.com/manage/" onClick={handleManageClick}>
    <FontAwesomeIcon icon={faListCheck} />
    Manage 
    {getNewNotificationsCount() > 0 && (
      <span className="task-count">{getNewNotificationsCount()}</span>
    )}
  </a>
</li>

                    <li>
                        <a href="https://mentor-frontend.onrender.com/analytics/"><FontAwesomeIcon icon={faChartPie} />Analytics</a>
                    </li>
                    <li>
                    <a href="https://mentor-frontend.onrender.com/exam/"><FontAwesomeIcon icon={faSpellCheck} />Exam</a>
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
      {/* <div className='heading2'>Welcome back {localStorage.getItem('username')}</div> */}
      <div className="main-content flex-wrap">
            <div className='page-part w50 mb-50'>
                <div className='page-content'>
                <div className='custom-card custom-card-minheight custom-card1 border-left-1'>
                  <div className='custom-card-header'>
                  <h2 className='text-color1'>Create Checklist Task</h2>
                  {/* <h2>&nbsp;</h2> */}
                  </div>
                  <div className='custom-card-content h340'>
                  <form onSubmit={handleSubmit}>
            <div>
                <label>Text: </label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div>
                <label>Select Checklist: </label>
                {
                    useTextInput ?
                    <input 
                    type="text" 
                    value={area} 
                    onChange={(e) => setArea(e.target.value)} 
                    style={highlightInput ? {border: '2px solid red'} : {}}
                />
                
                    :
                    <select value={area} onChange={(e) => setArea(e.target.value)}>
                        <option value="">None</option>
                        {all_area.map((areaOption) => (
                            <option key={areaOption} value={areaOption}>{areaOption}</option>
                        ))}
                    </select>
                }
               <button 
    type="button" 
    className='button0 button1' 
    onClick={() => {
        setUseTextInput(prevUseTextInput => !prevUseTextInput);
        if (!useTextInput) {
            setHighlightInput(true);
        } else {
            setHighlightInput(false); // Reset to false if dropdown is shown
        }
    }}
>
    Create New Checklist
</button>


            </div>
            <div>
                <label>Finish Time: </label>
                <input type="time" value={finishTime} onChange={(e) => setFinishTime(e.target.value)} />
            </div>
            <button type="submit" className='button0 button1 button-center'>Create Task</button>
        </form>
      </div>
      </div>
      </div>
      </div>





      <div className='page-part w50 mb-50'>
                <div className='page-content'>
                <div className='custom-card  custom-card-minheight border-left-2'>
                <div className='custom-card-header'>
                <h2 className='text-color2'>Edit Checklists</h2>
                  </div>
      <div className='custom-card-content h340'>
      <label>
  Select Checklist: 
  <select value={area} onChange={(e) => setArea(e.target.value)}>
    <option value="">None</option>
    {all_area.map((areaOption) => (
      <option key={areaOption} value={areaOption}>{areaOption}</option>
    ))}
  </select>
</label>


      <div style={{ display: 'block' }}>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Area</th>
              <th>Finish Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  {checklists.map((checklist, index) => (
    <tr key={index}>
      <td>{checklist.text}</td>
      <td>{checklist.area}</td>
      <td>{checklist.finish_time}</td>
      <td>
        <button className='button0 button2 button-center' onClick={() => deleteChecklistItem(checklist.id)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
        
      </div>
    </div>
    </div>
    </div>
    </div>
    <div className='page-part w50'>
                <div className='page-content'>
                <div className='custom-card custom-card1 custom-card-minheight border-left-1'>
                <div className='custom-card-header'>
                <h2 className='text-color1'>Edit Business Data</h2>
                    {/* <h2>&nbsp;</h2> */}
                  </div>
                  <div className='custom-card-content h340'>
    <table>
  <thead>
    <tr>
    <th>
  Data of - (
  {dataofbusiness.map((dataItem, index) => (
    <span key={index}>{dataItem.business_code}</span>
  ))})
</th>

      <th>Action</th>
    </tr>
  </thead>
  <tbody>
  {Array.isArray(dataofbusiness) && dataofbusiness.map((dataItem, index) => (
  <tr key={index}>
    <td>
      <textarea 
        className='textarea1'
        rows="5" 
        cols="50" 
        value={textAreaContents[dataItem.id] || ""} 
        onChange={(e) => {
          setTextAreaContents(prev => ({...prev, [dataItem.id]: e.target.value}));
        }}
      />
    </td>
    <td>
      <button 
        className='button0 button1 button-center' 
        onClick={() => update_data_of_business(dataItem.id, textAreaContents[dataItem.id] || dataItem.data)}
      >
        Update
      </button>
    </td>
  </tr>
))}

  </tbody>
</table>
</div>
</div>
</div>
</div>
<div className='page-part w50'>
                <div className='page-content'>
                <div className='custom-card custom-card1 custom-card-minheight border-left-2'>
                <div className='custom-card-header'>
                <h2 className='text-color2'>Edit employees</h2>
                    {/* <h2>&nbsp;</h2> */}
                  </div>
                  <div className='custom-card-content h340'>
<table>
    <thead>
        <tr>
            <th>Employee Name</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
    {employees.map((employee, index) => (
        <tr key={index}>
            <td>{employee.employee_username}</td>
            <td>
                <button className='button0 button2 button-center' onClick={() => {
                    const isConfirmed = window.confirm("Are you sure you want to delete this employee?");
                    if (isConfirmed) {
                      
                        deleteEmployee(employee.employee_id);
                    } else {
                        console.log("Delete action was cancelled.");
                    }
                }}>Delete</button>
            </td>
        </tr>
    ))}
</tbody>

</table>
</div>
</div>
</div>
</div>
</div>
    </div>
  );
}

export default Edit;
