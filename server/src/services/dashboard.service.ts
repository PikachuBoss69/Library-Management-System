import { StudentDashboardResponse, LibrarianDashboardResponse, AdminDashboardResponse } from "../types/Dashboard.types";
import * as borrowService from '../services/borrow.service';
import * as fineService from '../services/fine.service';
import * as bookService from '../services/book.service';
import * as userService from '../services/auth.service';
import * as bookCopyService from '../services/bookCopy.service';

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
        totalBooks,
        totalCopies,
        issuedCopies,
        todaysBorrows,
        todaysReturns,
        overdueBooks,
        pendingFines,
        lostBooks,
        recentlyBorrowed,
        todaysBorrowed,
        latestArrivals,
    ] = await Promise.all([
        bookService.countTotalBooks(),

        bookService.countTotalCopies(),

        bookCopyService.countIssuedBooks(),

        borrowService.countTodaysBorrowedBooks(),

        borrowService.countTodaysReturns(),

        borrowService.countOverdueBooks(),

        fineService.getPendingFineCount(),

        borrowService.countLostBooks(),

        borrowService.getRecentlyBorrowedBooks(),

        borrowService.getTodaysBorrowedBooks(),

        bookService.getLatestArrivals(),

    ]);

    return {

        stats: {
            totalBooks,
            totalCopies,
            issuedCopies,
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

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
    const [
    totalBooks,
    totalCopies,
    issuedCopies,
    lostCopies,
    pendingFines,
    totalStudents,
    totalLibrarians,
    latestArrivals,
    ] = await Promise.all([
    bookService.countTotalBooks(),
    bookService.countTotalCopies(),
    bookCopyService.countIssuedBooks(),
    bookCopyService.countLostCopies(),
    fineService.getPendingFineCount(),
    userService.countStudents(),
    userService.countLibrarians(),
    bookService.getLatestArrivals(),
    ]);

    return {
        stats: {
            totalBooks,
            totalCopies,
            issuedCopies,
            lostCopies,
            pendingFines,
            totalStudents,
            totalLibrarians,
        },
        latestArrivals,
    }
}