import React from 'react'
import { Link } from 'react-router-dom'

export default function DoctorCard ({ doctor }){
  const { _id, fName, lName, profilePicture, specialization } = doctor;

  return (
    <div className="w-80 bg-gray-200 border pt-5 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-10">
            <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={profilePicture} alt=""/>
            <h3 className="mb-1 font-mono text-xl font-bold text-gray-900 dark:text-white">{fName + '' + lName}</h3>
            <span className="text-sm font-mono font-bold text-gray-500 dark:text-gray-400">{specialization}</span>
            <div className="flex mt-4 md:mt-6">
              <Link to={`/doctors/${_id}`} className="inline-flex items-center font-mono px-4 py-2 text-sm font-medium text-center text-gray-900 bg-gray-300 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700 ms-3">Book Consultation</Link>
            </div>
        </div>
    </div>
  )
}
