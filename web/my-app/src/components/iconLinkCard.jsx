import React from 'react'

export default function IconLinkCard({icon, title}) {
  return (
    <div
      className="justify-center mb-10 h-32 items-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      style={{ display: 'grid', gridTemplateColumns: '25% 75%' }}  
    >
        <span className=''>{icon}</span>
        <h5 className="mb-2 text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white">{title}</h5>
    </div>
  )
}