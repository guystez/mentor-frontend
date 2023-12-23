import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare,faUser,faBuildingUser,faListCheck,faChartPie,faCircleCheck,faSpellCheck,faHouse,faArrowRightFromBracket,faArrowDownLong,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import CircleProgressBar from './CircleProgressBar'; // Adjust the path based on your directory structure
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from "chart.js";
import Chart from 'chart.js/auto';
import Button from 'react-bootstrap/Button';
import logo from './images/logo-white.png';



function Analytics({ logout }) {
  const [all_questiones, setAll_questiones] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState(JSON.parse(localStorage.getItem('filteredQuestions')) || []);

  const [selectedMonth, setSelectedMonth] = useState('August');
  const [selectedYear, setSelectedYear] = useState('0');
  // const [tempMonth, setTempMonth] = useState('');
  // const [tempYear, setTempYear] = useState('');
  const [area, setArea] = useState('');
  const [uniqueYears, setUniqueYears] = useState(new Set());
  const [showStatistics, setShowStatistics] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [mostSearchedInfo, setMostSearchedInfo] = useState('');
  const [date, setDate] = useState('');
  const [checklists_today, setChecklists_today] = useState([]);
  const [Notcompleted_today, setNotcompleted_today] = useState([]);
  const [massages, setMassages] = useState([]);
  const [Notcompleted_yesterday, setNotcompleted_yesterday] = useState([]);
  const [animatedPercentage, setAnimatedPercentage] = useState(100);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [animatedValue, setAnimatedValue] = useState(100);  // start with 125 for 100% fill
  const [Businessname, setBusinessname] = useState(localStorage.getItem('Businessname'));
  const [is_staff, setIs_staff] = useState('');
  const currentDate = new Date();
  const [tempMonth, setTempMonth] = useState(currentDate.getMonth() + 1);
  const [tempYear, setTempYear] = useState(currentDate.getFullYear());
  




  
  useEffect(() => {
    applyFilter();
  }, [tempMonth, tempYear, all_questiones]);
  

  useEffect(() => {
    const fetchData = async () => {
        const name = localStorage.getItem('username');
        try {
            const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/business_insert_db/?name=${name}`);
            setBusinessname(response.data.business_name);
            localStorage.setItem('Businessname', response.data.business_name);
            setIs_staff(response.data.is_staff);
           
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, []);

  const getStatistics = () => {
    const stats = {};
    filteredQuestions.forEach(item => {
      stats[item.employee_name] = (stats[item.employee_name] || 0) + 1;
    });
    const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);
    return sortedStats;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  const chartData = {
    labels: getStatistics().map(item => item[0]), // employee names
    datasets: [
      {
        label: '# of Questions',
        data: getStatistics().map(item => item[1]), // questions count
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  

useEffect(() => {
  if (isInitialRender) {
      if (animatedPercentage > animatedValue) {  // Change condition here
          const timer = setTimeout(() => {
              setAnimatedPercentage(prev => prev + 1);  // Increment instead of decrement
          }, 30);
          return () => clearTimeout(timer);
      }
  } else {
      // After the initial render, just set the animatedPercentage directly to totalQuestions
      setAnimatedPercentage(totalQuestions);
  }
}, [animatedPercentage, totalQuestions, isInitialRender]);





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




  const fetchMostSearchedInfo = async () => {
    const name = localStorage.getItem('username');
    const selected_date = `${selectedYear}-${selectedMonth}-01`;
    try {
      const response = await axios.post(`https://mentor-app-h43vr.ondigitalocean.app/mentor/most_asked_question/`, { selected_date , name});
      setMostSearchedInfo(response.data.most_asked);
    } catch (error) {
      console.error('Error fetching most searched info:', error);
    }
  };






  useEffect(() => {
    const fetchData = async () => {
      const name = localStorage.getItem('username');
      try {
        const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/get_all_questiones/?name=${name}`);
        setAll_questiones(response.data);
        
        setFilteredQuestions([]);
      

        const years = new Set(response.data.map(item => new Date(item.timestamp).getFullYear()));
        setUniqueYears(years);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const applyFilter = () => {
    setSelectedMonth(tempMonth);
    setSelectedYear(tempYear);
    if (tempMonth && tempYear) {
        const filtered = all_questiones.filter(item => {
            const questionDate = new Date(item.timestamp);
            return questionDate.getMonth() + 1 === parseInt(tempMonth) && questionDate.getFullYear() === parseInt(tempYear);
        });
        setFilteredQuestions(filtered);
        localStorage.setItem('filteredQuestions', JSON.stringify(filtered));
        setTotalQuestions(filtered.length);
        
        // Indicate that the initial render is over
        setIsInitialRender(false);
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
        <div className="main-content align-stretch flex-wrap">
        <div className='page-part w50 flex50 mb-30 mb-tab-0'>
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
            <div className='page-part w50 flex50 mb-30 '>
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
            <div className='page-part w50 flex100  mb-30'>
                <div className='page-content'>
                  <div className='custom-card  custom-card-minheight custom-card1 border-left-2'>
                      <div className='custom-card-content h-auto filter-parent'>
                      <div className='custom-card-header filter1'>
                      <h2 className='text-color2'>Filter</h2>
                      </div>
       <label className='filter2'>
  <span>Month:</span>
  <select value={tempMonth} onChange={e => setTempMonth(e.target.value)}>
    <option value="">Select Month</option>
    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
      <option key={month} value={month}>{month}</option>
    ))}
  </select>
</label>

<label className='filter3'>
  <span>Year:</span>
  <select value={tempYear} onChange={e => setTempYear(e.target.value)}>
    <option value="">Select Year</option>
    {[...uniqueYears].map(year => (
      <option key={year} value={year}>{year}</option>
    ))}
  </select>
</label>
<Button
    onClick={applyFilter} 
    disabled={!tempMonth || !tempYear} 
    variant="primary" 
    size="lg" 
    className="button0 button2 button-center filter4"
>
    Go
</Button>

                      </div>
                </div>
              </div>
            </div>
            <div className='page-part w50 flex50  mb-30'>
                <div className='page-content'>
                  <div className='custom-card  custom-card-minheight custom-card1 border-left-1'>
                      <div className='custom-card-header'>
                      <h2 className='text-color1'>Questions Statistics Chart</h2>
                      </div>
                      <div className='custom-card-content'>
                      <Bar data={chartData} />
                      </div>
                </div>
              </div>
            </div>
            <div className='page-part w50 flex50  mb-30'>
                <div className='page-content'>
                  <div className='custom-card  custom-card-minheight custom-card1 border-left-2 text-center'>
                      <div className='custom-card-header'>
                      <h2 className='text-color2'>&nbsp;</h2>
                      </div>
                      <div className='custom-card-content'>
                      {selectedMonth && selectedYear && (
          <>
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <CircleProgressBar percentage={animatedPercentage} />
            </div>
            <p>In {monthNames[selectedMonth - 1]} you saved {totalQuestions} questions from your employees.</p>
            
            {/* <Button className='button0 button2 button-center' onClick={() => setShowStatistics(!showStatistics)}>Statistics</Button> */}
            {/* {showStatistics && (
              <div>
                <h3>Statistics</h3>
                <ul>
                  {getStatistics().map(([employee, count], index) => (
                    <li key={index}>
                      {employee}: {count} questions
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
          </>
        )}
                      </div>
                </div>
              </div>
            </div>
            <div className='page-part w50 flex50 mb-30'>
                <div className='page-content'>
                  <div className='custom-card  custom-card-minheight custom-card1 border-left-1'>
                      <div className='custom-card-header'>
                      <h2 className='text-color1'>Most Searched Info</h2>
                      </div>
                      <div className='custom-card-content'>
          <Button className='button0  button1 button-center' onClick={fetchMostSearchedInfo} disabled={!tempMonth || !tempYear}>Get</Button>
          {mostSearchedInfo && (
            <p>{mostSearchedInfo}</p>
          )}
                      </div>
                </div>
              </div>
            </div>
            <div className='page-part w50 flex50'>
                <div className='page-content'>
                  <div className='custom-card  custom-card-minheight custom-card1 border-left-2'>
                      <div className='custom-card-header'>
                      <h2 className='text-color2'>Questions Statistics Chart</h2>
                      </div>
                      <div className='custom-card-content'>
                      <div className='table-cover'>
        {selectedMonth && selectedYear && (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Question</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((item, index) => (
                <tr key={index}>
                  <td>{item.employee_name}</td>
                  <td>{item.question_text}</td>
                  <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </div>
                      </div>
                </div>
              </div>
            </div>
        </div>
</div>
);
        }  
export default Analytics;