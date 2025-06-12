import React from 'react'
import { Link } from 'react-router-dom'

export default function VrCard({img}) {
  return (
    <Link 
     style={{width:'60%'}}
     to='/' 
     className="flex flex-col  items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-96 md:rounded-none md:rounded-s-lg" src={img} alt=""/>
        <div className="flex flex-col justify-between p-4 leading-normal">
            <h5 className="mb-2 text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white">Experience Futuristic Healthcare with Our VR Medical Consultation App</h5>
            <p className="mb-3 font-normal text-gray-700 font-mono dark:text-gray-400">Explore advanced virtual reality technology designed to enhance your medical consultations. Click to discover more about how our app can revolutionize your healthcare experience.</p>
        </div>
    </Link>
  )
}
