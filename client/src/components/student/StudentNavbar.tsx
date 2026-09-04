export default function StudentNavbar() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between">

            {/* Mobile menu placeholder */}
            <div className="lg:hidden">
                <button
                    type="button"
                    className="text-gray-600 text-xl"
                >
                    ☰
                </button>
            </div>

            <div className="hidden lg:block" />

            {/* Right side */}
            <div className="flex items-center gap-5">

                {/* Notifications */}
                <button
                    type="button"
                    className="relative text-gray-500 hover:text-gray-900"
                >
                    <span className="text-lg">🔔</span>

                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User */}
                <div className="flex items-center gap-3">

                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-medium">
                        SS
                    </div>

                    <div className="hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">
                            Student
                        </p>

                        <p className="text-xs text-gray-500">
                            STU2023IT002
                        </p>
                    </div>

                </div>

            </div>

        </header>
    );
}