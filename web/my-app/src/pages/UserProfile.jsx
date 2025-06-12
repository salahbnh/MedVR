import React, { useEffect } from 'react'
import {Outlet, useNavigate}from 'react-router-dom'
import Unauthorized from './Unauthorized';

export default function UserProfile() {

    const navigate = useNavigate();

    const userString = localStorage.getItem("user");
    const user = JSON.parse(userString);
    const role = user.role;
    
    useEffect(()=>{
        if(role === 'doctor'){
            navigate('/userProfile/doctorProfile')
        }
        else if(role === 'patient'){
            navigate('/userProfile/patientProfile')
        }
        else{
          navigate('/unauthorized')
        }
    },[role, navigate])

  return (
    <div className='p-10'>
      <Outlet/>
    </div>
  )
}
