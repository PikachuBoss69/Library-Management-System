import { api } from "./axios";

interface BorrowedBook {
    borrowId: string;
    copyId: string;
    accessionNumber: string;
    title: string;
    author: string;
    dueDate: string;
    borrowedOn: string;
}

interface RecentlyAddedBook {
    bookId: string;
    title: string;
    author: string;
    availableCopies: number;
    language: string
}

interface StudnetStats {
    borrowedBooksCount: number;
    pendingFineAmount: number;
    returnDeadline: Date,
}

export interface StudentDashboardData {
    stats : StudnetStats
    borrowedBooks: BorrowedBook[];
    recentlyAddedBooks: RecentlyAddedBook[];
}

export interface StudentDashboardResponse {
    status: string;
    message: string;
    data: StudentDashboardData;
}

export async function getStudentDashboard(): Promise<StudentDashboardResponse> {

    const response = await api.get(
        "/dashboard/student"
    );

    return response.data;
}