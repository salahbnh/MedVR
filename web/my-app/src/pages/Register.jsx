import LinkButton from '../components/linkButton';
import DoctorForm from '../components/doctorForm';
import { useState } from 'react';
import PatientForm from '../components/patientForm';

export default function Register() {
   const [regDoctor, setRegDoctor] = useState(false);
   const [regPatient, setRegPatient] = useState(false);
  
   const handleRegDoctor = () =>{
    setRegDoctor(true);
   }

   const handleRegPatient = () =>{
    setRegPatient(true);
   }

    return (
        <div style={{
          justifyContent:'center',
          alignItems:'center ',
          background: 'linear-gradient(to right,white, rgb(208, 234, 255),rgb(207, 250, 222), white)',
          borderTopRightRadius:'10px',
          borderBottomRightRadius:'10px'
        }}>
          {!regDoctor && !regPatient &&
            <div style={{
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                paddingTop:'150px',
            }}>
              <p className="text-5xl text-green-800 font-bold py-8">Welcome to our medical center</p>
              <p className="text-2xl text-blue-900 font-bold py-3">Register to enjoy our services</p>
              <p className="text-2xl text-blue-900 font-bold py-3">Register as :</p>
              <div className="flex gap-4">
                <LinkButton
                  onClick={handleRegDoctor}
                  text='Doctor'
                />
                <LinkButton
                  onClick={handleRegPatient}
                  text='Patient'
                /> 
              </div>
            </div>
          }
          <div>

          </div>
          { regDoctor  && <DoctorForm/> }
          { regPatient && <PatientForm/> }
        </div>

    )
  }
  
  
  
