export type FineStatus = "pending" | "settled" | "waived";
export type FineReason = "late_return" | "lost_book" | "damage";


export interface FineQuery {
    page?: number;
    limit?: number;

    status?: FineStatus;

    reason?: FineReason;

    userId?: string;

    from?: string;
    to?: string;
}

export interface FineFilter {
    status?: FineStatus;
    reason?: FineReason;
    userId?: string;
    createdAt?: {
        $gte?: Date;
        $lte?: Date;
    };
}