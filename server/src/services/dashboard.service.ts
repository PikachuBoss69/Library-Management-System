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

export async function getLibrarianDashboard(userId : string): Promise<LibrarianDashboardResponse>{
    
}