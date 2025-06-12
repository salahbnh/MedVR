import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {useResponsive} from '../hooks/useResponsive'
import axios from '../api/axios';

const LOGIN_URL = '/user/login';

const Login = () => {

    const isMobile =useResponsive();

 
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            
            const accessToken = response?.data?.accessToken;
            
            console.log('Response data:', response.data);

            const user = response?.data?.user;
            console.log('User data:', user);
            


            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("user",JSON.stringify(user));

            console.log(accessToken);
                
            setEmail('');
            setPassword('');
            
            navigate('/layout');
            
            navigate(from, { replace: true });

        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            } else if (err.response?.status === 400) {
                console.log('Missing Username or Password');
            } else if (err.response?.status === 401) {
                console.log('Unauthorized');
            } else {
                console.log('Login Failed');
            }
        }
    }
    const handleResetPwd = async () =>{
        await axios.post("/user/resetPwd" , {
            email:email,
        })
        .then(rsp =>{
            console.log(rsp)
        })
        .catch(err =>{
            console.log(err);
        })
    }

    return (
        <div
          style={{
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center',
            width:'80%',
            backgroundColor:'rgb(211, 248, 250,0.5)',
            margin:'50px'
          }}
        >
            <h1 className='text-4xl font-mono font-bold text-blue-950 py-12'>Login With Your Email</h1>
            <div 
            id="authentication-modal" 
            aria-hidden="true" 
            style={{display:'flex', width:`${isMobile? '300px': '600px'}`, justifyContent:'center', alignItems:'center'}}
            >
                <div className="w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700"> 
                        <div className="p-4 md:p-5">
                            <form 
                            className="space-y-4"
                            onSubmit={handleSubmit}
                            >
                                <div>
                                    <p name="email" className="block mb-2 text-sm font-medium font-mono text-gray-900 dark:text-white">Your email</p>
                                    <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    ref={userRef}
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    className="bg-gray-50 border font-mono border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                                    placeholder="name@company.com" 
                                    required/>
                                </div>
                                <div>
                                    <p name="password" className="block mb-2 font-mono text-sm font-medium text-gray-900 dark:text-white">Your password</p>
                                    <input 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    className="bg-gray-50 border font-mono  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
                                    required/>
                                </div>
                                <button type="submit"  className="w-full font-mono text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                                <div className="text-sm font-monox font-medium text-gray-500 dark:text-gray-300">
                                    Not registered? <Link to="/signUp" className="text-blue-700 font-mono hover:underline dark:text-blue-500">Create account</Link>
                                </div>
                            </form>
                                <div className="flex justify-between">
                                    <button onClick={handleResetPwd} className="text-sm font-mono text-blue-700 hover:underline dark:text-blue-500">Lost Password?</button>
                                </div>
                        </div>
                    </div>
                </div>
            </div> 
        </div>
            )
        }

export default Login