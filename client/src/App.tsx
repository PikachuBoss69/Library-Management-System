import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/dashboard/StudentDashboard"
import StudentLayout from "./layouts/StudentLayout";
import {Route, Routes} from 'react-router-dom';

function App() {

    return (

        <Routes>
            <Route path="/" element={<Register />}/>
            <Route path="/verify-otp" element={<VerifyOtp />}/>
            <Route path="/login" element={<Login />}/>
            <Route
                path="/student"
                element={<StudentLayout />}
            >
                <Route
                    path="dashboard"
                    element={<StudentDashboard />}
                />
            </Route>
        
        </Routes>
);
}

export default App