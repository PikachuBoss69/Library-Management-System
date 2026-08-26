import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Login from "./pages/auth/Login";
import {Route, Routes} from 'react-router-dom';

function App() {

    return (

        <Routes>
            <Route path="/" element={<Register />}/>
            <Route path="/verify-otp" element={<VerifyOtp />}/>
            <Route path="/login" element={<Login />}/>
        
        </Routes>
);
}

export default App