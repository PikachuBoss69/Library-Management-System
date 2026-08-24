import type { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-center px-16">

                <div className="max-w-lg">

                    <div className="mb-8">
                        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                            📚
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold mb-4">
                        Central Library
                    </h1>

                    <p className="text-lg text-slate-300 leading-relaxed">
                        Access books, manage your borrowing activity,
                        and stay connected with the BTKIT Central Library.
                    </p>

                </div>

            </div>


            {/* Right Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">

                <div className="w-full max-w-md">

                    {/* Heading */}
                    <div className="mb-8">

                        <h2 className="text-3xl font-bold text-gray-900">
                            {title}
                        </h2>

                        <p className="mt-2 text-gray-500">
                            {subtitle}
                        </p>

                    </div>


                    {/* Page Content */}
                    <div>
                        {children}
                    </div>

                </div>

            </div>

        </div>
    );
}