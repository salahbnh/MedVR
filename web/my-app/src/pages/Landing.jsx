
import backgroundImg from '../assets/backgroudImg.jpg';
import {Outlet} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useResponsive } from '../hooks/useResponsive';
import IconLinkCard from '../components/iconLinkCard'
import doctorVR from '../assets/doctorVR.jpg'
import doctorVideo from '../assets/doctorVideo.jpg'
import iconCardData from '../constants/iconCardData'
import QuestionAccordion from '../components/questionAccordion';
import { MetaQuest } from '../components/threejs';
import '../style/landing.css'
import { SVGMaskEffect } from '../components/framer_components/maskContainer';
import { LampText } from '../components/framer_components/lampText';
import { CardHoverEffect } from '../components/framer_components/cardHover';
import { TextGenerateEffect } from '../components/ui/text-generate-effect';
import { ThreeDCard } from '../components/framer_components/threeDcard';


export default function Landing(){
  const location = useLocation();
  const { pathname } = location;

  const isRootPath = pathname === "/";

  const isMobile = useResponsive();

  return (
    <div
      style={{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:`${isMobile? '100%' : '100%'}`,
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>

      <div style={{
        display:'flex',
        flexDirection:'column',
        marginTop:'80px',
        width:`${isMobile? '100%' : '90%' }`,
        minHeight:'90%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgb(255,255,255,0.9)',
        border:'2px solid gray',
        borderRadius:'10px',
        overflow:'hidden',
      }}
      >
      {!isRootPath &&
        <>
          <Outlet/>
        </>
        }
      { isRootPath &&
        <div style={{
          display:"flex",
          padding:'5px',
          width:"100%",
          alignItems:'center',
          flexDirection:'column',
        }}>
            <LampText/>
            <div className='flex flex-col p-8 w-[100%]' >
              <SVGMaskEffect/>
            </div> 


          <div
            style={{
              display:'flex',
              flexDirection:'column',
              justifyContent:'center',
              alignItems:'center',
              marginTop:'100px',
              width:'100%',
            }}
          >
            <h1 className='text-6xl  font-mono font-extrabold text-slate-900'> Popular Services</h1>
            <CardHoverEffect/>
          </div> 
          <div style={{
            display:'flex',
            flexDirection:'column',
            marginTop:'120px',
            justifyContent:'center',
            alignItems:'center',
            paddingInline:'50px',
            width:'100%',
          }}>
            <h1 className='text-6xl  font-mono font-extrabold text-slate-900'> Main Categories</h1>
            <div style={{
              display:'grid',
              gridTemplateColumns:`${isMobile ? "100%" : "50% 50%"}`,
              height: '400px',
              marginTop:'60px',
              width:'100%',
            }}>
              <TextGenerateEffect words={ "Experience Futuristic Healthcare with Our VR Medical Consultation App. Dive into tomorrow's healthcare with our VR app. Utilizing cutting-edge virtual reality technology, we're redefining medical consultations. Immerse yourself in lifelike virtual environments for detailed examinations and treatment planning. Revolutionize your healthcare experience by embracing VR. Explore how our app can transform medical consultations. Elevate your healthcare journey with us today."} />
              <div className='w-full'> <MetaQuest/></div>
            </div>
          </div>
          <div className='flex w-[80%] justify-center items-center my-8 mt-24'>
            <TextGenerateEffect words={ "We offer patients a range of different specialist appointments conducted via our GPs.Each section enables users to book either a video consultation or request specific medications without the need to see a clinician. Please choose your preferred consultation type from one of the categories below:"} />
          </div>
          <div
            style={{
              display:'flex',
              flexDirection:`${isMobile? 'column' : 'row'}`,
              gap:`${isMobile? '250px' : '30px'}`
            }}
          >
            <ThreeDCard 
              img={doctorVR}
              title={"VR Consultation"}
              description={"Book Now For 70dt"}
              link="/doctors"
            />
            <ThreeDCard 
              img={doctorVideo}
              title={"Video Consultation"}
              description={"Book Now For 70dt"}
              link="/doctors"
            /> 
          </div>
          <div
            style={{
              display:'flex',
              flexDirection:'column',
              marginTop:'100px',
              width:'100%',
              alignItems:'center',
              gap:'20px'
            }}
          >
            <h1 className='text-6xl font-mono font-extrabold text-slate-900'>  Get Medical Care In 
              <span className='text-7xl font-extrabold'> Three Easy Steps</span>
            </h1>
            <div
             style={{
               display:'flex',
               flexDirection:`${isMobile? 'column': 'row'}`,
               marginBottom:'40px',
               marginTop:'40px',
               gap:'10%'
               
             }}>
              {iconCardData.map((data, index) => (
                <IconLinkCard key={index} {...data} />
              ))}
            </div>
          </div>
          <div 
           style={{
            display:'flex',
            flexDirection:'column',
            marginTop:'90px',
            justifyContent:'center',
            alignItems:'center',
            gap:'30px'
           }}  
          >
            <h1 className='text-6xl font-mono font-extrabold text-slate-900'>  Answers To Frequently Asked Questions</h1>
            <QuestionAccordion/>
          </div>
        </div>
      }
      </div>
    </div>
  )
}
