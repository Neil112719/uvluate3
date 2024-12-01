import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpOverlay, setShowOtpOverlay] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // Cooldown in seconds
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/login.php',
        {
          id_number: idNumber,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Include credentials (cookies) with the request
        }
      );

      if (response.data.status === 'otp_required') {
        setShowOtpOverlay(true);
        setResendCooldown(60); // Set initial cooldown time (in seconds)
        alert('OTP required. Please check your email.');
      } else if (response.data.status === 'invalid_credentials') {
        alert('Invalid ID number or password. Please try again.');
      } else if (response.data.status === 'user_not_found') {
        alert('User not found. Please check your ID number.');
      } else if (response.data.status === 'force_password_change') {
        alert('You need to change your password on first login.');
        navigate('/change-password');
      } else if (response.data.status === 'force_logout') {
        alert(response.data.message);
      } else {
        // Handle successful login without OTP requirement
        redirectToUserPage(response.data.usertype);
      }
    } catch (error) {
      alert('Login error. Please try again later.');
      console.error('Login error:', error);
    }
  };

  // OTP submission
  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/verify_otp.php',
        {
          id_number: idNumber,
          otp: otp,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // If cookies are being used for session
        }
      );

      console.log('OTP Verification Response:', response); // Log the entire response

      if (response.data.success) {
        alert('OTP verification successful. You are logged in!');

        // Check if username, usertype, and id_number are available before storing
        if (
          response.data.usertype !== undefined &&
          response.data.username !== undefined &&
          response.data.id_number !== undefined
        ) {
          // Save user information in localStorage
          localStorage.setItem('usertype', response.data.usertype);
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('id_number', response.data.id_number); // Store id_number in localStorage

          // Redirect user based on usertype
          redirectToUserPage(response.data.usertype);
        } else {
          alert('Missing user information in server response.');
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('OTP verification error. Please try again later.');
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) {
      alert(`Please wait ${resendCooldown} seconds before resending the OTP.`);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/resend_otp.php',
        {
          id_number: idNumber,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert('OTP resent successfully.');
        setResendCooldown(60);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('OTP resend error. Please try again later.');
      console.error('OTP resend error:', error);
    }
  };

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    } else if (resendCooldown === 0 && timer) {
      clearInterval(timer);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [resendCooldown]);

  const redirectToUserPage = (usertype) => {
    switch (usertype) {
      case 1:
        navigate('/admin');
        break;
      case 2:
        navigate('/dean');
        break;
      case 3:
        navigate('/program-coordinator');
        break;
      case 4:
        navigate('/faculty');
        break;
      case 5:
        navigate('/student');
        break;
      default:
        alert('Unknown user type. Please contact support.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="ID Number"
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>

      {showOtpOverlay && (
        <div className="otp-overlay">
          <h3>Enter OTP</h3>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleOtpSubmit}>Submit OTP</button>
          <button onClick={handleResendOtp} disabled={resendCooldown > 0}>
            {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
