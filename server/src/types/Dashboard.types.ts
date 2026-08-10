export interface StudentDashboardResponse {

    stats: DashboardStats;

    borrowedBooks: BorrowedBookCard[];

    latestArrivals: LatestArrivalCard[];

}

export interface LibrarianDashboardResponse {

    stats: LibrarianDashboardStats;

    todaysBorrowed: LibrarianBorrowCard[];

    recentlyBorrowed: LibrarianBorrowCard[];

    latestArrivals: LatestArrivalCard[];
}

export interface DashboardStats {

    borrowedBooksCount: number;

    pendingFineAmount: number;

    returnDeadline: Date | null;

}

export interface LibrarianDashboardStats {

    todaysBorrows: number;

    todaysReturns: number;

    overdueBooks: number;

    pendingFines: number;

    lostBooks: number;
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

export interface LibrarianBorrowCard {

    borrowId: string;

    userId: string;

    userName: string;

    rollNumber? : string;

    employeId? : string;

    copyId: string;

    accessionNumber: string;

    title: string;

    author: string;

    dueDate: Date;

    borrowedOn: Date;
}