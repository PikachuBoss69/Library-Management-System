import { Book } from "../../api/book.api";

interface BookCardProps {
    book: Book;
}

export default function BookCard({
    book,
}: BookCardProps) {

    const isAvailable = book.availableCopies > 0;

    return (
        <div className="
            h-full
            bg-white
            border
            border-gray-200
            rounded-xl
            overflow-hidden
            hover:shadow-md
            transition
            flex
            flex-col
        ">

            {/* Book Cover */}
            <div className="
                h-48
                shrink-0
                bg-gray-100
                flex
                items-center
                justify-center
            ">
                <span className="text-4xl">
                    📖
                </span>
            </div>


            {/* Book Information */}
            <div className="
                p-5
                flex
                flex-col
                flex-1
            ">

                {/* Title + Availability */}
                <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0 flex-1">

                        {/* Fixed title height */}
                        <h3 className="
                            h-12
                            font-semibold
                            text-gray-900
                            line-clamp-2
                        ">
                            {book.title}
                        </h3>

                        {/* Fixed author height */}
                        <p className="
                            h-12
                            mt-1
                            text-sm
                            text-gray-500
                            line-clamp-3
                        ">
                            {book.author}
                        </p>

                    </div>

                    {/* Availability */}
                    <span
                        className={`
                            shrink-0
                            px-2.5
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${
                                isAvailable
                                    ? "bg-green-50 text-green-700"
                                    : "bg-red-50 text-red-700"
                            }
                        `}
                    >
                        {isAvailable
                            ? "Available"
                            : "Unavailable"}
                    </span>

                </div>


                {/* Category */}
                <div className="
                    h-10
                    mt-3
                    flex
                    items-start
                ">
                    <span className="
                        inline-block
                        px-2.5
                        py-1
                        bg-gray-100
                        text-gray-600
                        rounded-md
                        text-xs
                    ">
                        {book.category}
                    </span>
                </div>


                {/* Details */}
                <div className="
                    h-32
                    mt-2
                    pt-4
                    border-t
                    border-gray-100
                    space-y-2
                ">

                    {/* ISBN */}
                    <div className="flex justify-between gap-3 text-sm">
                        <span className="text-gray-400">
                            ISBN
                        </span>

                        <span className="
                            text-gray-700
                            truncate
                        ">
                            {book.isbn}
                        </span>
                    </div>


                    {/* Language */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                            Language
                        </span>

                        <span className="text-gray-700">
                            {book.language}
                        </span>
                    </div>


                    {/* Published */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                            Published
                        </span>

                        <span className="text-gray-700">
                            {new Date(
                                book.publicationYear
                            ).getFullYear()}
                        </span>
                    </div>


                    {/* Copies */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                            Copies
                        </span>

                        <span className="text-gray-700">
                            {book.availableCopies} / {book.totalCopies}
                        </span>
                    </div>

                </div>


                {/* Button */}
                <button
                    type="button"
                    className="
                        mt-auto
                        w-full
                        py-2.5
                        rounded-lg
                        bg-slate-900
                        text-white
                        text-sm
                        font-medium
                        hover:bg-slate-800
                        transition
                    "
                >
                    View Details
                </button>

            </div>

        </div>
    );
}