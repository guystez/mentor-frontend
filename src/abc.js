import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function Inbox({ logout }) {
  const [text, setText] = useState('');
  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [checklists, setChecklists] = useState([]);
  const [checklists_today, setChecklists_today] = useState([]);
  const [Notcompleted_today, setNotcompleted_today] = useState([]);
  const [Notcompleted_yesterday, setNotcompleted_yesterday] = useState([]);
  const [massages, setMassages] = useState([]);
  const [animate, setAnimate] = useState(false);


  useEffect(() => {
    setAnimate(true);
}, []);

  useEffect(() => {
      const name = localStorage.getItem('username');
      if (name) {
          axios.get('http://localhost:8000/mentor/get_massages/', { params: { name } })
              .then(response => {
                console.log("Response data:", response.data); 
                  setMassages(response.data.massages);
                 
              })
              .catch(error => {
                  console.error("Error fetching massages:", error);
              });
      }
  }, []);

  const handleDelete = (id) => {
    const name = localStorage.getItem('username');
    axios.delete(`http://localhost:8000/mentor/delete_massage/${id}/?name=${name}`)
        .then(() => {
            setMassages(prevMassages => prevMassages.filter(massage => massage.id !== id));
        })
        .catch(error => {
            console.error("Error deleting massage:", error);
        });
};




  
  const check_completed_yesterday = async () => {
    const name = localStorage.getItem('username');  // Get username from localStorage
    try {
      const response = await axios.get(`http://localhost:8000/mentor/check_completed_yesterday/?name=${name}&area=${area}&date=${date}`);
      console.log('Returned data:', response.data);
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
      const response = await axios.get(`http://localhost:8000/mentor/check_completed/?name=${name}&area=${area}&date=${date}`);
      console.log('Returned data:', response.data);
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
      console.log('Returned data:', response.data);
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
      console.log('Returned data:', response.data);
      setChecklists(response.data.checklists);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Fetch data once when the component mounts

  return (
    <div  className="custom-page">
        <div className='sideBar'>
        </div>
        <div className='page-content'>
        </div>
        <aside className="sidebar">
            <nav>
            <h2 className='text-title'>Mentor.AI</h2>
                <ul>
                    <li>
                        <a href="https://mentor-frontend.onrender.com/edit/">Edit</a>
                    </li>
                    <li>
                        <a href="https://mentor-frontend.onrender.com/manage/">Manage</a>
                    </li>
                    <li>
                        <a href="https://mentor-frontend.onrender.com/analytics/">Analytics</a>
                    </li>
                    <li>
                        <a href="https://mentor-frontend.onrender.com/">Home</a>
                    </li>
                    <li>
                        <NavLink to="/" onClick={logout}>
                            Logout
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
        <div className="main-content">
<div className="left-column" style={{ flex: 1, paddingRight: '20px' }}>
    
    <div className='heading2'>logged in as: {localStorage.getItem('username')}</div>
    
    
    <div className="right-column" style={{ flex: 1, paddingLeft: '200px' }}>
        
        
        <div className='card2'>
            <div style={{ textAlign: 'center'}}>
                <h2>Uncompleted tasks by filter</h2>
                <label>
                    Select Area:
                    <select value={area} onChange={(e) => setArea(e.target.value)}>
                        <option value="none">none</option>
                        <option value="Waiters-opening">Waiters-opening</option>
                        <option value="Waiters-noon">Waiters-noon</option>
                        <option value="Waiters-closing">Waiters-closing</option>
                        <option value="Kitchen-opening">Kitchen-opening</option>
                        <option value="Kitchen-noon">Kitchen-noon</option>
                        <option value="Kitchen-closing">Kitchen-closing</option>
                        <option value="Manager-opening">Manager-opening</option>
                        <option value="Manager-noon">Manager-noon</option>
                        <option value="Manager-closing">Manager-closing</option>
                    </select>
                </label>
                <label>
                    Select Date:
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>
                <button onClick={fetchData}>Filter Tasks</button>
            </div>
            <div style={{ display: 'inline-block' }}>
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

        <div className={`arrow-down ${animate ? 'arrow-animate' : ''}`}></div>

        <div className='employee-massages-card'>
            <h2 className="flexContainer">Employee massages</h2>
            {massages.map((massage, index) => (
                <div key={index} className="flexContainer">
                    <p>{massage.massage}</p>
                    <p>{massage.employee_name}</p>
                    <button onClick={() => handleDelete(massage.id)}>Delete</button>
                </div>
            ))}
        </div>

        <div className={`card2 ${animate ? 'slide-down-animation' : ''}`}>
            <h2>Uncompleted tasks today</h2>
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
                    {checklists_today.map((checklist, index) => (
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

<div className="right-column" style={{ flex: 1, paddingLeft: '20px' }}>
    <div className='card'>
        <h2>Checklists Uncompleted:<br></br> Today</h2>
        <ul>
            {Notcompleted_today.map((item, index) => (
                item.not_completed_today && (
                    <li key={index}>
                        Checklist type: {item.area}
                    </li>
                )
            ))}
        </ul>
    </div>
    <div className={`arrow2-down ${animate ? 'arrow2-animate' : ''}`}></div>
    <div className={`card ${animate ? 'slide-down-animation' : ''}`}>
        <h2>Yesterday</h2>
        <ul>
            {Notcompleted_yesterday.map((item, index) => (
                item.not_completed_yesterday && (
                    <li key={index}>
                        Checklist type: {item.area}
                    </li>
                )
            ))}
        </ul>
    </div>
</div>

</div>
</div>
);
}
export default Inbox;
