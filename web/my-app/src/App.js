import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Layout from './pages/Layout';
import RequireAuth from './components/RequireAuth';
import NavBar from './components/navbar';
import About from './pages/About';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import RequestAppointment from './pages/RequestAppointment';
import Consultation from './pages/Consultation';
import UserProfile from './pages/UserProfile';
import DoctorDetails from './pages/DoctorDetails';
import DoctorProfile from './pages/DoctorProfile';
import PatientProfile from './pages/PatientProfile';
import Unauthorized from './pages/Unauthorized';
import SuccessPayment from './pages/successPayment';
import FailPayment from './pages/failPayment';
import Payment from './pages/payment';
import View from './pages/TestVideoPage';
import ResetPassword from './pages/ResetPwd';
import Patients from './pages/Patients';
import Footer from './components/footer';

export default function App() {
    return (
        <BrowserRouter>
            <div className="fixed w-full z-50">
                <NavBar />
            </div>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />}>
                    <Route path="/signUp" element={<Register />} />
                    <Route path="login" element={<Login />} />
                    <Route path="About" element={<About />} />
                    <Route path="doctors" element={<Doctors />} />
                    <Route path="/doctors/:doctorId" element={<DoctorDetails />} />
                    <Route path="/patients/:patientId" element={<Patients />} />
                    <Route path="Services" element={<Services />} />
                    <Route path="consultation" element={<Consultation />} />
                    <Route path="request_appointment" element={<RequestAppointment />} />
                    <Route path="unauthorized" element={<Unauthorized />} />
                    <Route path="reset-password" element={<ResetPassword />} />
                    {/* Payment result pages — outside auth guard so Flouci redirects work */}
                    <Route path="success" element={<SuccessPayment />} />
                    <Route path="fail" element={<FailPayment />} />
                    <Route path="payment" element={<Payment />} />
                </Route>

                {/* Protected routes */}
                <Route element={<RequireAuth allowedRoles={["doctor", "patient"]} />}>
                    <Route path="layout" element={<Layout />} />
                    <Route path="userProfile" element={<UserProfile />}>
                        <Route element={<RequireAuth allowedRoles={["doctor"]} />}>
                            <Route path="doctorProfile" element={<DoctorProfile />} />
                        </Route>
                        <Route element={<RequireAuth allowedRoles={["patient"]} />}>
                            <Route path="patientProfile" element={<PatientProfile />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
             <div className="">
                <Footer />
            </div>
        </BrowserRouter>
    );
}
