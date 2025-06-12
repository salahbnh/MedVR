import React from 'react'

export default function IconBtn({icon, label, action, isDisabled}) {
  return (
    <button 
        style={{display:'grid', gridTemplateColumns:'25% 75%', alignItems:'center',height:'70px', width:'100%',border:'2px solid gray',borderRadius:'10px' , backgroundColor:`${isDisabled? 'rgb(223, 227, 231)': 'rgb(255, 255, 255)' }`}} 
        onClick={action}
        disabled={isDisabled? true : false}
    >
        <span className='flex items-center justify-center'> {icon} </span>
        <h1 className='flex items-center justify-start text-2xl font-mono font-bold' > {label} </h1>
    </button>
  )
}
