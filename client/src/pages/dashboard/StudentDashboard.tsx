import { useEffect, useState } from "react";

import StatCard from "../../components/student/StatCard";
import BorrowedBookCard from "../../components/student/BorrowBookCard";

import {
    getStudentDashboard,
    StudentDashboardData,
} from "../../api/student.api";

export default function Dashboard() {
    const [dashboard, setDashboard] =
        useState<StudentDashboardData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // ONLY fetch data — no setState here
    async function fetchDashboard() {
        const result = await getStudentDashboard();

        console.log(
            "Student dashboard response:",
            result
        );

        return result;
    }

    // Used by the button
    async function loadDashboard() {
        try {
            setLoading(true);
            setError("");

            const result = await fetchDashboard();

            if (result.status === "Success") {
                setDashboard(result.data);
            } else {
                setError(
                    result.message ||
                    "Unable to load dashboard."
                );
            }

        } catch (error) {
            console.error(
                "Failed to load student dashboard:",
                error
            );

            setError(
                "Unable to load your dashboard. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    // Initial dashboard load
    useEffect(() => {
        async function initialLoad() {
            try {
                const result = await fetchDashboard();

                if (result.status === "Success") {
                    setDashboard(result.data);
                } else {
                    setError(
                        result.message ||
                        "Unable to load dashboard."
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load student dashboard:",
                    error
                );

                setError(
                    "Unable to load your dashboard. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }

        initialLoad();
    }, []);

    /*
     * Loading
     */
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center min-h-100">
                    <div className="text-center">

                        <div className="w-8 h-8 border-2 border-gray-300 border-t-slate-900 rounded-full animate-spin mx-auto" />

                        <p className="mt-4 text-sm text-gray-500">
                            Loading your dashboard...
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    /*
     * Error
     */
    if (error) {
        return (
            <div className="max-w-7xl mx-auto">

                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

                    <p className="text-sm font-medium text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => loadDashboard()}
                        className="mt-4 px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    /*
     * No data
     */
    if (!dashboard) {
        return (
            <div className="max-w-7xl mx-auto">

                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">

                    <p className="text-gray-600">
                        No dashboard data available.
                    </p>

                </div>

            </div>
        );
    }

    /*
     * Format return deadline
     */
    const formattedReturnDeadline =
        dashboard.stats.returnDeadline
            ? new Date(
                dashboard.stats.returnDeadline
            ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            : "No deadline";

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <section>

                <p className="text-sm text-gray-500">
                    Student Portal
                </p>

                <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                    Good evening
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Here's an overview of your library account.
                </p>

            </section>


            {/* Search */}
            <section>

                <div className="relative max-w-2xl">

                    <input
                        type="text"
                        placeholder="Search books by title, author or ISBN..."
                        className="w-full px-4 py-3 pl-11 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </span>

                </div>

            </section>


            {/* Statistics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

                <StatCard
                    title="Currently Borrowed"
                    value={dashboard.stats.borrowedBooksCount}
                    description="Books currently with you"
                />

                <StatCard
                    title="Return Deadline"
                    value={formattedReturnDeadline}
                    description="Next return deadline"
                />

                <StatCard
                    title="Fine Pending"
                    value={`₹${dashboard.stats.pendingFineAmount}`}
                    description="Outstanding library fine"
                />

            </section>


            {/* Currently Borrowed */}
            <section>

                <div className="flex items-center justify-between mb-4">

                    <div>

                        <h2 className="text-lg font-semibold text-gray-900">
                            Currently Borrowed
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Books currently issued to you.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="text-sm font-medium text-slate-900 hover:underline"
                    >
                        View all
                    </button>

                </div>


                {dashboard.borrowedBooks.length === 0 ? (

                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">

                        <p className="text-gray-600">
                            You don't have any borrowed books.
                        </p>

                        <p className="mt-1 text-sm text-gray-400">
                            Books you borrow will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                        {dashboard.borrowedBooks.map((book) => (

                            <BorrowedBookCard
                                key={book.borrowId}
                                book={book}
                            />

                        ))}

                    </div>

                )}

            </section>


            {/* Recently Added Books */}
            <section>

                <div className="flex items-center justify-between mb-4">

                    <div>

                        <h2 className="text-lg font-semibold text-gray-900">
                            Recently Added Books
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Explore books recently added to the library.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="text-sm font-medium text-slate-900 hover:underline"
                    >
                        View all
                    </button>

                </div>


                {dashboard.recentlyAddedBooks.length === 0 ? (

                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">

                        <p className="text-gray-600">
                            No recently added books.
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

                        {dashboard.recentlyAddedBooks.map((book) => (

                            <div
                                key={book.bookId}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                            >

                                {/* Book Cover */}
                                <div className="h-44 bg-gray-100 flex items-center justify-center">

                                    <span className="text-sm text-gray-400">
                                        Book Cover
                                    </span>

                                </div>


                                {/* Book Information */}
                                <div className="p-4">

                                    <h3 className="font-medium text-gray-900 line-clamp-1">
                                        {book.title}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                        {book.author}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}