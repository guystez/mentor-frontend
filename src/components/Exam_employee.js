import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck,faPenToSquare,faMagnifyingGlass,faRectangleList,faUser,faSpellCheck,faBuildingUser,faListCheck,faChartPie,faCircleCheck,faHouse,faArrowRightFromBracket,faArrowDownLong,faMessage } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import logo from './images/logo-white.png';



function Exam_employee({ logout }) {
    
  

    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [all_businesses, setAllBusinesses] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [reloadBusinesses, setReloadBusinesses] = useState(false);
    const [full_exam, setFull_exam] = useState([]);
    const [exam, setExam] = useState('');
    const [userAnswers, setUserAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    // Handle change in selected answer
    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answerId,
        });
    };

    const handleSubmitAnswers = async (examId) => {
      const name = localStorage.getItem('username');
      const payload = {
        examId: examId,  // Use the passed examId
        answers: selectedAnswers,
        name: name
    };
console.log(payload,'payload');
      try {
          // Adjust this URL to your server's endpoint
          const response = await axios.post('https://mentor-app-h43vr.ondigitalocean.app/mentor/post_exam_for_employee/', payload);
          console.log('Submission successful:', response.data);
          setSubmissionResult(response.data);
          console.log(response.data,'answers');
          alert('Answers submitted successfully');
          // You might want to navigate the user or refresh the exam data here
      } catch (error) {
          console.error('Error submitting answers:', error);
          alert('Error submitting answers');
      }
  };




    const fetchData = async () => {
        const name = localStorage.getItem('username');  // Get username from localStorage
        // console.log("Fetching exam with ID:", exam);
        try {
          const response = await axios.get(`https://mentor-app-h43vr.ondigitalocean.app/mentor/get_exam_for_employee/?name=${name}`);
          console.log("Full response:", response.data);
          setFull_exam(response.data.exams);
          
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []); // Re-fetch when area changes
    


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

 

  const answerClass = (questionId, answerId) => {
    if (submissionResult) {
        // If the answer is wrong (present in wrong_answers), mark it as incorrect
        if (submissionResult.wrong_answers[questionId] === answerId) {
            return "incorrect";
        }
        // If the answer is selected by the user and not in wrong_answers, mark it as correct
        if (selectedAnswers[questionId] === answerId && !submissionResult.wrong_answers.hasOwnProperty(questionId)) {
            return "correct";
        }
    }
    return "";
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
        <div className="main-content">
                {/* <div className='page-part w33 pb-mobile-30'></div> */}
                {/* <div className='page-part w33'> */}
                    <div className='page-content'>
                        <div className='custom-card custom-card-minheight border-left-2 '>
                            <div className='custom-card-header'>
                                <h2 className="text-color2">Exam</h2>

                                {/* Dropdown for businesses */}
                                
                            </div>

                            {/* <div className='custom-card-content'> */}
                            {full_exam && full_exam.map((exam, examIndex) => (
    <div key={examIndex}>
        <h1>Exam: {exam.exam_name}</h1>
        <ul>
    {/* Rest of your JSX code */}
{exam.questions.map((question, questionIndex) => (
    <li key={questionIndex}>
       <b> <p>Question: {question.question_text}</p></b>
        <ul>
            {question.answers.map((answer, answerIndex) => (
                <li key={answerIndex} className={`radio-answer ${answerClass(question.question_id, answer.answer_id)}`}>
                    <span>{answer.answer_text}</span>
                    <input
                        type="radio"
                        name={`question-${question.question_id}`}
                        value={answer.answer_id}
                        onChange={() => handleAnswerChange(question.question_id, answer.answer_id)}
                        checked={selectedAnswers[question.question_id] === answer.answer_id}
                        disabled={!!submissionResult}
                    />
                </li>
            ))}
        </ul>
    </li>
))}
{/* Rest of your JSX code */}

</ul>




        {!submissionResult && <button className='button0 button1 button-center' onClick={() => handleSubmitAnswers(exam.exam_id)}>Send</button>}
        {submissionResult && <div><b>Your score: {submissionResult.score_percentage}%</b></div>}
    </div>
))}


</div>

                        </div>
                    </div>
               </div>
            // </div>
        // </div>
);
}
export default Exam_employee;