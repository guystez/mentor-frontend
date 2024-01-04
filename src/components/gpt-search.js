import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck,faPenToSquare,faMagnifyingGlass,faUser,faBuildingUser,faSpellCheck,faRectangleList,faListCheck,faChartPie,faCircleCheck,faHouse,faArrowRightFromBracket,faArrowDownLong,faMessage } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import logo from './images/logo-white.png';
import TaskCount from './Taskscount';
import MassagesCount from './Massagescount';

function Search({ logout }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [Answer, setAnswer] = useState('');
    const [Businessname, setBusinessname] = useState(localStorage.getItem('Businessname'));
    const [area, setArea] = useState('');
    const [date, setDate] = useState('');
    const [is_staff, setIs_staff] = useState(localStorage.getItem('isStaff') === 'true');
    // const [is_staff, setIs_staff] = useState('');
    const [checklists_today, setChecklists_today] = useState([]);
    const [Notcompleted_today, setNotcompleted_today] = useState([]);
    const [massages, setMassages] = useState([]);
    const [Notcompleted_yesterday, setNotcompleted_yesterday] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [Massages_of_employee, setMassages_of_employee] = useState([]);
    const [loading, setLoading] = useState(false);



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
      const name = localStorage.getItem('username');
      if (name) {
          axios.get('https://mentor-app-h43vr.ondigitalocean.app/mentor/get_massages/', { params: { name } })
              .then(response => {
                
                  setMassages(response.data.massages);
                 
              })
              .catch(error => {
                  console.error("Error fetching massages:", error);
              });
      }
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

   
    

    const sendSearchQueryToBackend = async () => {
        setLoading(true);  // Start loading
        try {
            const response = await axios.post('https://mentor-app-h43vr.ondigitalocean.app/mentor/search/', {
                query: searchQuery,
                username: localStorage.getItem('username'),
                business_code: localStorage.getItem('business_code')
            });
            setAnswer(response.data.answer);
            
        } catch (error) {
            console.error('Error sending search query:', error);
        }
        setLoading(false);  // Stop loading
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

    useEffect(() => {
        const fetchData = async () => {
            const name = localStorage.getItem('username');
            try {
                const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/business_insert_db/?name=${name}`);
                setBusinessname(response.data.business_name);
                localStorage.setItem('Businessname', response.data.business_name);
                localStorage.setItem('isStaff', response.data.is_staff);
                setIs_staff(response.data.is_staff);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
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
        {is_staff && (
            <>
                <li><a href="https://mentor-frontend.onrender.com/edit/"><FontAwesomeIcon icon={faPenToSquare} />Edit</a></li>
                <li>
  <a href="https://mentor-frontend.onrender.com/manage/" onClick={handleManageClick}>
    <FontAwesomeIcon icon={faListCheck} />
    Manage 
    {getNewNotificationsCount() > 0 && (
      <span className="task-count">{getNewNotificationsCount()}</span>
    )}
  </a>
</li>


                <li><a href="https://mentor-frontend.onrender.com/analytics/"><FontAwesomeIcon icon={faChartPie} />Analytics</a></li>
                <li>
                    <a href="https://mentor-frontend.onrender.com/exam/"><FontAwesomeIcon icon={faSpellCheck} />Exam</a>
                    </li>
                <li>
                <li><a href="https://mentor-frontend.onrender.com/search/"><FontAwesomeIcon icon={faMagnifyingGlass} />Search</a></li>
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
            <div className="main-content justify-content-center pb-mobile-0 pb-0">
                <div className='page-part w33 mb-0'>
                    <div className='page-content'>
                    <div className='custom-card custom-card-minheight custom-card1 border-radius20'>
                        {/* <div className='custom-card-header'>
                        <h2 className='text-color1'>Welcome back {localStorage.getItem('username')}</h2>
                        </div> */}
                        <div className='card-icon text-color1'>
                        <FontAwesomeIcon icon={faUser} />
                        </div>
                            <div className='custom-card-content h-auto text-center'>
                                <p>Welcome back {localStorage.getItem('username')}</p>
                            </div>
                            </div>
                    </div>
                </div>
                <div className='page-part w33 mb-0'>
                    <div className='page-content'>
                    <div className='custom-card custom-card-minheight custom-card1 border-radius20'>
                        {/* <div className='custom-card-header'>
                        <h2 className='text-color2'>{Businessname}</h2>
                        </div> */}
                        <div className='card-icon text-color1'>
                        <FontAwesomeIcon icon={faBuildingUser} />
                        </div>
                            <div className='custom-card-content h-auto text-center'>
                                <p>{Businessname}</p>
                            </div>
                            </div>
                    </div>
                </div>
                </div>
                <div className="main-content justify-content-center">
                <div className='page-part w33 flex100'>
                    <div className='page-content'>
                    <div className='search-card'>
                            <div className='search-card-content'>
                                <div className='search-card-header pt-10 pb-40'>
                            {is_staff ? <p className='mt-0 mb-0'><span>Manager</span></p> : <p className='mt-0 mb-0'><span>Employee</span></p>}
                            </div>
                            <div className="search-input">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className='button0 button-search' onClick={sendSearchQueryToBackend}>Search</button>
                            </div>
                            <div className='search-result'>
    {loading ? <div class="loader"></div> : <p>{Answer}</p>}
</div>

                </div>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
