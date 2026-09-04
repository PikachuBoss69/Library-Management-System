import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/student/StudentSidebar";
import StudentNavbar from "../components/student/StudentNavbar";

export default function StudentLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* Sidebar */}
            <StudentSidebar />

            {/* Main Area */}
            <div className="flex-1 min-w-0">

                <StudentNavbar />

                <main className="p-6 lg:p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}