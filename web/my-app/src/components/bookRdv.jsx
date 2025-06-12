import React, {useState, useEffect} from 'react';
import axios from '../api/axios';
import Consultation from '../pages/Consultation';



export default function BookRdv({doctorId}) {
  const accessToken = localStorage.getItem("accessToken");
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString)

  const [appointments, setAppointments] = useState([]);
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);

  const options = { timeZone: 'Africa/Tunis' };
  const currentDate = new Date().toLocaleString('en-US', options);


  const workingHours = [
    { start: 9, end: 14 }, 
     { start: 9, end: 21 }, 
     { start: 9, end: 21 }, 
     { start: 9, end: 21 }, 
     { start: 9, end: 21 }, 
     { start: 9, end: 21 }, 
     { start: 9, end: 17 }, 
  ];

  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + i );

    const formattedDate = date.toISOString().slice(0, 10);

    const availableSlots = [];
    const currentDayOfWeek = date.getDay();
    const { start, end } = workingHours[currentDayOfWeek];
    for (let hour = start; hour < end; hour++) {
      const slotText = `${hour}:00 to ${hour + 1}:00`;
      availableSlots.push(
        <button 
          type="button" 
          className="focus:outline-none text-white font-mono bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
          key={slotText} 
          onClick={() => handleBookAppointment(date, hour, formattedDate)}
        >
          {slotText}
        </button>
      );
    }

    days.push({
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDayOfWeek],
      date: formattedDate,
      availableSlots: availableSlots,
    });
  }

  useEffect(() => {
    const doctor_id = doctorId;
    axios.get(`/rendezVous/doctor/${doctor_id}`, {
      headers: { 'Authorization': `${accessToken}`}
    })
    .then(response => {
      console.log(response);
      setAppointments(response?.data);
    })
    .catch(error => {
      console.log(error);
    });
  }, [doctorId,accessToken]); 

  const handleBookAppointment = (date, hour, formattedDate) => {
    //const formattedDate = date.toISOString().slice(0, 10);
    const [year, month, day] = formattedDate.split('-');
    const combinedDate = new Date(`${year}-${month}-${day}T${hour+1}:00:00`);
    const formattedCombinedDate = combinedDate.toISOString();

    let isBooked =false;


    appointments.forEach(appointment => {
      console.log("appointment date: ", appointment.date.toString());
      console.log("formattedCombinedDate: ", formattedCombinedDate.toString());
      console.log("Are they equal?", appointment.date.toString() === formattedCombinedDate.toString());
    
      if(appointment.date.toString() === formattedCombinedDate.toString()){
        setIsAlreadyBooked(true);
        isBooked = true;
        console.log("isAlreadyBooked:", isAlreadyBooked);
        return; 
      }
    });


    if (isBooked) {
      console.log('The date is already booked.');
    } else {
      axios.post('/rendezVous/bookRDV', {
        date:formattedCombinedDate, 
        patientId: user._id,
        doctorId: doctorId
      }, {
        headers: {
          'Authorization': `${accessToken}`   
        }
      })
      .then(response =>{
        console.log(response);
      })
      .catch(error =>{
        console.log(error);
      })
      console.log('Rendez-vous booked.');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', width:'90%' }}>
      {days.map((day, index) => (
        <div key={index} style={{ border: '3px solid black', padding: '10px', textAlign: 'center', backgroundColor:'rgb(222, 195, 236)', borderRadius:'10px' }}>
          <h1 className='font-mono text-xl font-extrabold'>{day.day}</h1>
          <h1 className='font-mono text-xl font-extrabold'>{day.date}</h1>
          <div className='flex flex-col gap-3 w-full mt-8'>{day.availableSlots}</div>
        </div>
      ))}
    </div>
  );
}
