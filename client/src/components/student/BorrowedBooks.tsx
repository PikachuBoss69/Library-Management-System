import { useEffect, useState } from "react";

import BorrowedBookCard from "../../components/student/BorrowBookCard";
import {
    getBorrowedBooks,
    BorrowedBook
} from "../../api/student.api";

export default function BorrowedBooks() {
    const [books, setBooks] = useState<BorrowedBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchBorrowedBooks() {
        const result = await getBorrowedBooks();
        console.log("Borrowed Books:", result);
        return result;
    }

async function loadBorrowedBooks() {
    try {
        setLoading(true);
        setError("");

        const result = await fetchBorrowedBooks();

        if (result.success === true) {
            setBooks(result.data);
        } else {
            console.error(result.message);

            setError(
                result.message ||
                "Unable to load borrowed books."
            );
        }
    } catch (error) {
        console.error(error);

        setError(
            "Unable to load borrowed books."
        );
    } finally {
        setLoading(false);
    }
}

useEffect(() => {
    async function initialLoad() {
        try {
            const result = await fetchBorrowedBooks();

            if (result.success === true) {
                setBooks(result.data);
            } else {
                setError(
                    result.message ||
                    "Unable to load borrowed books."
                );
            }
        } catch (error) {
            console.error(error);

            setError(
                "Unable to load borrowed books."
            );
        } finally {
            setLoading(false);
        }
    }

    initialLoad();
}, []);

    if (loading) {
    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <section>
                <p className="text-sm text-gray-500">
                    Student Portal
                </p>

                <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                    Borrowed Books
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Books currently issued to you.
                </p>
            </section>

            {/* Loading UI */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">

                <div className="relative h-80 flex flex-col items-center justify-center">

                    {/* Sky / subtle background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-12 left-[15%] w-20 h-5 bg-gray-100 rounded-full" />
                        <div className="absolute top-20 right-[18%] w-28 h-5 bg-gray-100 rounded-full" />
                    </div>

                    {/* Running track */}
                    <div className="relative w-full max-w-2xl h-32 overflow-hidden">

                        {/* Ground */}
                        <div className="absolute bottom-5 left-0 right-0 border-b-2 border-gray-200" />

                        {/* Moving rabbit */}
                        <div className="absolute bottom-7 animate-[run_2.5s_linear_infinite]">

                            <div className="relative flex items-end">

                                {/* Rabbit */}
                                <div className="relative">

                                    {/* Ears */}
                                    <div className="absolute -top-10 left-4 w-4 h-12 bg-gray-800 rounded-full rotate-[-12deg]" />
                                    <div className="absolute -top-11 left-10 w-4 h-13 bg-gray-800 rounded-full rotate-[12deg]" />

                                    {/* Body */}
                                    <div className="w-20 h-16 bg-gray-800 rounded-[50%] relative">

                                        {/* Head */}
                                        <div className="absolute -top-7 right-[-12px] w-14 h-14 bg-gray-800 rounded-full">

                                            {/* Eye */}
                                            <div className="absolute top-4 right-3 w-2 h-2 bg-white rounded-full" />

                                            {/* Nose */}
                                            <div className="absolute top-7 right-[-2px] w-2 h-2 bg-gray-500 rounded-full" />

                                        </div>

                                        {/* Tail */}
                                        <div className="absolute -left-5 top-2 w-8 h-8 bg-gray-800 rounded-full" />

                                        {/* Leg */}
                                        <div className="absolute -bottom-3 left-5 w-7 h-4 bg-gray-800 rounded-full rotate-[-15deg]" />

                                        {/* Front leg */}
                                        <div className="absolute bottom-2 right-[-7px] w-7 h-4 bg-gray-800 rounded-full rotate-[25deg]" />

                                    </div>
                                </div>

                                {/* Books carried by rabbit */}
                                <div className="absolute -top-12 left-[-5px] rotate-[-5deg]">

                                    <div className="w-12 h-3 bg-gray-400 rounded-sm mb-1 rotate-[-4deg]" />
                                    <div className="w-14 h-3 bg-gray-500 rounded-sm mb-1 rotate-[3deg]" />
                                    <div className="w-11 h-3 bg-gray-700 rounded-sm rotate-[-2deg]" />

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Loading text */}
                    <div className="relative text-center mt-2">

                        <div className="flex items-center justify-center gap-2">
                            <p className="text-sm font-medium text-gray-700">
                                Fetching your borrowed books
                            </p>

                            <span className="flex gap-1">
                                <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
                                <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
                                <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
                            </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-400">
                            Our little librarian is on the way 📚
                        </p>

                    </div>

                    {/* Progress bar */}
                    <div className="relative mt-5 w-56 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-gray-700 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
                    </div>

                </div>

            </div>
        </div>
    );
}

    if (error) {
    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <section>
                <p className="text-sm text-gray-500">
                    Student Portal
                </p>

                <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                    Borrowed Books
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Books currently issued to you.
                </p>
            </section>

            {/* Error UI */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">

                <div className="min-h-80 flex flex-col items-center justify-center px-6 py-12">

                    {/* Animated icon */}
                    <div className="relative mb-6">

                        {/* Soft circle */}
                        <div className="absolute inset-0 w-24 h-24 rounded-full bg-red-50 animate-[pulseSoft_2s_ease-in-out_infinite]" />

                        {/* Book */}
                        <div className="relative w-24 h-24 flex items-center justify-center animate-[errorBounce_2s_ease-in-out_infinite]">

                            <div className="relative w-14 h-16 bg-gray-800 rounded-r-md shadow-sm">

                                {/* Book pages */}
                                <div className="absolute left-0 top-1 bottom-1 w-2 bg-gray-600 rounded-l-sm" />

                                {/* Book lines */}
                                <div className="absolute left-5 top-5 w-6 h-1 bg-gray-500 rounded-full" />
                                <div className="absolute left-5 top-8 w-5 h-1 bg-gray-500 rounded-full" />
                                <div className="absolute left-5 top-11 w-4 h-1 bg-gray-500 rounded-full" />

                            </div>

                            {/* Question mark */}
                            <div className="absolute -top-2 -right-3 w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-500">
                                    ?
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-900 text-center">
                        Looks like our books took a wrong turn
                    </h2>

                    {/* Description */}
                    <p className="mt-2 max-w-md text-sm text-gray-500 text-center leading-6">
                        We couldn't fetch your borrowed books right now.
                        Don't worry, your books haven't disappeared.
                    </p>

                    {/* Error message */}
                    <div className="mt-5 px-4 py-3 rounded-lg bg-red-50 border border-red-100">
                        <p className="text-sm text-red-600 text-center">
                            {error}
                        </p>
                    </div>

                    {/* Retry */}
                    <button
                        type="button"
                        onClick={() => loadBorrowedBooks()}
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            px-5
                            py-2.5
                            text-sm
                            font-medium
                            text-white
                            bg-slate-900
                            rounded-lg
                            hover:bg-slate-800
                            transition
                            animate-[errorShake_4s_ease-in-out_infinite]
                        "
                    >
                        <span>↻</span>
                        Try Again
                    </button>

                    {/* Small message */}
                    <p className="mt-4 text-xs text-gray-400">
                        📚 Let's give it another try
                    </p>

                </div>

            </div>
        </div>
    );
}

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <section>
                <p className="text-sm text-gray-500">
                    Student Portal
                </p>

                <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                    Borrowed Books
                </h1>

                <p className="mt-1 text-sm text-gray-50Our little librarian is on the way 📚

0">
                    Books currently issued to you.
                </p>
            </section>

            {/* Books */}

            {books.length === 0 ? (

                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                    <p className="text-gray-600">
                        You don't have any borrowed books.
                    </p>
                </div>

            ) : (

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {books.map((book) => (
                        <BorrowedBookCard
                            key={book.borrowId}
                            book={book}
                        />
                    ))}
                </div>

            )}

        </div>
    );
}