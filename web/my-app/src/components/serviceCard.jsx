import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRightLong } from "react-icons/fa6";

export default function ServiceCard({title,link,price}) {
  return (
    <Link to={link}>
        <div className='grid justify-center items-center gap-10 w-96 h-20 rounded-md bg-slate-900' style={{gridTemplateColumns:'80% 20%'}}>
            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-l font-mono font-bold text-gray-200'>{title} </h1>
                <h1 className='text-s font-mono font-bold text-gray-400'>book for {price}</h1>
            </div>
            <FaArrowRightLong className='size-6' style={{color: 'white'}}/>
        </div>
    </Link>
  )
}
