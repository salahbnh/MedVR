import {useState} from 'react'

export const useShowLogin= () => {

  const [isClicked, setIsClicked] = useState(false);

  const handleOpen = () =>{
    setIsClicked(true);
    console.log(isClicked);
  }
  const handleClose = () =>{
    setIsClicked(false);
    console.log(isClicked);
  }


  return {isClicked,setIsClicked,handleOpen,handleClose}

}
