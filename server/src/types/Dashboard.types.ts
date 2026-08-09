export interface StudentDashboardResponse {

    stats: DashboardStats;

    borrowedBooks: BorrowedBookCard[];

    latestArrivals: LatestArrivalCard[];

}

export interface LibrarianDashboardResponse {

}

export interface DashboardStats {

    borrowedBooksCount: number;

    pendingFineAmount: number;

    returnDeadline: Date | null;

}

export interface BorrowedBookCard {

    borrowId:string;

    copyId:string;

    accessionNumber:string;

    title:string;

    author:string;

    dueDate:Date;

    borrowedOn:Date;

}

export interface LatestArrivalCard {

    bookId:string;

    title:string;

    author:string;

    availableCopies:number;

    language:string;

}