import { useEffect, useState } from "react";

import BookCard from "../../components/student/BookCard";
import {
    getAllBooks,
    Book
} from "../../api/book.api";

export default function BrowseBooks() {
    const [books, setBooks] = useState<Book[]>([]);

    const [page, setPage] = useState(1);
    const [limit] = useState(12);

    const [totalPages, setTotalPages] = useState(1);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchBooks() {
        const result = await getAllBooks({
            page,
            limit,
            search,
            category,
        });

        return result;
    }

    async function loadBooks() {
        try {
            setLoading(true);
            setError("");

            const result = await fetchBooks();

            if (result.success) {
                setBooks(result.data);
                setTotalPages(result.meta.pages);
            } else {
                setError(
                    result.message ||
                    "Unable to load books."
                );
            }

        } catch (error) {
            console.error(
                "Failed to load books:",
                error
            );

            setError(
                "Unable to load books. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function initialLoad() {
            try {
                const result = await fetchBooks();

                if (result.success) {
                    setBooks(result.data);
                    setTotalPages(result.meta.pages);
                } else {
                    setError(
                        result.message ||
                        "Unable to load books."
                    );
                }

            } catch (error) {
                console.error(error);

                setError(
                    "Unable to load books. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }

        initialLoad();
    }, [page, search, category]);

    function handleSearch(
        event: React.SubmitEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setPage(1);
        loadBooks();
    }

    function handleCategoryChange(
        value: string
    ) {
        setCategory(value);
        setPage(1);
    }

    function goToPage(
        pageNumber: number
    ) {
        if (
            pageNumber < 1 ||
            pageNumber > totalPages
        ) {
            return;
        }

        setPage(pageNumber);
    }

    /*
     * Loading
     */
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

    /*
     * Error
     */
    if (error) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">

                    <p className="text-gray-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadBooks}
                        className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">

            {/* Header */}
            <section>
                <p className="text-sm text-gray-500">
                    Student Portal
                </p>

                <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                    Browse Books
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Explore books available in the library.
                </p>
            </section>


            {/* Search & Filters */}
            <section>
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col md:flex-row gap-3"
                >

                    {/* Search */}
                    <div className="relative flex-1">

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search by title, author or ISBN..."
                            className="
                                w-full
                                px-4
                                py-3
                                bg-white
                                border
                                border-gray-200
                                rounded-xl
                                outline-none
                                focus:ring-2
                                focus:ring-slate-900
                            "
                        />

                    </div>


                    {/* Category */}
                    <select
                        value={category}
                        onChange={(e) =>
                            handleCategoryChange(
                                e.target.value
                            )
                        }
                        className="
                            px-4
                            py-3
                            bg-white
                            border
                            border-gray-200
                            rounded-xl
                            outline-none
                            focus:ring-2
                            focus:ring-slate-900
                        "
                    >
                        <option value="">
                            All Categories
                        </option>

                        <option value="Programming">
                            Programming
                        </option>

                        <option value="Database">
                            Database
                        </option>

                        <option value="Networking">
                            Networking
                        </option>

                        <option value="Mathematics">
                            Mathematics
                        </option>
                    </select>


                    {/* Search Button */}
                    <button
                        type="submit"
                        className="
                            px-6
                            py-3
                            bg-slate-900
                            text-white
                            rounded-xl
                            font-medium
                            hover:bg-slate-800
                            transition
                        "
                    >
                        Search
                    </button>

                </form>
            </section>


            {/* Result information */}
            <div className="flex items-center justify-between">

                <p className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-medium text-gray-900">
                        {books.length}
                    </span>{" "}
                    books
                </p>

                <p className="text-sm text-gray-400">
                    Page {page} of {totalPages}
                </p>

            </div>


            {/* Books */}
            {books.length === 0 ? (

                <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">

                    <div className="text-4xl">
                        📚
                    </div>

                    <h2 className="mt-4 font-medium text-gray-900">
                        No books found
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or category.
                    </p>

                </div>

            ) : (

                <div className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    lg:grid-cols-4
                    gap-4
                ">
                    {books.map((book) => (
                        <BookCard
                            key={book._id}
                            book={book}
                        />
                    ))}
                </div>

            )}


            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">

                    {/* Previous */}
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() =>
                            goToPage(page - 1)
                        }
                        className="
                            px-3
                            py-2
                            text-sm
                            border
                            border-gray-200
                            rounded-lg
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                            hover:bg-gray-50
                        "
                    >
                        ← Previous
                    </button>


                    {/* Page Numbers */}
                    {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                    ).map((pageNumber) => (

                        <button
                            key={pageNumber}
                            type="button"
                            onClick={() =>
                                goToPage(pageNumber)
                            }
                            className={`
                                w-9
                                h-9
                                rounded-lg
                                text-sm
                                font-medium
                                ${
                                    page === pageNumber
                                        ? "bg-slate-900 text-white"
                                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }
                            `}
                        >
                            {pageNumber}
                        </button>

                    ))}


                    {/* Next */}
                    <button
                        type="button"
                        disabled={
                            page === totalPages
                        }
                        onClick={() =>
                            goToPage(page + 1)
                        }
                        className="
                            px-3
                            py-2
                            text-sm
                            border
                            border-gray-200
                            rounded-lg
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                            hover:bg-gray-50
                        "
                    >
                        Next →
                    </button>

                </div>
            )}

        </div>
    );
}