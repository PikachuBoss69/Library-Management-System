

export interface BorrowQuery {
    page?: number;
    limit?: number;
    userId?: string;
    copyId?: string;
    status?: "issued" | "returned" | "lost";
    from?: string;
    to?: string;
}

export interface BorrowFilter {
    userId?: string;
    copyId?: string;
    status?: "issued" | "returned" | "lost";
    dueDate?: {
        $lt?: Date;
    };
    borrowDate?: {
        $gte?: Date;
        $lte?: Date;
    };
}