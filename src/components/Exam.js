import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare,faListCheck,faChartPie,faCircleCheck,faHouse,faArrowRightFromBracket,faSpellCheck,faArrowDownLong,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import logo from './images/logo-white.png';

function Exam({ logout }) {
  const [text, setText] = useState('');
  const [exam, setExam] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [full_exam, setFull_exam] = useState([]);
  const [dataofbusiness, setDataofbusiness] = useState([]);
  const [dataUpdate, setDataUpdate] = useState('');
  const [date, setDate] = useState('');
  const [checklists_today, setChecklists_today] = useState([]);
  const [Notcompleted_today, setNotcompleted_today] = useState([]);
  const [massages, setMassages] = useState([]);
  const [Notcompleted_yesterday, setNotcompleted_yesterday] = useState([]);
  const [employees, setemployees] = useState([]);
  const [All_exam_name, setAll_exam_name] = useState([]);
  const [useTextInput, setUseTextInput] = useState(false);
  const [highlightInput, setHighlightInput] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [textAreaContents, setTextAreaContents] = useState({});
  const [question, setQuestion] = useState('');
  const [correctAnswerId, setCorrectAnswerId] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [examName, setExamName] = useState('');
  const [examName2, setExamName2] = useState('');
  const [scoredata, setScoredata] = useState([]); // This should be populated with actual exam names from your database
  const [useTextInputForExam, setUseTextInputForExam] = useState(false);
  const [answers, setAnswers] = useState([
    { id: 1, text: '' },
    { id: 2, text: '' },
    { id: 3, text: '' },
    { id: 4, text: '' }
  ]);




  const getExamScores = async (examId) => {
    console.log(examId,'iddddddd');
    try {
      const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/get_scores/?examId=${examId}`);
      console.log("Exam Scores:", response.data);
      setScoredata(response.data)
    } catch (error) {
      console.error('Error fetching exam scores:', error);
    }
  };

  // useEffect to call getExamScores when the exam state changes
  useEffect(() => {
    if (exam) {
      getExamScores(exam);
    }
  }, [exam]); // Dependency array with 'exam' to trigger the effect when 'exam' changes


  

  const deleteExam = async (examId) => {
    if (!examId) {
      alert("Please select an exam to delete.");
      return;
    }
    try {
      await axios.delete(`https://mentor-app-h43vr.ondigitalocean.app/mentor/delete_exam/${examId}/`);
      alert("Exam deleted successfully");
      get_exam_name();
      setFull_exam('')
      
      
      // Refresh the list of exams
      // Implement any additional UI update logic here
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
};



  const publishExam = async (examId) => {
    if (!examId) {
      alert("Please select an exam to publish.");
      return;
    }
    try {
      await axios.post(`https://mentor-app-h43vr.ondigitalocean.app/mentor/publish_exam/${examId}/`);
      alert("Exam published successfully");
      fetchData();
    } catch (error) {
      console.error('Error publishing exam:', error);
    }
};

  

  const handleDeleteQuestion = async (questionId) => {
    console.log(questionId,'gggggggggggggg');
    try {
      const name = localStorage.getItem('username');
      await axios.delete(`https://mentor-app-h43vr.ondigitalocean.app/mentor/delete_question/${questionId}/`);

      alert("Question deleted successfully");
  
      // Update the UI by refetching or manually updating state
      fetchData(); // If you choose to refetch the exam data
      // Or update the state manually (see next step)
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };
  

const get_exam_name = async () => {
    const name = localStorage.getItem('username');
    try {
      const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/get_all_exam_of_business/?name=${name}`);
      setAll_exam_name(response.data.all_exam_names);
      console.log(response.data.all_exam_names, 'thisssssssss');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Call get_exam_name when the component mounts
  useEffect(() => {
    get_exam_name();
  }, []);

  const toggleExamInput = () => {
    setUseTextInputForExam(!useTextInputForExam);
    setExamName(''); // Reset the exam name when toggling
    
  };

  const handleAnswerChange = (id, newText) => {
    setAnswers(answers.map(answer => 
      answer.id === id ? { ...answer, text: newText } : answer
    ));
  };




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

  

  const check_completed_yesterday = async () => {
    const name = localStorage.getItem('username');  // Get username from localStorage
    try {
      const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/check_completed_yesterday/?name=${name}&area=${exam}&date=${date}`);
     
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
      const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/check_completed/?name=${name}&area=${exam}&date=${date}`);
     
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
    console.log("Fetching exam with ID:", exam);
    try {
      const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/get_exam/?name=${name}&exam=${exam}`);
      console.log("Full response:", response);
      setFull_exam(response.data)
    //   console.log(response.data.exam_data,'fffffff');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [exam]); // Re-fetch when area changes

  
// Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    get_exam_name();
    get_exam_name(); // Call get_exam_name when toggling the input
  
    if (!correctAnswerId) {
        alert("Please select the correct answer.");
        return;
    }

    let selectedExamName;

    if (useTextInputForExam) {
        selectedExamName = examName;
    } else {
        const selectedExam = All_exam_name.find(option => option.id.toString() === exam);
        selectedExamName = selectedExam ? selectedExam.name : '';
    }

    const payload = {
        examName: selectedExamName,
        question: questionText,
        answers: answers,
        correctAnswerId: correctAnswerId,
    };

    const name = localStorage.getItem('username');

    const requestData = {
        ...payload,
        name: name
    };

    try {
        await axios.post('https://mentor-app-h43vr.ondigitalocean.app/mentor/create_exam/', requestData);
        // alert("Question created successfully");
        console.log(selectedExamName, 'nameeeeeeee');
        fetchData();
    } catch (error) {
        console.error('Error submitting question:', error);
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
                  <h2 className='text-color1'>Create Exam</h2>
                  {/* <h2>&nbsp;</h2> */}
                  </div>
                  <div className='custom-card-content h340'>
                  <form onSubmit={handleSubmit}>
                  <div>
        <label>Select or Create Exam: </label>
        {useTextInputForExam ? (
          <input 
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            style={{ marginRight: '10px' }}
          />
        ) : (
            <label>
           
           <select value={exam} onChange={(e) => setExam(e.target.value)}>
    <option value="">None</option>
    {All_exam_name.map((examOption) => (
        <option key={examOption.id} value={examOption.id}>{examOption.name}</option>
    ))}
</select>

          </label>
        )}
        <button 
          type="button"
          className='button0 button1'
          onClick={toggleExamInput}
        >
          {useTextInputForExam ? 'Select Exam' : 'Create New Exam'}
        </button>
      </div>
  <div>
    <label>Question: </label>
    <input type="text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
  </div>
  {answers.map((answer, index) => (
    <div key={answer.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <label style={{ marginRight: '10px' }}>Answer {index + 1}: </label>
      <input 
        type="text" 
        value={answer.text} 
        onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
        style={{ marginRight: '10px' }} 
      />
      <input 
        type="radio" 
        name="correctAnswer" 
        onChange={() => setCorrectAnswerId(answer.id)} 
        checked={correctAnswerId === answer.id}
      />
      <label>Correct</label>
    </div>
  ))}
  <button type="submit" className='button0 button1 button-center'>Add Question</button>
</form>

      </div>
      </div>
      </div>
      </div>





      <div className='page-part w50 mb-50'>
                <div className='page-content'>
                <div className='custom-card  custom-card-minheight border-left-2'>
                <div className='custom-card-header'>
                <h2 className='text-color2'>Edit Exam</h2>
                  </div>
      <div className='custom-card-content h340'>
      <label>
  Select Exam: 
  <select value={exam} onChange={(e) => {
    setExam(e.target.value);
    getExamScores(e.target.value);
}}>
    <option value="">None</option>
    {All_exam_name.map((examOption, index) => (
        <option key={index} value={examOption.id}>{examOption.name}</option>
    ))}
</select>


  
</label>
<button 
  className='button0 button1 button-margin-right' 
  onClick={() => publishExam(exam)}
  disabled={!exam}
>
  Publish Exam
</button>
<button 
  className='button0 button1' 
  onClick={() => deleteExam(exam)}
  disabled={!exam}
>
  Delete Exam
</button>



<div>
  {full_exam && (
    <div>
      <h1>{full_exam.exam_name}</h1>
      <ul>
      {full_exam.questions && full_exam.questions.map((question, index) => (
  <li key={index}>
    <p>Question: {question.question_text}</p>
    <ul>
      {question.answers.map((answer, idx) => (
        <li key={idx}>
          {answer.answer_text} {answer.is_correct ? "(Correct)" : ""}
        </li>
      ))}
    </ul>
    <button className='button0 button2' onClick={() => handleDeleteQuestion(question.question_id)}>Delete Question</button>

  </li>
))}

      </ul>
    </div>
  )}
</div>

    </div>
    </div>
    </div>
    </div>






    {/* <div className='page-part w100 mb-50'> */}
    <div className='page-content'>
        <div className='custom-card custom-card-minheight border-left-2'>
            <div className='custom-card-header'>
                <h2 className='text-color2'>Exam Scores</h2>
            </div>
            <div className='custom-card-content h340'>
                <label>
                    Select Exam: 
                    <select value={exam} onChange={(e) => {
                        setExam(e.target.value);
                        getExamScores(e.target.value);
                    }}>
                        <option value="">None</option>
                        {All_exam_name.map((examOption, index) => (
                            <option key={index} value={examOption.id}>{examOption.name}</option>
                        ))}
                    </select>
                </label>
                <h3>Completed: {scoredata?.completion_ratio}</h3>
                {full_exam?.questions && scoredata?.exam_scores && (
    <div>
        <h1>{full_exam.exam_name}</h1>
        <table>
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Score</th>
                    <th>Question</th>
                    <th>Employee's Answers</th>
                </tr>
            </thead>
            <tbody>
                {/* {console.log(full_exam.questions,'full_exam')} */}
                {scoredata.exam_scores.map((userScore, userIndex) => (
                      
                    full_exam.questions.map((question, questionIndex) => {
                       
                    
                        // Initialize a variable to check if the user has a wrong answer for this question
                        let isUserWrongAnswer = false;

                        // Iterate over wrong answers and check if any match the current question
                        userScore.wrong_answers.forEach(wrongAnswer => {
                                isUserWrongAnswer = true;
                            
                        });

                        return (
                            <tr key={`${userIndex}-${questionIndex}`}>
                                {questionIndex === 0 && (
                                    <>
                                        <td rowSpan={full_exam.questions.length}>{userScore.user}</td>
                                        <td rowSpan={full_exam.questions.length}>{userScore.score}%</td>
                                    </>
                                )}
                                <td>{question.question_text}</td>
                                <td>
                                    <ul>
                                        {question.answers.map((answer, answerIndex) => {
                                            // Check if the current answer is the user's wrong answer
                                            const colorStyle = isUserWrongAnswer && userScore.wrong_answers.some(wa => wa.user_wrong_answer_id === answer.answer_id) ? 'red' : (answer.is_correct ? 'green' : 'black');

                                            return (
                                                <li key={answerIndex} style={{ color: colorStyle }}>
                                                    {answer.answer_text}
                                                    {answer.is_correct ? " (Correct)" : ""}
                                                    {isUserWrongAnswer && userScore.wrong_answers.some(wa => wa.user_wrong_answer_id === answer.answer_id) ? " (User's Choice)" : ""}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </td>
                            </tr>
                        );
                    })
                ))}
            </tbody>
        </table>
    </div>
)}


            </div>
        </div>
    </div>
</div>






    
{/* </div> */}
    </div>
  );
}

export default Exam;
