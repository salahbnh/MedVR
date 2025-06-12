import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useResponsive } from '../hooks/useResponsive';

export default function QuestionAccordion() {
  const isMobile = useResponsive();
  
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const accordionSections = [
    { id: 1, title: 'Is the consultation by video call?', content: 'Yes. After booking and payment confirmation you will receive a link to access our virtual attending room at the scheduled time, where the doctor will start the video consultation.'},
    { id: 3, title: 'Do I need to install any software?', content: 'No. The video call is made through the browser of your computer, tablet or smartphone, without the need to install any programme or app. You will only have to authorise the use of the camera and microphone when you join the video consultation. However, you can use install and use our mobile app and if you have a VR you can enjoy our VR consultaion app.' },
    { id: 4, title: 'Which doctors are part of this Clinic?', content: 'Our registered Clinicians are handpicked. You can check the hole list under the Doctors section. ' },
    { id: 5, title: "Who shouldn't use our service?", content: 'We aim to offer fast access for anyone wanting to discuss a wide range of clinical concerns. However being an online only service we suggest anyone who has an acute illness eg chest pains, severe shortness of breath or condition that would need a face to face examination, should re-consider and find an alternate provider.' }
  ];

  return (
    <div 
      style={{width:`${isMobile ? '100%' : '850px'}`}}
      id="accordion-open" 
      data-accordion="open">
      {accordionSections.map(section => (
        <div key={section.id}>
          <div id={`accordion-open-heading-${section.id}`} >
            <button
              type="button"
              className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
              onClick={() => toggleAccordion(section.id)} 
              aria-expanded={openAccordion === section.id ? "true" : "false"}
              aria-controls={`accordion-open-body-${section.id}`}
            >
              <span className="flex items-center">
                <h1 className='text-slate-900 font-mono text-xl'>{section.title}</h1>
              </span>
              {openAccordion === section.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
          </div>
          <div
            id={`accordion-open-body-${section.id}`}
            style={{padding:'20px'}}
            className={openAccordion === section.id ? "block" : "hidden"} // Show or hide the content based on the state
            aria-labelledby={`accordion-open-heading-${section.id}`}
          >
            <p className='text-slate-900 font-mono text-l'>{section.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
