interface BorrowedBook {
    borrowId: string;
    copyId: string;
    accessionNumber: string;
    title: string;
    author: string;
    dueDate: string;
    borrowedOn: string;
}

interface BorrowedBookCardProps {
    book: BorrowedBook;
}

export default function BorrowedBookCard({
    book,
}: BorrowedBookCardProps) {
    const dueDate = new Date(book.dueDate);

    const formattedDueDate = dueDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">

            <div className="flex items-start justify-between gap-4">

                <div>
                    <h3 className="font-semibold text-gray-900">
                        {book.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                        {book.author}
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                        Accession No. {book.accessionNumber}
                    </p>
                </div>

                <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    Issued
                </span>

            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between">

                <div>
                    <p className="text-xs text-gray-400">
                        Borrowed on
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                        {new Date(book.borrowedOn).toLocaleDateString(
                            "en-IN"
                        )}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-gray-400">
                        Due date
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                        {formattedDueDate}
                    </p>
                </div>

            </div>

        </div>
    );
}