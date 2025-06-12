import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [validPassword, setValidPassword] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

  const navigate = useNavigate(); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    setToken(resetToken);
    console.log(token)
  }, []);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(newPassword));
        setValidMatch(newPassword === confirmPassword);
    }, [newPassword, confirmPassword])
  
    useEffect(() => {
        setError('');
    }, [newPassword, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = PWD_REGEX.test(newPassword);
    if (!v1) {
        setError("Invalid Entry");
        return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
        const response = await axios.post("/user/modifPwd", {
          email: email,
          resetToken: token,
          password: newPassword 
        });
        if (response.status === 200) {
          navigate('/login');
        }
      } catch (error) {
        console.log(error.response.data); 
        setError('Request failed: ' + error.response.data.message); 
      }

  };

  return (
    <div>
      <h1 className='text-6xl  font-mono font-extrabold text-slate-900 py-3'> Reset Your Password</h1>
      <form onSubmit={handleSubmit} className='border-slate-900 pt-8 flex flex-col gap-2'>
        {
            !validPassword && (newPassword !=='') &&
            <p id="pwdnote" className="text-red-600">
                8 to 24 characters.<br />
                Must include uppercase and lowercase letters, a number and a special character.<br />
                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </p>
        }
        {/* {error && <p className="error text-red-600 font-mono font-bold py-2">{error}</p>} */}
        {success && <p className="success text-green-600 font-mono font-bold py-2">{success}</p>}
        <label htmlFor="eamil">email</label>
        <input 
            type="email" 
            name="email" 
            id="email" 
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="bg-gray-50 border font-mono border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
            placeholder="name@company.com" 
            required
        />
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          placeholder="••••••••"
          className="bg-gray-50 border font-mono border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          placeholder="••••••••"
          className="bg-gray-50 border font-mono border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button 
            type="submit"
            className="w-full font-mono text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
