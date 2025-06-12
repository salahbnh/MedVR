import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import {object,color,background} from '../constants/imgData';

function MedNft() {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [address, setAddress] = useState(null);




  const generateImage = async () => {
    try {
        console.log(address);
      const response = await axios.post('/image/generateImage', { text:text, prompt: prompt, address: address });
      console.log(response);
      setImage(response.data.image);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to generate image. Please try again.');
    }
  };
  
  useEffect(() => {
    const getUserAddress = async () => {
      try {
        if(!address){
            const response = await axios.get("/image/getUserAddress");
            if (response.status === 200) {
              setAddress(response.data);
              localStorage.setItem("adr", response.data.response);
            } else {
              throw new Error('Unexpected response status');
            }
        }  

      } catch (error) {
        console.log(error);
      }
    };

    getUserAddress();
  }, [address]);

  useEffect(() =>{
    console.log(prompt)
    console.log(text);
  },[prompt, text])

  return (
    <div className='flex flex-col py-32 items-center w-full gap-10'>
       <h1 className='text-blue-900 font-mono text-3xl font-extrabold px-16 py-6'>Pick Your Object and generate you unique image: </h1>
       <div className='flex flex-row font-mono gap-8'>
         {Object.entries(object).map(([key, value]) => (
           <button className='rounded-lg border border-gray-900' key={key} onClick={()=>{setPrompt(Number(key)); setText(value)}}>{value}</button>
         ))}
      </div>
      <button                 
        className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-900 rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 font-bold text-gray-50 font-mono w-80"
        onClick={generateImage}>Generate Image</button>
        <h1 className='text-blue-900 font-mono text-xl font-extrabold px-16 py-6'>{text}</h1>
        {image && <img src={`data:image/png;base64,${image}`} alt="Generated" height={512} width={512}/>}
    </div>
  );
}

export default MedNft;

