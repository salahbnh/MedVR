import { useState } from 'react';
import PatientData from '../components/patientProfile/profileData';
import IconBtn from '../components/iconBtn';
import { FaUser, FaCalendarCheck, FaFileMedical } from "react-icons/fa";
import Appointments from '../components/patientProfile/appointments';
import MedFolder from '../components/patientProfile/medFolder';

export default function PatientProfile() {
    const [panel, setPanel] = useState(1);

    return (
        <div className="flex min-h-screen pt-20">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white">
                <div className="flex flex-col gap-1 p-4 pt-8">
                    <IconBtn
                        icon={<FaUser className="w-5 h-5" />}
                        label="Account Info"
                        action={() => setPanel(1)}
                        isDisabled={panel === 1}
                    />
                    <IconBtn
                        icon={<FaCalendarCheck className="w-5 h-5" />}
                        label="Appointments"
                        action={() => setPanel(2)}
                        isDisabled={panel === 2}
                    />
                    <IconBtn
                        icon={<FaFileMedical className="w-5 h-5" />}
                        label="Medical Folder"
                        action={() => setPanel(3)}
                        isDisabled={panel === 3}
                    />
                </div>
            </div>
            {/* Main content */}
            <div className="flex-1 bg-gray-50">
                {panel === 1 && <PatientData />}
                {panel === 2 && <Appointments />}
                {panel === 3 && <MedFolder />}
            </div>
        </div>
    );
}
