import { NavLink, useNavigate } from "react-router-dom";

export default function StudentSidebar() {
    const navigate = useNavigate();

    const navigation = [
        {
            name: "Dashboard",
            path: "/student/dashboard",
            icon: "⌂",
        },
        {
            name: "Browse Books",
            path: "/student/books",
            icon: "▣",
        },
        {
            name: "My Borrowed Books",
            path: "/student/borrowed",
            icon: "▤",
        },
        {
            name: "Borrow History",
            path: "/student/history",
            icon: "◷",
        },
    ];

    return (
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 min-h-screen flex-col">

            {/* Logo */}
            <div className="h-16 px-6 flex items-center border-b border-gray-200">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                        Central Library
                    </h1>

                    <p className="text-xs text-gray-500">
                        Student Portal
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">

                <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Library
                </p>

                <div className="space-y-1">

                    {navigation.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                                    isActive
                                        ? "bg-slate-900 text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`
                            }
                        >
                            <span className="w-5 text-center">
                                {item.icon}
                            </span>

                            {item.name}
                        </NavLink>
                    ))}

                </div>

                <div className="mt-8">

                    <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Support
                    </p>

                    <NavLink
                        to="/student/contact"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                                isActive
                                    ? "bg-slate-900 text-white"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`
                        }
                    >
                        <span className="w-5 text-center">
                            ?
                        </span>

                        Contact Us
                    </NavLink>

                    <NavLink
                        to="/student/about"
                        className={({ isActive }) =>
                            `mt-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                                isActive
                                    ? "bg-slate-900 text-white"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }`
                        }
                    >
                        <span className="w-5 text-center">
                            i
                        </span>

                        About Library
                    </NavLink>

                </div>

            </nav>

            {/* Bottom */}
            <div className="p-4 border-t border-gray-200">

                <button
                    type="button"
                    onClick={() => navigate("/student/profile")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
                >
                    <span>◉</span>
                    Profile
                </button>

                <button
                    type="button"
                    className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
                >
                    <span>↪</span>
                    Logout
                </button>

            </div>

        </aside>
    );
}