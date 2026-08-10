import { StudentDashboardResponse, DashboardStats, BorrowedBookCard, LatestArrivalCard, LibrarianDashboardResponse } from "../types/Dashboard.types";
import * as borrowService from '../services/borrow.service';
import * as fineService from '../services/fine.service';
import * as bookService from '../services/book.service';

export async function getStudentDashboard(
    userId: string
): Promise<StudentDashboardResponse> {

    const [
        borrowedBooksCount,
        pendingFineAmount,
        returnDeadline,
        borrowedBooks,
        latestArrivals,
    ] = await Promise.all([

        borrowService.countBorrowedBooks(userId),

        fineService.getPendingFineAmount(userId),

        borrowService.getReturnDeadline(userId),

        borrowService.getActiveBorrowedBooks(userId),

        bookService.getLatestArrivals(),

    ]);

    return {

        stats: {
            borrowedBooksCount,
            pendingFineAmount,
            returnDeadline,
        },

        borrowedBooks,

        latestArrivals,

    };
}

export async function getLibrarianDashboard(): Promise<LibrarianDashboardResponse>{
    const [
        todaysBorrows,
        todaysReturns,
        overdueBooks,
        pendingFines,
        lostBooks,
        recentlyBorrowed,
        todaysBorrowed,
        latestArrivals,
    ] = await Promise.all([

        borrowService.countTodaysBorrowedBooks(),

        borrowService.countTodaysReturns(),

        borrowService.countOverdueBooks(),

        fineService.getPendingFineNumber(),

        borrowService.countLostBooks(),

        borrowService.getRecentlyBorrowedBooks(),

        borrowService.getTodaysBorrowedBooks(),

        bookService.getLatestArrivals(),

    ]);

    return {

        stats: {
            todaysBorrows,
            todaysReturns,
            overdueBooks,
            pendingFines,
            lostBooks,
        },

        todaysBorrowed,

        recentlyBorrowed,

        latestArrivals,

    };
}