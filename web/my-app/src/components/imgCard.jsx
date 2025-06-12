import React from 'react'
import { Link } from 'react-router-dom'

export default function ImgCard({link,img,title,text}) {
  return (
    <Link to={link}>
        <div 
         style={{
            width:'500px',
            height:'350px'
         }}
         className=" bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <img className="rounded-t-lg w-full h-96"  src={img} alt="" />
            <div className="p-5">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{text}</p>
            </div>
        </div>
    </Link>
  )
}
