import React, { useState, useEffect } from 'react'
import axios from '../api/axios';

export default function DoctorRdvCard({id, rdvDate}) {

    const [doctor, setDoctor] =useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get(`/user/users/${id}`);
              console.log(response.data);
              setDoctor(response.data.user);
              console.log(response.data.user)
            } catch (error) {
              console.error('Error fetching patients:', error);
            }
          }
          fetchData(); 
        },[id])

  return (
    <>
        {doctor ? (
            <div style={{
                display:'grid',
                gridTemplateColumns: '25% 25% 25% 25%',
                border:'2px solid black',
                width:'80%',
                marginLeft:'100px'
            }}>
                <div className='flex flex-col gap-3 p-3' style={{border:'2px silid red'}}>
                    <p className='font-mono font-bold text-blue-950'> Dr {setDoctor.fName} {setDoctor.lName} </p>   
                </div>
                <div className='flex flex-col gap-3 p-3' style={{border:'2px silid red'}}>
                    <p className='font-mono font-bold text-blue-950'> {rdvDate}</p>   
                </div>
            </div>
        )  :(
            <h1 className='font-mono font-bold text-blue-950'> No rendez-vous for this week</h1>
        )
        }
    </>
    
  )
}
