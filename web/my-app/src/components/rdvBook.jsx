import React, { useState } from 'react';
// import { DtCalendar } from 'react-calendar-datetime-picker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from '../api/axios';
import Lottie from 'react-lottie';
import paymentCard from '../constants/payment.json';
import dayjs from 'dayjs';




export default function RdvBook({ doctorId }) {
    const [date, setDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);

    // const formatDate = (dateObj) => {
    //     if (!dateObj) return "";
    //     const { year, month, day, hour, minute } = dateObj;
    //     return `${year}-${month}-${day} ${hour}:${minute}`;
    // };

    const handleBookNow = async () => {
       setShowModal(true);
    };

        const handleConfirm = async () => {
            try {
                setShowModal(false);
                localStorage.setItem("doctorId",doctorId);
                const dateString = dayjs(date).toISOString()
                localStorage.setItem("date",dateString);
                await axios.put('/payment',{
                    amount : 70000,
                    doctorId : doctorId
                })
                .then(res =>{
                    console.log('the response from payment :  ',res)
                    window.location.href= res.data.result.link 
                })
                .catch(err =>{
                    console.log("payment error:  ", err)
                })
                
            } catch (error) {
                alert(error || 'An unexpected error occurred.');        
            }
        };
 
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: paymentCard,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };

    return (
        <div className='flex flex-col gap-2 items-center'>
            {error && (
                <div className="absolute top-24 left-40 flex justify-center" style={{width:'1000px'}}>
                  <div className="flex p-4 flex-row gap-[55%] text-red-300 rounded-lg bg-red-600 dark:bg-gray-800 dark:text-red-00" role="alert" style={{width:'100%'}}>
                    <span className="font-medium">Cannot book: {error}</span>
                    <button className='flex' onClick={()=>setError(false)}>close</button>
                  </div>
                </div>
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  className='text-slate-950 font-mono w-[550px] font-bold'
                  label="Rendez-Vous"
                  value={date}
                  onChange={setDate}
                />
              </DemoContainer>
            </LocalizationProvider>
            <button
                type="button"
                onClick={handleBookNow}
                className="bg-gradient-to-r ml-1 from-slate-400 via-slate-600 to-slate-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-slate-500 dark:focus:ring-slate-900 rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-bold text-gray-50 font-mono w-full"
            >
                Book Now
            </button>
            {showModal && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="flex flex-col gap-10 bg-white p-8 rounded-lg justify-center items-center" style={{width:'500px'}}>
                        <Lottie options={defaultOptions} height={400} width={400} />
                        <div className='flex gap-6'>
                            <button className='text-slate-700 hover:text-white border border-slate-700 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-slate-500 dark:text-slate-500 dark:hover:text-white dark:hover:bg-slate-500 dark:focus:ring-slate-800' onClick={handleConfirm}>Pay to confirm</button>
                            <button onClick={() => setShowModal(false)} type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


// function convertDateStringToDateObject(dateString) {
//     const parsedDate = new Date(dateString);
  
//     const year = parsedDate.getFullYear();
//     const month = parsedDate.getMonth() + 1; 
//     const day = parsedDate.getDate();
//     const hour = parsedDate.getHours();
//     const minute = parsedDate.getMinutes();
  
//     return { year, month, day, hour, minute };
//   }