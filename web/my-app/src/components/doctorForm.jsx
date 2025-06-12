import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX =  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const REGISTER_URL = '/user/register/doctor';

export default function DoctorForm() {
    const errRef = useRef();
    const navigate = useNavigate();


    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);

    const [matchPassword, setMatchPassword] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [address, setAddress] = useState('');
    const [phoneNbr, setPhoneNbr] = useState('');

    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
  
    // For doctor-specific fields
    const [specialization, setSpecialization] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState(0); // Default value 0
    
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatch(password ===matchPassword);
    }, [password, matchPassword])
  
    useEffect(() => {
        setErrMsg('');
    }, [email, password, matchPassword])
    
    useEffect(()=>{
        if(success){
          navigate('/login');
        }
      },[success, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = PWD_REGEX.test(password);
        const v2 = EMAIL_REGEX.test(email);
        if (!v1 || !validMatch || !validPassword || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            console.log(
                JSON.stringify({ 
                    fName,
                    lName, 
                    email, 
                    password, 
                    address,
                    phoneNbr, 
                    specialization,
                    yearsOfExperience
                }),
            )
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ 
                    fName,
                    lName, 
                    email, 
                    password, 
                    address,
                    phoneNbr, 
                    specialization,
                    yearsOfExperience
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));

            setSuccess(true);
            
            setFName('');
            setLName('');
            setEmail('');
            setPassword('');
            setAddress('');
            setPhoneNbr('');
            setSpecialization('');
            setYearsOfExperience('');
            
            if(success)
                navigate('/login');

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
      <div style={{
          display:'flex',
          flexDirection:'column',
          justifyContent:'center'
      }}>
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
          <p className="text-5xl text-green-800 font-bold py-8">Register as Doctor</p>
          <div style={{
              padding:'3px'
          }}>
              <form onSubmit={handleSubmit}>
                  <div className="grid gap-6 mb-6 md:grid-cols-2">
                      <div>
                          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First name</p>
                          <input 
                            type="text" 
                            name="first_name" 
                            onChange={(e)=>setFName(e.target.value)}
                            value={fName}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="First Name" 
                            required 
                            />
                      </div>
                      <div>
                          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last name</p>
                          <input 
                            type="text"
                            name="last_name" 
                            onChange={(e)=>setLName(e.target.value)}
                            value={lName}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Last Name" 
                            required />
                      </div>
                      <div>
                          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</p>
                          <input 
                            type="text" 
                            name="address" 
                            onChange={(e)=>setAddress(e.target.value)}
                            value={address}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Address" 
                            required />
                      </div>  
                      <div>
                          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</p>
                          <input 
                            type="tel" 
                            name="phoneN_nbr" 
                            onChange={(e)=>setPhoneNbr(e.target.value)}
                            value={phoneNbr}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="22222222" 
                            pattern="[0-9]{8}" 
                            required 
                            />
                      </div>
                      <div>
                          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Specialization</p>
                          <input 
                            type="text" 
                            name="specialization" 
                            onChange={(e)=>setSpecialization(e.target.value)}
                            value={specialization}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="specialization" 
                            required 
                        />
                      </div>
                      <div>
                          <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Years of experience</p>
                          <input 
                            type="number" 
                            name="years_of_experience" 
                            onChange={(e)=>setYearsOfExperience(e.target.value)}
                            value={yearsOfExperience}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="00" 
                            required />
                      </div>
                  </div>
                  <div className="mb-6">
                      <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</p>
                      <input 
                        type="email" 
                        name="email" 
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="example@example.tn" 
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        required 
                        />
                        { !validEmail && (email !=='') &&
                         <p id="confirmnote" className="text-red-600">
                            Please enter a valid email
                         </p>
                        }
                  </div> 
                  <div className="mb-6">
                      <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</p>
                      <input 
                        type="password"
                        name="password" 
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="•••••••••" 
                        aria-invalid={validPassword ? "false" : "true"}
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                        aria-describedby="pwdnote"
                        required />
                        {
                            !validPassword && (password !=='') &&
                            <p id="pwdnote" className="text-red-600">
                                8 to 24 characters.<br />
                                Must include uppercase and lowercase letters, a number and a special character.<br />
                                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                            </p>
                        }
                  </div> 
                  <div className="mb-6">
                      <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</p>
                      <input 
                        type="password"
                        name="confirm_password" 
                        onChange={(e)=>setMatchPassword(e.target.value)}
                        value={matchPassword}
                        aria-invalid={validMatch ? "false" : "true"}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="•••••••••"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)} 
                        required />
                        {  !validMatch && (matchFocus !=='') &&
                            <p id="confirmnote"  className="text-red-600">
                               Must match the first password input field.
                            </p>
                        }
                  </div> 
                  <button 
                    type="submit" 
                    disabled={!validEmail || !validPassword || !validMatch ? true : false}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Submit
                  </button>
              </form>
          </div>
      </div>
    )
  }
  
  
