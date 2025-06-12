import React from 'react'; 
import { FaCalendarCheck } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

const iconCardData = [
    {
        link:'/',
        title:'Booking And Payment',
        icon: <FaCalendarCheck className='size-6 text-blue-950  '/>
    },
    {
        link:'/',
        title:'Receive Video Link',
        icon: <FaVideo className='size-6 text-blue-950'/>
    },
    {
        link:'/',
        title:'Go To Your Consultation',
        icon: <FaUserDoctor className='size-6 text-blue-950'/>
    }
]

export default iconCardData;