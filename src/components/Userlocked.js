import React from 'react';
import axios from 'axios';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

class PaymentLockMessage extends React.Component {
    logout = () => {
        axios.get("http://localhost:8000/logout/")
            .then(response => {
                // Handle the response from the server if needed
            })
            .catch(error => {
                // Handle error if the request failed
                console.error('Logout failed:', error);
            });

        localStorage.removeItem('session');
        localStorage.removeItem('username');

        // Use window.location to force a page refresh and redirect to the login page
        window.location.href = '/login'; // This will redirect to the login page
    }

    render() {
        return (
            <div className="payment-lock-message">
                User is locked. Contact our support team at 'mentori.office@gmail.com'
                <div>
                    <FontAwesomeIcon icon={faLock} size="xl" />
                </div>
                {/* Adding the logout button */}
                <button onClick={this.logout} className="button0 button3">
                Go Back
                </button>
            </div>
        );
    }
}

export default PaymentLockMessage;
